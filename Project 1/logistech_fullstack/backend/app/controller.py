from typing import List
from fastapi import WebSocket
from sqlalchemy.orm import Session
from .models import Package, BinDB, ShipmentLogDB
from .queue_stack import ConveyorBelt, LoadingDock
from .algorithms import find_best_fit_bin
from datetime import datetime

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

class LogiMaster:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(LogiMaster, cls).__new__(cls)
            cls._instance.conveyor = ConveyorBelt()
            cls._instance.dock = LoadingDock()
            cls._instance.ws_manager = ConnectionManager()
        return cls._instance

    async def broadcast_state(self, db: Session):
        # Gather full state
        bins = db.query(BinDB).all()
        bin_data = [{"bin_id": b.bin_id, "capacity": b.capacity, "occupied": b.occupied, "location_code": b.location_code} for b in bins]
        
        state = {
            "type": "STATE_UPDATE",
            "conveyor": [p.dict() for p in self.conveyor.get_items()],
            "dock": [p.dict() for p in self.dock.get_items()],
            "bins": bin_data
        }
        await self.ws_manager.broadcast(state)

    def log_action(self, db: Session, tracking_id: str, status: str, bin_id: int = None):
        log = ShipmentLogDB(tracking_id=tracking_id, status=status, bin_id=bin_id, timestamp=datetime.utcnow())
        db.add(log)
        db.commit()

controller = LogiMaster()
