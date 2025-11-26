from fastapi import FastAPI, Depends, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .db import init_db, get_db
from .models import Package, Bin, Log, TruckLoadRequest, BinDB
from .controller import controller
from .algorithms import solve_backtracking, find_best_fit_bin

app = FastAPI(title="LogisTech API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(get_db)):
    await controller.ws_manager.connect(websocket)
    try:
        # Send initial state
        await controller.broadcast_state(db)
        while True:
            await websocket.receive_text() # Keep alive
    except WebSocketDisconnect:
        controller.ws_manager.disconnect(websocket)

@app.post("/packages")
async def add_package(package: Package, db: Session = Depends(get_db)):
    controller.conveyor.add_package(package)
    controller.log_action(db, package.tracking_id, "ARRIVED")
    await controller.broadcast_state(db)
    return {"message": "Package added"}

@app.post("/process")
async def process_next_package(db: Session = Depends(get_db)):
    package = controller.conveyor.pop_package()
    if not package:
        raise HTTPException(status_code=400, detail="Conveyor empty")

    # Sort bins by capacity for Binary Search
    bins = db.query(BinDB).order_by(BinDB.capacity).all()
    best_bin = find_best_fit_bin(bins, package.size)

    if best_bin:
        best_bin.occupied += package.size
        db.commit()
        controller.log_action(db, package.tracking_id, "STORED", best_bin.bin_id)
        await controller.broadcast_state(db)
        return {"status": "stored", "bin_id": best_bin.bin_id}
    else:
        # Return to conveyor or handle error? For now, just log failure
        controller.log_action(db, package.tracking_id, "FAILED_NO_BIN")
        await controller.broadcast_state(db)
        return {"status": "failed", "reason": "No suitable bin"}

@app.post("/load-truck")
async def load_truck(package: Package, db: Session = Depends(get_db)):
    controller.dock.load_package(package)
    controller.log_action(db, package.tracking_id, "LOADED")
    await controller.broadcast_state(db)
    return {"message": "Loaded"}

@app.post("/rollback")
async def rollback_load(db: Session = Depends(get_db)):
    package = controller.dock.rollback()
    if package:
        controller.log_action(db, package.tracking_id, "ROLLEDBACK")
        await controller.broadcast_state(db)
        return {"message": "Rolled back", "package": package}
    return {"message": "Dock empty"}

@app.post("/backtracking", response_model=List[Package])
def run_backtracking(request: TruckLoadRequest):
    return solve_backtracking(request.packages, request.capacity)

@app.get("/logs", response_model=List[Log])
def get_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Log).order_by(Log.timestamp.desc()).offset(skip).limit(limit).all()
