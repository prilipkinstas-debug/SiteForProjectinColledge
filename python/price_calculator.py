from collections import defaultdict
from contextlib import closing
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from getpass import getpass
from os import environ
from pathlib import Path
from statistics import median
import sqlite3
import mysql.connector


MYSQL_HOST = ""         #Адрес сервера Mysql
MYSQL_PORT = 3306       #порт
MYSQL_USER = ""         #Логин Mysql
SOURCE_DATABASE = ""    #Название базы
SOURCE_TABLE = ""       #таблица с исходными ценами
ID_COLUMN = "ProductId" #Реальное название столбца товара
PRICE_COLUMN = "Price"  #Реальное название столбца цены
SQLITE_FILE = Path(__file__).resolve().with_name("prices.db")


def sql_name(value):
    return "`" + value.replace("`", "``") + "`"


def main():
    if not all((MYSQL_HOST, MYSQL_USER, SOURCE_DATABASE, SOURCE_TABLE)):
        raise SystemExit("Заполни MYSQL_HOST, MYSQL_USER, SOURCE_DATABASE, SOURCE_TABLE.")
    password = environ.get("MYSQL_PASSWORD")
    if password is None:
        password = getpass("Пароль MySQL: ")

    prices_by_product = defaultdict(list)
    with closing(mysql.connector.connect(
        host=MYSQL_HOST, port=MYSQL_PORT, user=MYSQL_USER,
        password=password, database=SOURCE_DATABASE, connection_timeout=10,
    )) as source:
        with closing(source.cursor()) as cursor:
            item, price = sql_name(ID_COLUMN), sql_name(PRICE_COLUMN)
            cursor.execute(
                f"SELECT {item}, {price} FROM {sql_name(SOURCE_TABLE)} "
                f"WHERE {item} IS NOT NULL AND {price} > 0"
            )
            for product_id, value in cursor:
                value = Decimal(str(value))
                if not value.is_finite():
                    raise ValueError(f"Некорректная цена товара {product_id}")
                prices_by_product[str(product_id)].append(value)

    updated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    results = []
    for product_id, prices in prices_by_product.items():
        final_price = (median(prices) * Decimal("0.95")).quantize(
            Decimal("0.01"), rounding=ROUND_HALF_UP
        )
        results.append((product_id, str(final_price), updated_at))

    # Обновляем только ReadyPrices целиком, в одной транзакции.
    # Пустой исходный набор очищает ReadyPrices; ошибка отменяет обновление.
    with closing(sqlite3.connect(SQLITE_FILE, timeout=30)) as target, target:
        target.execute("BEGIN IMMEDIATE")
        target.execute("""
            CREATE TABLE IF NOT EXISTS ReadyPrices (
                ProductId TEXT NOT NULL PRIMARY KEY,
                Price TEXT NOT NULL,
                UpdatedAt TEXT NOT NULL
            )
        """)
        target.execute("DELETE FROM ReadyPrices")
        target.executemany(
            "INSERT INTO ReadyPrices (ProductId, Price, UpdatedAt) VALUES (?, ?, ?)",
            results,
        )
    # Price — десятичная строка с двумя знаками, без погрешности float.
    print(f"Готово. Товаров: {len(results)}. Файл: {SQLITE_FILE}")


if __name__ == "__main__":
    main()