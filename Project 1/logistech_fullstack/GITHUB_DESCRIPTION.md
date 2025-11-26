# 📦 LogisTech - Intelligent Warehouse Orchestration System

**LogisTech** is a full-stack, automated warehouse management system designed to visualize and optimize logistics operations in real-time. It bridges the gap between complex algorithmic logic and modern, responsive user interfaces, serving as a robust demonstration of full-stack engineering capabilities.

## 🚀 Project Overview

The core mission of LogisTech is to simulate the lifecycle of a package within a smart facility—from arrival on a conveyor belt to intelligent storage allocation and final shipment loading. Unlike static CRUD applications, LogisTech is an **event-driven system** where every action is powered by fundamental computer science algorithms and reflected instantly across all connected clients via **WebSockets**.

This project was built to demonstrate how abstract data structures (Queues, Stacks, Trees) and algorithms (Binary Search, Backtracking) can be applied to solve real-world logistical problems in a production-grade software environment.

---

## 🛠️ Technical Architecture

The system is built as a decoupled micro-service architecture, containerized for easy deployment.

### **Frontend (The Control Center)**
- **Framework**: React 18 (Vite) for high-performance rendering.
- **Styling**: TailwindCSS for a modern, responsive, and clean UI.
- **Real-time**: Native WebSocket integration for sub-millisecond state updates without polling.
- **Visualization**: Dynamic components representing physical warehouse entities (Conveyor Belts, Storage Racks, Loading Docks).

### **Backend (The Brain)**
- **API**: FastAPI (Python 3.11) for high-concurrency asynchronous request handling.
- **Database**: SQLite with SQLAlchemy ORM for reliable persistence and audit logging.
- **Architecture**: Modular design separating API routes, business logic, and algorithmic solvers.
- **Validation**: Pydantic models ensure strict type safety and data integrity.

### **DevOps**
- **Docker & Docker Compose**: Fully containerized environment ensuring consistency across development and production.

---

## 🧠 Algorithmic Core

LogisTech is not just a management tool; it is an algorithmic engine. Each module implements specific CS concepts:

### 1. The Conveyor Belt (FIFO Queue)
**Implementation**: `collections.deque`
Incoming packages are processed in a strict **First-In-First-Out (FIFO)** order. This simulates a real physical conveyor belt where the first package to arrive is the first to be processed, ensuring fairness and preventing bottlenecks.

### 2. Intelligent Storage (Binary Search)
**Implementation**: `Binary Search Algorithm` (O(log n))
When a package needs to be stored, the system doesn't just pick a random bin. It uses a **Binary Search** algorithm to efficiently locate the "Best Fit" bin—the smallest available bin that can accommodate the package size. This minimizes wasted space and optimizes warehouse density.

### 3. Loading Dock (LIFO Stack)
**Implementation**: `Stack` (Last-In-First-Out)
Truck loading is modeled as a **LIFO** operation. Packages are stacked onto trucks, and if a mistake is made or a priority shipment changes, the system supports a **Rollback** feature that pops the last loaded item off the stack, mirroring physical unstacking.

### 4. Shipment Planner (Backtracking)
**Implementation**: `Recursive Backtracking`
The most complex module is the Shipment Planner. Given a set of pending packages and a truck with limited capacity, the system uses a **Backtracking algorithm** to explore all possible combinations of packages. It mathematically determines the optimal subset that maximizes the truck's utilization, solving the classic "Knapsack-style" optimization problem.

---

## ✨ Key Features

- **Live Dashboard**: Watch packages move through the system in real-time.
- **Audit Logging**: Every movement, storage, and loading action is recorded in an immutable SQL audit log.
- **Interactive Controls**: Manually override automated processes, trigger loading sequences, and run optimization solvers.
- **Responsive Design**: Fully functional on desktop and tablet devices.

## 🏁 Getting Started

The entire system is Dockerized for a one-command setup.

```bash
# Clone the repository
git clone https://github.com/yourusername/logistech.git

# Start the system
docker-compose up --build
```

Once running, access the dashboard at `http://localhost:5173` and the API documentation at `http://localhost:8000/docs`.

---

*Built with ❤️ using Python, React, and Computer Science.*
