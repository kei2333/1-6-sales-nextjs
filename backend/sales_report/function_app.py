from email import message
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

def ensure_sales_report_table_exists_and_seed(conn):
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS sales_report (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sales_date DATE,
        location_id INT NOT NULL,
        amount INT NOT NULL,
        sales_channel ENUM('SM','HC','CVS','DRUG','EC') NOT NULL,
        category ENUM('飲料','酒類') NOT NULL,    
        tactics ENUM('チラシ','エンド','企画') NOT NULL,
        employee_number INT NOT NULL,
        memo VARCHAR(300)
    );
    """
    with conn.cursor() as cursor:
        cursor.execute(create_table_sql)
    conn.commit()

    # すでにデータが存在するかチェック
    with conn.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) as cnt FROM sales_report;")
        result = cursor.fetchone()
        if result["cnt"] == 0:
            # ダミーデータ挿入
            seed_sql = """
            INSERT INTO sales_report (sales_date, location_id, amount, 
            sales_channel, category, tactics, employee_number, memo) VALUES
            ('2025-03-02', 1, 40000, 'SM', '飲料', 'チラシ', 0, '');
            """
            cursor.execute(seed_sql)
            conn.commit()
            logging.info("Inserted initial dummy data into sales_report table.")
            
# sales_dateをjsonに対応させるためにstring型に変換して表示する
class DateEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, date):
            return obj.isoformat()

# 一番初めに書いたやつ。DBに接続し、データがあるか確認して、それを表示します。
@app.route(route="get_sales")
def get_sales(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing get_sales HTTP request.")

    try:
        date=req.params.get('sales_date')
        location=req.params.get('location_id')
        if date and location:

            conn = get_db_connection()
            ensure_sales_report_table_exists_and_seed(conn)

            with conn.cursor() as cursor:
                cursor.execute("SELECT id, sales_date, location_id, amount, sales_channel, category, tactics, employee_number FROM sales_report WHERE sales_date = %s AND location_id=%s; ",(date,location,))
                sales_report = cursor.fetchall()

            conn.close()

            return func.HttpResponse(
                json.dumps(sales_report, ensure_ascii=False, cls=DateEncoder),
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

# 新しいデータをDBに送って登録する機能
@app.route(route="send_sales")
def send_sales(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing send_sales HTTP request.")
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        send_sql = """
            INSERT INTO sales_report (sales_date, location_id, amount, 
            sales_channel, category, tactics, employee_number, memo) VALUES
            ('2025-03-03', 2, 40000, 'SM', '飲料', 'チラシ', 0, '');  
            """
        cursor.execute(send_sql)
        conn.commit()
        cursor.execute("SELECT id, sales_date, location_id, amount, sales_channel, category, tactics, employee_number FROM sales_report;")
        sales_report = cursor.fetchall()
        cursor.close()
        conn.close()

    finally:
        return func.HttpResponse(
            status_code=200
        )
    

