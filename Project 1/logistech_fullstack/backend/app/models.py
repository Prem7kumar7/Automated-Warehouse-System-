from sqlalchemy import Column, Integer, String, Boolean, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

Base = declarative_base()

# --- SQLAlchemy Models (DB) ---

class BinDB(Base):
    __tablename__ = "bins"
    bin_id = Column(Integer, primary_key=True, index=True)
    capacity = Column(Integer, nullable=False)
    occupied = Column(Integer, default=0)
    location_code = Column(String, nullable=False)

class ShipmentLogDB(Base):
    __tablename__ = "shipment_logs"
    id = Column(Integer, primary_key=True, index=True)
    tracking_id = Column(String, nullable=False)
    bin_id = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False)

# --- Pydantic Schemas (API) ---

class Package(BaseModel):
    tracking_id: str
    size: int
    destination: str

class Bin(BaseModel):
    bin_id: int
    capacity: int
    occupied: int
    location_code: str

    class Config:
        orm_mode = True

class Log(BaseModel):
    id: int
    tracking_id: str
    bin_id: Optional[int]
    timestamp: datetime
    status: str

    class Config:
        orm_mode = True

class TruckLoadRequest(BaseModel):
    capacity: int
    packages: List[Package]
