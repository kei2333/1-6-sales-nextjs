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
        sales_date_from=req.params.get('sales_date_from')
        sales_date_until=req.params.get('sales_date_until')
        if date and location:
            #日付、拠点を指定してデータを見る
            conn = get_db_connection()
            ensure_sales_report_table_exists_and_seed(conn)

            with conn.cursor() as cursor:
                cursor.execute("SELECT s.id, s.sales_date, s.location_id, s.amount, s.sales_channel, s.category, s.tactics, s.employee_number, s.memo, u.employee_name FROM sales_report s LEFT JOIN users u ON s.employee_number = u.employee_number WHERE s.sales_date = %s AND s.location_id=%s; ",(date,location,))
                sales_report = cursor.fetchall()

            conn.close()

            return func.HttpResponse(
                json.dumps(sales_report, ensure_ascii=False, cls=DateEncoder),
                status_code=200,
                mimetype="application/json",
            )
        elif sales_date_from and sales_date_until and location:
            #日付の区間と拠点を設定して一拠点のデータを見る
            conn = get_db_connection()

            with conn.cursor() as cursor:
                cursor.execute("SELECT s.id, s.sales_date, s.location_id, s.amount, s.sales_channel, s.category, s.tactics, s.employee_number, s.memo, u.employee_name FROM sales_report s LEFT JOIN users u ON s.employee_number = u.employee_number WHERE s.sales_date BETWEEN %s AND %s AND s.location_id=%s; ",(sales_date_from, sales_date_until, location,))
                sales_report = cursor.fetchall()

            conn.close()

            return func.HttpResponse(
                json.dumps(sales_report, ensure_ascii=False, cls=DateEncoder),
                status_code=200,
                mimetype="application/json",
            )
        elif sales_date_from and sales_date_until:
            #日付の区間を設定して全拠点のデータを見るよう
            conn = get_db_connection()

            with conn.cursor() as cursor:
                cursor.execute("SELECT s.id, s.sales_date, s.location_id, s.amount, s.sales_channel, s.category, s.tactics, s.employee_number, s.memo, u.employee_name FROM sales_report s LEFT JOIN users u ON s.employee_number = u.employee_number WHERE s.sales_date BETWEEN %s AND %s; ",(sales_date_from, sales_date_until,))
                sales_report = cursor.fetchall()

            conn.close()

            return func.HttpResponse(
                json.dumps(sales_report, ensure_ascii=False, cls=DateEncoder),
                status_code=200,
                mimetype="application/json",
            )
        else:
            logging.error(f"Operational error: {e}")
            return func.HttpResponse(
                f"Database operational error: {str(e)}", status_code=500
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
        date=req.params.get('sales_date')
        location=req.params.get('location_id')
        amount=req.params.get('amount')
        sales_channel=req.params.get('sales_channel')
        category=req.params.get('category')
        tactics=req.params.get('tactics')
        employee_number=req.params.get('employee_number')
        memo=req.params.get('memo')

        if not date or not location or not amount:
            return func.HttpResponse(
                "Missing required parameters.",
                status_code=400
            )

        conn = get_db_connection()
        cursor = conn.cursor()
        send_sql = """
            INSERT INTO sales_report (sales_date, location_id, amount, 
            sales_channel, category, tactics, employee_number, memo) VALUES
            (%s, %s, %s, %s, %s, %s, %s, %s);  
            """
        cursor.execute(send_sql,(date,location,amount,sales_channel,category,tactics,employee_number,memo,))
        conn.commit()
        return func.HttpResponse(
            "Sales data inserted successfully.",
            status_code=200            
        )
    except Exception as e:
        logging.error(f"Error inserting sales data: {str(e)}")
        return func.HttpResponse(
            f"Failed to insert sales data. Error: {str(e)}",
            status_code=500
        )

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    
@app.route(route="get_employee")
def get_employee(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing get_employee HTTP request.")
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT employee_number, employee_name, location_id, employee_role FROM users;")
            employee = cursor.fetchall()
        return func.HttpResponse(
            json.dumps(employee, ensure_ascii=False),
            status_code=200,
            mimetype="application/json",
        )
    except pymysql.err.OperationalError as e:
        logging.error(f"Operational error: {e}")
        return func.HttpResponse(
            f"Database operational error: {str(e)}", status_code=500
        )
    finally:
        conn.close()

@app.route(route="add_employee")
def add_employee(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing add_employee HTTP request.")
    conn = get_db_connection()
    try:
        employee_number = req.params.get('employee_number')
        employee_name = req.params.get('employee_name')
        location_id = req.params.get('location_id')
        employee_role = req.params.get('employee_role')
        employee_password = req.params.get('employee_password')

        if not employee_number or not employee_name or not location_id or not employee_role:
            return func.HttpResponse(
                "Missing required parameters.",
                status_code=400
            )

        with conn.cursor() as cursor:
            insert_sql = """
                INSERT INTO users (employee_number, employee_name, location_id, employee_role, employee_password) VALUES
                (%s, %s, %s, %s, %s);
            """
            cursor.execute(insert_sql,(employee_number, employee_name, location_id, employee_role, employee_password,))
            conn.commit()
        return func.HttpResponse(
            "Employee data inserted successfully.",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error inserting employee data: {str(e)}")
        return func.HttpResponse(
            f"Failed to insert employee data. Error: {str(e)}",
            status_code=500
        )
    finally:
        conn.close()

@app.route(route="edit_employee_role")
def edit_employee_role(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing edit_employee_role HTTP request.")
    conn = get_db_connection()
    try:
        employee_number = req.params.get('employee_number')
        new_employee_role = req.params.get('employee_role')

        if not employee_number or not new_employee_role:
            return func.HttpResponse(
                "Missing required parameters.",
                status_code=400
            )

        with conn.cursor() as cursor:
            update_sql = """
                UPDATE users SET employee_role = %s WHERE employee_number = %s;
            """
            cursor.execute(update_sql,(new_employee_role, employee_number,))
            conn.commit()
        return func.HttpResponse(
            "Employee role updated successfully.",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error updating employee role: {str(e)}")
        return func.HttpResponse(
            f"Failed to update employee role. Error: {str(e)}",
            status_code=500
        )
    finally:
        conn.close()


@app.route(route="delete_employee")
def delete_employee(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing delete_employee HTTP request.")
    conn = get_db_connection()
    try:
        employee_number = req.params.get('employee_number')

        if not employee_number:
            return func.HttpResponse(
                "Missing required parameters.",
                status_code=400
            )

        with conn.cursor() as cursor:
            delete_sql = """
                DELETE FROM users WHERE employee_number = %s;
            """
            cursor.execute(delete_sql,(employee_number,))
            conn.commit()
        return func.HttpResponse(
            "Employee data deleted successfully.",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error deleting employee data: {str(e)}")
        return func.HttpResponse(
            f"Failed to delete employee data. Error: {str(e)}",
            status_code=500
        )
    finally:
        conn.close()

@app.route(route="update_employee_name")
def update_employee_name(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing update_employee_name HTTP request.")
    conn = get_db_connection()
    try:
        # リクエストボディから employee_number と new_employee_name を取得
        employee_number = req.params.get('employee_number')
        new_employee_name = req.params.get('new_employee_name')

        # 必要なパラメータが欠けている場合、エラーレスポンスを返す
        if not employee_number or not new_employee_name:
            return func.HttpResponse(
                "Missing required parameters: employee_number or employee_name.",
                status_code=400
            )

        with conn.cursor() as cursor:
            # 名前を更新するSQL文
            update_sql = """
                UPDATE users
                SET employee_name = %s
                WHERE employee_number = %s;
            """
            cursor.execute(update_sql, (new_employee_name, employee_number))
            conn.commit()

            # 更新された行数をチェック
            if cursor.rowcount == 0:
                return func.HttpResponse(
                    "Employee not found.",
                    status_code=404
                )

        return func.HttpResponse(
            "Employee name updated successfully.",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error updating employee name: {str(e)}")
        return func.HttpResponse(
            f"Failed to update employee name. Error: {str(e)}",
            status_code=500
        )
    finally:
        conn.close()

# get_employee for callback after logging in
@app.route(route="get_employee_callback")
def get_employee_callback(req: func.HttpRequest) -> func.HttpResponse:
    email = req.params.get('email')
    if not email:
        return func.HttpResponse("Email parameter missing", status_code=400)

    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT employee_role, location_id FROM users WHERE employee_address = %s;",
                (email,)
            )
            row = cursor.fetchone()
 
        if not row:
            return func.HttpResponse(json.dumps({}), status_code=200, mimetype="application/json")

        return func.HttpResponse(
            json.dumps({"employee_role": row[0], "region": row[1]}),
            status_code=200,
            mimetype="application/json"
        )
    except Exception as e:
        logging.error(f"get_employee_callback error: {e}")
        return func.HttpResponse(
            "Internal server error",
            status_code=500
        )
    finally:
        conn.close()

