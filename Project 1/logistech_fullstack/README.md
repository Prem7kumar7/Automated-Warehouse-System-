# LogisTech - Full Stack Warehouse Orchestration

A modern automated warehouse system with real-time visualization.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, WebSockets
- **Backend**: FastAPI (Python 3.11), SQLite, SQLAlchemy
- **Infrastructure**: Docker Compose

## Features
- **Real-time Updates**: WebSockets push state changes instantly.
- **Smart Storage**: Binary Search algorithm for best-fit bin selection.
- **Truck Loading**: Stack-based loading with Rollback capability.
- **Planner**: Backtracking algorithm to optimize shipment packing.
- **Audit Logs**: Full history of all actions.

## Quick Start

1. **Run with Docker Compose** (Recommended)
   ```bash
   docker-compose up --build
   ```

2. **Access the App**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

3. **Seed Demo Data** (Optional)
   Open a new terminal and run:
   ```bash
   python demo_seed.py
   ```
   *Note: Requires `requests` library (`pip install requests`)*

## Manual Setup (Dev Mode)

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
