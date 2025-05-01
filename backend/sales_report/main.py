from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import date
from sqlalchemy import create_engine, Column, Integer, String, Date, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from enum import Enum
from dotenv import load_dotenv
from pathlib import Path
import os

# 環境変数の読み込み
load_dotenv()

# SSL証明書パス（絶対パスに変換）
ssl_ca_path = Path(os.getenv("SSL_CA_PATH")).resolve()

# FastAPIインスタンス作成
app = FastAPI()

# DB設定（ここではAzure MySQLフレキシブルサーバーを使用）
DATABASE_URL = (
    f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}?ssl_ca={ssl_ca_path}"
)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemyモデル定義
class Sales(Base):
    __tablename__ = "sales_report"

    id = Column(Integer, primary_key=True, index=True)
    sales_date = Column(Date, nullable=False)
    location_id = Column(Integer, nullable=False)
    amount = Column(Integer, nullable=False)
    sales_channel = Column(Enum, nullable=False)
    category = Column(Enum, nullable=False)    
    tactics = Column(Enum, nullable=False)
    employee_number = Column(Integer, nullable=False)
    memo = Column(String(300), nullable=True)

# テーブル作成
Base.metadata.create_all(bind=engine)

class Channel(Enum):
    SM=0
    HC=1
    CVS=2
    DRUG=3
    EC=4

class Category(Enum):
    Drink=0
    Alchohol=1
    Food=2
    Other=3

class Tactics(Enum):
    Chirashi=0
    End=1
    Kikaku=2

class Location(Enum):
    KAT=0
    HOK=1
    TOK=2
    KIN=3
    CHU=4
    KYU=5


# Pydanticモデル定義（リクエスト用）
class SalesCreate(BaseModel):
    sales_date: date
    location_id: int
    amount: int
    sales_channel: Enum
    category: Enum
    tactics: Enum    
    employee_number: int
    memo: str

# POSTエンドポイント
@app.post("/sales_report/")
def create_sales(expense: SalesCreate):
    db = SessionLocal()
    try:
        db_sales_report = Sales(**expense.dict())
        db.add(db_sales_report)
        db.commit()
        db.refresh(db_sales_report)
        return {"message": "Expense recorded", "id": db_sales_report.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
