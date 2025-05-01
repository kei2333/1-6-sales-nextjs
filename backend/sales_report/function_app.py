import azure.functions as func
import logging
import pymysql
from datetime import date
from enum import Enum
from pathlib import Path
import os
import json

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

# DB設定（ここではAzure MySQLフレキシブルサーバーを使用）
def get_db_connection():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            cursorclass=pymysql.cursors.DictCursor,
            connect_timeout=5,
            ssl={"fake_flag_to_enable_tls": True},
        )
        return conn
    except pymysql.MySQLError as e:
        logging.error(f"MySQL connection error: {e}")
        raise

def ensure_sales_management_table_exists_and_seed(conn):
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS sales_management (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sales_date DATE NOT NULL,
        location_id INT NOT NULL,
        amount INT NOT NULL,
        sales_channel ENUM NOT NULL,
        category ENUM NOT NULL,    
        tactics ENUM NOT NULL,
        employee_number INT NOT NULL,
        memo VARCHAR(300) NOT NULL
    );
    """
    with conn.cursor() as cursor:
        cursor.execute(create_table_sql)
    conn.commit()

    # すでにデータが存在するかチェック
    with conn.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) as cnt FROM sales_management;")
        result = cursor.fetchone()
        if result["cnt"] == 0:
            # ダミーデータ挿入
            seed_sql = """
            INSERT INTO sales_management (sales_date, location_id, amount, 
            sales_channel, category, tactics, employee_number, memo) VALUES
            ('2025-03-02', 1, 40000, 0, 0, 0, 0, '');
            """
            cursor.execute(seed_sql)
            conn.commit()
            logging.info("Inserted initial dummy data into sales_management table.")

@app.route(route="create_sales")
def create_sales(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing create_sales HTTP request.")

    try:
        conn = get_db_connection()
        ensure_sales_management_table_exists_and_seed(conn)

        with conn.cursor() as cursor:
            cursor.execute("SELECT id, title, is_completed FROM sales_management;")
            sales_management = cursor.fetchall()

        conn.close()

        return func.HttpResponse(
            json.dumps(sales_management, ensure_ascii=False),
            status_code=200,
            mimetype="application/json",
        )

    except pymysql.err.OperationalError as e:
        logging.error(f"Operational error: {e}")
        return func.HttpResponse(
            f"Database operational error: {str(e)}", status_code=500
        )

    except pymysql.err.ProgrammingError as e:
        logging.error(f"Programming error: {e}")
        return func.HttpResponse(
            f"Database programming error: {str(e)}", status_code=500
        )

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return func.HttpResponse(f"Unexpected error: {str(e)}", status_code=500)


# class Channel(Enum):
#     SM=0
#     HC=1
#     CVS=2
#     DRUG=3
#     EC=4

# class Category(Enum):
#     Drink=0
#     Alchohol=1
#     Food=2
#     Other=3

# class Tactics(Enum):
#     Chirashi=0
#     End=1
#     Kikaku=2

# class Location(Enum):
#     KAT=0
#     HOK=1
#     TOK=2
#     KIN=3
#     CHU=4
#     KYU=5


# POSTエンドポイント
# @app.post("/create_sales/")
# def create_sales(expense: SalesCreate):
#     db = SessionLocal()
#     try:
#         db_sales_report = Sales(**expense.dict())
#         db.add(db_sales_report)
#         db.commit()
#         db.refresh(db_sales_report)
#         return {"message": "Expense recorded", "id": db_sales_report.id}
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         db.close()
