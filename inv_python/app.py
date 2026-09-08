"""
Simple Inventory Report Generator (Python utility)
Connects to the same MongoDB and prints a summary report.
"""

import os
from dotenv import load_dotenv
from pymongo import MongoClient
from tabulate import tabulate
from datetime import datetime

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../backend/.env'))

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/inventory_db')

def main():
    client = MongoClient(MONGODB_URI)
    db = client.get_default_database() or client['inventory_db']

    products = list(db.products.find({'isActive': True}))
    categories = {str(c['_id']): c['name'] for c in db.categories.find()}

    print("=" * 60)
    print(f"  INVENTORY REPORT — {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print("=" * 60)

    total_items = len(products)
    total_qty = sum(p.get('quantity', 0) for p in products)
    total_value = sum(p.get('quantity', 0) * p.get('price', 0) for p in products)
    low_stock = [p for p in products if p.get('quantity', 0) <= p.get('lowStockThreshold', 10)]

    print(f"\nTotal Products     : {total_items}")
    print(f"Total Stock Qty    : {total_qty}")
    print(f"Inventory Value    : Rs {total_value:,.2f}")
    print(f"Low Stock Items    : {len(low_stock)}")

    if products:
        rows = []
        for p in products:
            cat = categories.get(str(p.get('category')), '-')
            status = "LOW" if p.get('quantity', 0) <= p.get('lowStockThreshold', 10) else "OK"
            rows.append([
                p.get('sku', ''),
                p.get('name', '')[:30],
                cat,
                p.get('quantity', 0),
                f"Rs {p.get('price', 0)}",
                status
            ])
        print("\n" + tabulate(rows, headers=['SKU', 'Name', 'Category', 'Qty', 'Price', 'Status'], tablefmt='grid'))

    if low_stock:
        print("\n⚠️  LOW STOCK ALERTS:")
        for p in low_stock:
            print(f"  - {p.get('name')} ({p.get('sku')}): {p.get('quantity')} left (threshold {p.get('lowStockThreshold')})")

    print("\nDone.")
    client.close()

if __name__ == '__main__':
    main()
