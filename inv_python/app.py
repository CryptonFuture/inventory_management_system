"""
Inventory Report API
FastAPI + MongoDB
"""

import os
from datetime import datetime

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv(
    "MONGODB_URI",
    "mongodb://localhost:27017/inventory_db"
)

app = FastAPI(
    title="Inventory Report API",
    version="1.0.0"
)

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=10000,
    connectTimeoutMS=10000,
)

db = client.get_default_database()

if db is None:
    db = client["inventory_db"]


@app.get("/")
def root():
    return {
        "success": True,
        "message": "Inventory Report API is running"
    }


@app.get("/health")
def health():
    try:
        client.admin.command("ping")

        return {
            "success": True,
            "status": "healthy",
            "database": "connected"
        }

    except Exception as error:
        return {
            "success": False,
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error)
        }


@app.get("/report")
def generate_report():

    try:
        products = list(
            db.products.find({
                "isActive": True
            })
        )

        categories = {
            str(category["_id"]): category["name"]
            for category in db.categories.find()
        }

        total_items = len(products)

        total_qty = sum(
            product.get("quantity", 0)
            for product in products
        )

        total_value = sum(
            product.get("quantity", 0)
            * product.get("price", 0)
            for product in products
        )

        low_stock = [
            product
            for product in products
            if product.get("quantity", 0)
            <= product.get("lowStockThreshold", 10)
        ]

        product_rows = []

        for product in products:

            category = categories.get(
                str(product.get("category")),
                "-"
            )

            quantity = product.get("quantity", 0)

            threshold = product.get(
                "lowStockThreshold",
                10
            )

            status = (
                "LOW"
                if quantity <= threshold
                else "OK"
            )

            product_rows.append({
                "sku": product.get("sku", ""),
                "name": product.get("name", ""),
                "category": category,
                "quantity": quantity,
                "price": product.get("price", 0),
                "status": status
            })

        return {
            "success": True,
            "generatedAt": datetime.now().isoformat(),

            "summary": {
                "totalProducts": total_items,
                "totalStockQuantity": total_qty,
                "inventoryValue": total_value,
                "lowStockItems": len(low_stock)
            },

            "products": product_rows,

            "lowStockAlerts": [
                {
                    "name": product.get("name", ""),
                    "sku": product.get("sku", ""),
                    "quantity": product.get("quantity", 0),
                    "threshold": product.get(
                        "lowStockThreshold",
                        10
                    )
                }
                for product in low_stock
            ]
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )