from decimal import Decimal, ROUND_HALF_UP
from statistics import median

def calculate_price (prices):
    values = [Decimal(str(price)) for
    price in prices]

    if not values:
        return None
    if any(not price.is_finite() or price <= 0 for price in values):
        raise ValueError ("Каждая цена должна быть конечным числом больше нуля.")

    median_price = median(values)

    final_price = median_price * Decimal("0.95")

    final_price = final_price.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    return median_price, final_price

def main():
    prices = [160, 1000, 100, 140, 120]
    result = calculate_price(prices)
    if result is None:
        print("Нет цен для расчета.")
        return
    median_price, finaly_price = result 
    print (f"Количество цен:{len(prices)}")
    print (f"Медиана:{median_price}")
    print (f"Цена после вычета 5%:{finaly_price:.2f}")

if __name__ == "__main__":
    main()