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
            cursor.execute("SELECT employee_number, employee_name, location_id, employee_role, employee_address FROM users;")
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

# get_employee for callback after logging in
@app.route(route="get_employee_callback")
def get_employee_callback(req: func.HttpRequest) -> func.HttpResponse:
    employee_address = req.params.get('employee_address')
    if not employee_address:
        return func.HttpResponse("employee_address parameter missing", status_code=400)
 
    conn = get_db_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT employee_name, employee_number, employee_role, location_id FROM users WHERE employee_address = %s;",
                (employee_address,)
            )
            row = cursor.fetchone()
 
        if not row:
            return func.HttpResponse(
                json.dumps({}),
                status_code=200,
                mimetype="application/json"
            )
 
        return func.HttpResponse(
            json.dumps({
                "employee_name": row["employee_name"],
                "employee_number": row["employee_number"],
                "employee_role": row["employee_role"],
                "location_id": row["location_id"]
            }),
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

@app.route(route="edit_employee")
def edit_employee(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing edit_employee HTTP request.")
    conn = get_db_connection()
    try:
        employee_number = req.params.get('employee_number')
        new_employee_name = req.params.get('employee_name')
        new_employee_role = req.params.get('employee_role')
        new_employee_address = req.params.get('employee_address')
        new_location_id = req.params.get('location_id')

        if not employee_number:
            return func.HttpResponse(
                "Missing required parameter: employee_number.",
                status_code=400
            )

        update_fields = []
        update_values = []

        if new_employee_name:
            update_fields.append("employee_name = %s")
            update_values.append(new_employee_name)
        if new_employee_role:
            update_fields.append("employee_role = %s")
            update_values.append(new_employee_role)
        if new_employee_address:
            update_fields.append("employee_address = %s")
            update_values.append(new_employee_address)
        if new_location_id:
            update_fields.append("location_id = %s")
            update_values.append(new_location_id)

        if not update_fields:
            return func.HttpResponse(
                "No update fields provided.",
                status_code=400
            )

        update_values.append(employee_number)

        update_sql = f"""
            UPDATE users SET {', '.join(update_fields)} WHERE employee_number = %s;
        """

        with conn.cursor() as cursor:
            cursor.execute(update_sql, tuple(update_values))
            conn.commit()

            if cursor.rowcount == 0:
                return func.HttpResponse(
                    "Employee not found.",
                    status_code=404
                )

        return func.HttpResponse(
            "Employee updated successfully.",
            status_code=200
        )
    except Exception as e:
        logging.error(f"Error updating employee: {str(e)}")
        return func.HttpResponse(
            f"Failed to update employee. Error: {str(e)}",
            status_code=500
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
        employee_address = req.params.get('employee_address')

        if not employee_number or not employee_name or not location_id or not employee_role:
            return func.HttpResponse(
                json.dumps({"error": "Missing required parameters."}),
                status_code=400,
                mimetype="application/json"
            )

        with conn.cursor() as cursor:
            insert_sql = """
                INSERT INTO users (employee_number, employee_name, location_id, employee_role, employee_address)
                VALUES (%s, %s, %s, %s, %s);
            """
            cursor.execute(insert_sql, (employee_number, employee_name, location_id, employee_role, employee_address))
            conn.commit()

        return func.HttpResponse(
            json.dumps({"message": "Employee data inserted successfully."}),
            status_code=200,
            mimetype="application/json"
        )
    except Exception as e:
        logging.error(f"Error inserting employee data: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": f"Failed to insert employee data. Error: {str(e)}"}),
            status_code=500,
            mimetype="application/json"
        )
    finally:
        conn.close()

@app.route(route="get_sales_target")
def get_sales_target(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing get_sales_target HTTP request.")
    conn = get_db_connection()
    location_id = req.params.get('location_id') or 'all'

    try:
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            if location_id == 'all':
                sql = "SELECT id, target_date, location_id, target_amount, memo FROM sales_target;"
                cursor.execute(sql)
            else:
                sql = "SELECT id, target_date, location_id, target_amount, memo FROM sales_target WHERE location_id = %s;"
                cursor.execute(sql, (location_id,))
            
            sales_targets = cursor.fetchall()
            logging.info(f"Fetched {len(sales_targets)} records.")

        return func.HttpResponse(
            json.dumps(sales_targets, ensure_ascii=False),
            status_code=200,
            mimetype="application/json",
        )
    except pymysql.MySQLError as e:
        logging.error(f"MySQL error: {e}")
        return func.HttpResponse(
            f"MySQL error: {str(e)}", status_code=500
        )
    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        return func.HttpResponse(
            f"Unexpected server error: {str(e)}", status_code=500
        )
    finally:
        conn.close()

@app.route(route="post_sales_target", methods=["POST"])
def post_sales_target(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Processing post_sales_target HTTP request.")
    conn = None

    try:
        req_body = req.get_json()
        target_date = req_body.get('target_date')
        location_id = req_body.get('location_id')
        target_amount = req_body.get('target_amount')
        comment = req_body.get('comment')

        # 入力値検証
        if not (target_date and location_id and target_amount):
            return func.HttpResponse(
                "Missing required fields.", status_code=400
            )

        conn = get_db_connection()
        with conn.cursor() as cursor:
            sql = """
                INSERT INTO sales_target (target_date, location_id, target_amount, comment)
                VALUES (%s, %s, %s, %s)
            """
            cursor.execute(sql, (target_date, location_id, target_amount, comment))
        conn.commit()

        return func.HttpResponse(
            json.dumps({'message': 'Target added successfully'}, ensure_ascii=False),
            status_code=201,
            mimetype="application/json",
        )
    except Exception as e:
        logging.error(f"Error: {e}")
        return func.HttpResponse(
            f"Error processing request: {str(e)}", status_code=500
        )
    finally:
        if conn:
            conn.close()