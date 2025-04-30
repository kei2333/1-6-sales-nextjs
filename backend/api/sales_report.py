from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import date
from sqlalchemy import create_engine, Column, Integer, String, Date, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# FastAPIインスタンス作成
app = FastAPI()

# DB設定（ここではSQLiteを使用）
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemyモデル定義
class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, nullable=False)
    amount = Column(Float, nullable=False)
    employee_number = Column(String, nullable=False)
    category = Column(String, nullable=False)
    location = Column(String, nullable=True)
    memo = Column(String, nullable=True)

# テーブル作成
Base.metadata.create_all(bind=engine)

# Pydanticモデル定義（リクエスト用）
class ExpenseCreate(BaseModel):
    date: date
    amount: float
    employee_number: str
    category: str
    location: str = None
    memo: str = None

# POSTエンドポイント
@app.post("/expenses/")
def create_expense(expense: ExpenseCreate):
    db = SessionLocal()
    try:
        db_expense = Expense(**expense.dict())
        db.add(db_expense)
        db.commit()
        db.refresh(db_expense)
        return {"message": "Expense recorded", "id": db_expense.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
