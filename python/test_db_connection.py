from getpass import getpass
from mssql_python import connect

password = getpass("Пароль SQL Server для Specialist: ")
connection = connect(
    server="192.168.5.128,1433",
    database="SiteFromProject",
    uid="Specialist",
    pwd=password,
    encrypt="yes",
    trust_server_certificate="no",
    timeout=10,
    autocommit=True,
)

connection.timeout = 15 
cursor = connection.cursor()

cursor.execute("SELECT DB_NAME(), ORIGINAL_LOGIN();")
database, login = cursor.fetchall()

print("Подключение успешно!")
print(f"База: {database}")
print(f"Логин: {login}")

cursor.close()
connection.close()
