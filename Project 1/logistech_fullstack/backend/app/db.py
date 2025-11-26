from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from .models import Base, BinDB

SQLALCHEMY_DATABASE_URL = "sqlite:///./logistech.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    
    # Seed initial bins if empty
    db = SessionLocal()
    if db.query(BinDB).count() == 0:
        bins = [
            BinDB(capacity=5, location_code="A1"),
            BinDB(capacity=10, location_code="A2"),
            BinDB(capacity=20, location_code="B1"),
            BinDB(capacity=50, location_code="B2"),
            BinDB(capacity=100, location_code="C1"),
            BinDB(capacity=100, location_code="C2"),
            BinDB(capacity=200, location_code="D1"),
        ]
        db.add_all(bins)
        db.commit()
    db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
