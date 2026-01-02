# Product & Inventory Management Flow

## Overview
This document explains the complete flow of adding products and managing inventory in the Morpankh Saree e-commerce system.

---

## 📦 Product Creation Flow

### Step 1: Create Product (Admin Panel)
**Location:** `/admin/products` → Click "Add Product"

**Process:**
1. Admin fills in product details:
   - Product name, description, SKU, barcode
   - Category selection
   - Base price, compare at price, cost price
   - Product images (URLs or uploaded files)
   - Tags, fabric type, saree length
   - Display flags (Featured, Premium, Trending, Categories)

2. **Optional:** Add Product Variants
   - Variant name (e.g., "Color: Blue, Size: M")
   - Color, fabric, occasion
   - Variant-specific price (overrides base price)
   - Variant SKU and barcode
   - **Variant Code** (QR code format: e.g., "SR-SILK-RED-001")

3. **Backend Processing:**
   ```javascript
   // When product is created:
   - Product record is created in database
   - If variants provided, variant records are created
   - **Initial inventory record is automatically created:**
     * Type: ONLINE
     * Quantity: 0 (default)
     * Reserved: 0
   ```

### Step 2: Initial Inventory Setup
**What Happens:**
- Product is created with **quantity: 0** by default
- Inventory record is created automatically for ONLINE stock type
- Product is now visible in admin panel but has no stock

---

## 📊 Inventory Management Flow

### Method 1: Barcode/QR Code Scanning (Recommended)
**Location:** `/admin/inventory`

**Process:**

1. **Scan or Enter Identifier:**
   - **Barcode:** Product or variant barcode
   - **Variant Code (QR):** Format like "SR-SILK-RED-001"
   - System automatically detects which type

2. **Select Transaction Type:**
   - **Stock IN:** Adding inventory (receiving stock)
   - **Stock OUT:** Removing inventory (sales, returns, adjustments)

3. **Enter Details:**
   - Quantity
   - Stock Type (ONLINE or OFFLINE)
   - Optional notes

4. **System Processing:**
   ```
   Step 1: Find Product/Variant
   ├─ Try variant_code (QR) first
   ├─ If not found, try variant barcode
   └─ If not found, try product barcode
   
   Step 2: Find or Create Inventory Record
   ├─ Check if inventory exists for (productId, variantId, stockType)
   └─ If not exists, create new inventory record with quantity: 0
   
   Step 3: Update Inventory
   ├─ For IN: Add quantity
   ├─ For OUT: Subtract quantity (with validation)
   └─ Ensure quantity never goes below 0
   
   Step 4: Create Stock Log
   ├─ Record transaction type (IN/OUT)
   ├─ Store quantity, reason, notes
   └─ Track who scanned (admin/staff ID)
   ```

### Method 2: Direct Product Edit (Future Enhancement)
Currently, inventory is managed through the scanning interface. Direct quantity updates through product edit page can be added if needed.

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCT CREATION                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Admin Creates Product             │
        │  - Basic Info (name, price, etc.)  │
        │  - Optional Variants               │
        │  - Images                          │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  System Auto-Creates:             │
        │  ✓ Product Record                 │
        │  ✓ Variant Records (if any)       │
        │  ✓ Inventory Record (qty: 0)     │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Product Status:                  │
        │  - Active: Yes                     │
        │  - Stock: 0 (No inventory yet)    │
        └───────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  INVENTORY MANAGEMENT                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Admin Goes to Inventory Page     │
        │  /admin/inventory                 │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Scan/Enter:                      │
        │  - Barcode OR                      │
        │  - Variant Code (QR)              │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Select Transaction:              │
        │  - Stock IN (Add)                 │
        │  - Stock OUT (Remove)             │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Enter Quantity & Details         │
        │  - Quantity                       │
        │  - Stock Type (ONLINE/OFFLINE)    │
        │  - Notes (optional)               │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  System Updates:                  │
        │  ✓ Inventory Quantity             │
        │  ✓ Creates Stock Log Entry        │
        │  ✓ Updates Timestamp              │
        └───────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────┐
        │  Product Now Has Stock            │
        │  - Available for purchase         │
        │  - Visible on frontend            │
        └───────────────────────────────────┘
```

---

## 📋 Key Components

### 1. Product Model
- **Basic Info:** name, description, SKU, barcode, price
- **Images:** Array of image URLs
- **Variants:** Optional product variants (colors, sizes, etc.)
- **Display Flags:** Featured, Premium, Trending, Categories

### 2. Product Variant Model
- **Variant Details:** name, color, fabric, occasion
- **Pricing:** Can override base product price
- **Identifiers:**
  - SKU (unique)
  - Barcode (unique, optional)
  - **Variant Code** (unique, QR format: "SR-SILK-RED-001")

### 3. Inventory Model
- **Tracking:** Quantity per product/variant/stock type
- **Stock Types:** ONLINE, OFFLINE
- **Reserved Stock:** For pending orders
- **Low Stock Threshold:** Default 5 units

### 4. Stock Log Model
- **Transaction History:** All IN/OUT operations
- **Tracking:** Who, when, why, quantity
- **Audit Trail:** Complete history of stock movements

---

## 🔍 Inventory Lookup Priority

When scanning a barcode/variant code, the system searches in this order:

1. **Variant Code (QR)** - Highest priority
   - Format: "SR-SILK-RED-001"
   - Unique identifier for variants

2. **Variant Barcode**
   - Barcode assigned to specific variant

3. **Product Barcode**
   - Barcode assigned to base product

---

## 📝 Stock Transaction Types

### Stock IN (Adding Inventory)
- **Use Cases:**
  - Receiving new stock from supplier
  - Returns from customers
  - Stock adjustments (corrections)
  - Transfer from offline to online

- **Process:**
  ```
  Current Quantity + Added Quantity = New Quantity
  ```

### Stock OUT (Removing Inventory)
- **Use Cases:**
  - Sales (when order is placed)
  - Damaged items
  - Stock adjustments (corrections)
  - Transfer from online to offline

- **Process:**
  ```
  Validates: Current Quantity >= Requested Quantity
  Current Quantity - Removed Quantity = New Quantity
  ```

---

## 🎯 Best Practices

### Product Creation
1. ✅ Always assign unique SKU for each product
2. ✅ Add barcode for easy scanning
3. ✅ Use variant codes (QR format) for variants
4. ✅ Set appropriate prices (base, compare, cost)
5. ✅ Upload high-quality product images

### Inventory Management
1. ✅ Use barcode/QR scanning for accuracy
2. ✅ Always scan when receiving stock (Stock IN)
3. ✅ Scan when items are sold/damaged (Stock OUT)
4. ✅ Add notes for important transactions
5. ✅ Regularly review stock logs for audit

### Stock Types
- **ONLINE:** Stock available for online orders
- **OFFLINE:** Stock in physical store
- Each product/variant can have separate quantities for each type

---

## 🔗 Related Pages

- **Product Management:** `/admin/products`
- **Inventory Management:** `/admin/inventory`
- **Stock Logs:** Available in inventory page (recent transactions)

---

## ⚠️ Important Notes

1. **Initial Stock:** Products are created with quantity 0
   - Must add stock via inventory page before product is available

2. **Variant Inventory:** Each variant has separate inventory
   - Product without variants: 1 inventory record
   - Product with 3 variants: 3 inventory records (one per variant)

3. **Stock Types:** Separate tracking for ONLINE and OFFLINE
   - Same product can have different quantities for each type

4. **Stock Logs:** All transactions are logged
   - Complete audit trail
   - Track who made changes
   - View transaction history

5. **Reserved Stock:** Reserved for pending orders
   - Prevents overselling
   - Automatically managed by system

---

## 🚀 Quick Start Guide

### Adding a New Product with Stock:

1. **Create Product:**
   - Go to `/admin/products`
   - Click "Add Product"
   - Fill in all required fields
   - Add variants if needed
   - Save product

2. **Add Inventory:**
   - Go to `/admin/inventory`
   - Scan/enter barcode or variant code
   - Select "Stock IN"
   - Enter quantity
   - Select stock type (ONLINE)
   - Click "Process Transaction"

3. **Verify:**
   - Check product in products list
   - Verify inventory quantity is updated
   - Check stock logs for transaction record

---

## 📊 Example Flow

**Scenario:** Adding a new Red Silk Saree

1. **Create Product:**
   ```
   Name: "Premium Red Silk Saree"
   SKU: "SR-SILK-RED-001"
   Base Price: ₹7,499
   Category: Sarees
   ```

2. **Add Variant:**
   ```
   Variant Name: "Color: Red, Fabric: Silk"
   Variant Code: "SR-SILK-RED-001"
   Variant SKU: "SR-SILK-RED-001-V1"
   Barcode: "1234567890123"
   ```

3. **Add Stock:**
   ```
   Scan: "SR-SILK-RED-001" (variant code)
   Transaction: Stock IN
   Quantity: 10
   Stock Type: ONLINE
   ```

4. **Result:**
   - Product is live on website
   - Inventory shows 10 units available
   - Stock log records the transaction
   - Product can be purchased by customers

---

This flow ensures accurate inventory tracking and provides a complete audit trail for all stock movements.

