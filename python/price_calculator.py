from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from getpass import getpass
from statistics import median
import pyodbc

Server="192.168.5.128,1433"
Login="Specialist"
SOURCE_DATEBASE=""
TARGET_DATABASE=""
SOURCE_TABLE=""
ID_COLUMN="ProductId"
Price_COLUMN="Price"
TARGET_TABLE="ReadyPrices"

def sql_name(value):
    return "[" + value.replace("]", "]]") + "]"

def odbc_value(value):
    return "{" + value.replace("}", "}}") + "}"

if not all((SOURCE_DATEBASE, TARGET_DATABASE, SOURCE_TABLE)):
    raise SystemExit("Заполни Source_database, target_database, source_table")
if SOURCE_DATEBASE.casefold() == TARGET_DATABASE.casefold():
    raise SystemExit("Для результата укажи другую базу данных")
drivers = pyodbc.drivers()
driver = next((name for name in ("ODBC Drive 18 for SQL Server", "ODBC Driver 17 for SQL Server")
               if name in drivers), None)
if driver is None:
    raise SystemExit("Установи Microsoft ODBC Driver 18 for SQL Server(x64).")
password = getpass("Пароль SQL Server для Specialist: ")
connection = pyodbc.connect(f"DRIVER={odbc_value(driver)}; SERVER={odbc_value(Server)};"f"DATABASE={odbc_value(TARGET_DATABASE)}; UID={odbc_value(Login)};"f"PWD={odbc_value(password)}; Encrypt=yes;TrustServerCertificate=no;", timeout=10, autocommit=False,)
try:
    connection.timeout = 60
    cursor = connection.cursor()
    cursor.execute("SET NOCOUNT ON; SET XACT_ABORT ON;")

    source = f"{sql_name(SOURCE_DATEBASE)}.[dbo].{sql_name(SOURCE_TABLE)}" 
    item, price = sql_name(Price_COLUMN)
    cursor.execute(f"SELECT{item}, {price} FROM {source}" f"WHERE{item} IS NOT NULL AND {price} > 0;")
    prices_by_product=defaultdict(list)
    for product_id, value in cursor:
        prices_by_product[str(product_id)].append(Decimal(str(value)))
        target = f"[dbo].{sql_name(TARGET_DATABASE)}"
        cursor.execute(f"""
        IF OBJECT_ID(?, 'U') IS NULL CREATE TABLE {target}(ProductId nvarchar(255) COLLATE Latin1_General_100_BIN2 PRIMARY KEY, Price decimal(28, 2) NOT NULL); """, target)
        for product_id in sorted(prices_by_product):
            prices = prices_by_product[product_id]
            final_price = (median(prices) * Decimal("0.95")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
            cursor.execute(f""" UPDATE {target} WITH (UPDLOCK, HOLDLOCK) SET Price = ? WHERE ProductId = ?; IF @@ROWCOUNT = 0 INSERT INTO {target}(ProductId, Price) VALUES (?, ?);""", final_price, product_id, product_id, final_price)
            while cursor.nextset():
                pass
            connection.commit()
            print(f"Готово. Сохранено товаров: {len(prices_by_product)}.")
except BaseException:
    connection.rollback()
    raise
finally:
    connection.close()