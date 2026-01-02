# How to Add Products and Manage Inventory - Step-by-Step Guide

## 📋 Overview

This guide will walk you through the complete process of:
1. Adding a new product to your store
2. Managing inventory for that product
3. Using barcode/QR code scanning for inventory updates

---

## 🛍️ Part 1: Adding a Product

### Step 1: Access Admin Panel

1. Go to your website: `https://your-domain.com/admin`
2. Log in with your admin credentials
3. You'll see the Admin Dashboard

### Step 2: Navigate to Products

1. Click on **"Products"** in the left sidebar
2. You'll see the Products page with a list of all products
3. Click the **"Add Product"** button (top right, blue button with + icon)

### Step 3: Fill in Product Information

#### Basic Information (Required Fields - Marked with *)

1. **Product Name*** 
   - Example: "Premium Green Party Wear Saree"
   - This will auto-generate a slug (URL-friendly name)

2. **SKU*** (Stock Keeping Unit)
   - Example: "1225" or "SR-PARTY-GREEN-001"
   - **Important:** This must be unique - no two products can have the same SKU
   - Use the code from your price tag/bill

3. **Category***
   - Select from dropdown: Silk, Cotton, Designer, etc.
   - If category doesn't exist, create it first in Categories section

4. **Base Price (₹)***
   - Example: `750.00` (your selling price)
   - This is the price customers will pay

#### Additional Information (Optional but Recommended)

5. **Slug**
   - Auto-generated from product name
   - You can edit it manually if needed
   - Example: "premium-green-party-wear-saree"

6. **Barcode**
   - Enter the barcode from your price tag
   - Used for inventory scanning
   - Example: The barcode number from the bill

7. **Compare At Price (₹)**
   - Example: `950.00` (MRP from your bill)
   - Shows as "strikethrough" price to indicate discount

8. **Cost Price (₹)**
   - Your purchase cost
   - Used for profit calculations

9. **Short Description**
   - Brief product description (1-2 lines)
   - Example: "Elegant green saree with intricate gold embroidery"

10. **Description**
    - Full product description
    - Include details about fabric, embroidery, occasion, etc.

#### Product Details

11. **Fabric Type**
    - Example: "Silk", "Cotton", "Georgette"

12. **Saree Length (meters)**
    - Example: `5.5` or `6.0`

13. **Blouse Included**
    - Check if blouse comes with the saree

#### Images

14. **Add Product Images**
    - Click **"+ Add Image URL"**
    - Enter image URL (can be Google Drive link, uploaded file URL, etc.)
    - Add multiple images (recommended: 3-5 images)
    - Images will show in a grid preview
    - Click the X button to remove an image

#### Tags

15. **Add Tags**
    - Click **"+ Add Tag"**
    - Enter tags like: "Party Wear", "Embroidered", "Green", "Gold Work"
    - Tags help with search and filtering

#### Product Variants (Optional)

If your product has different colors, sizes, or variations:

16. **Add Variant**
    - Click **"+ Add Variant"**
    - Fill in:
      - **Variant Name***: "Color: Green, Fabric: Silk"
      - **Variant SKU***: "1225-GREEN" (must be unique)
      - **Color**: "Green"
      - **Price Override**: (if different from base price)
      - **Barcode**: (if variant has its own barcode)
      - **Variant Code (QR)**: "SR-SILK-GREEN-1225" (for QR scanning)
    - Click "Remove Variant" to delete

#### Display Options

17. **Status Checkboxes**
    - ✅ **Active**: Product is visible on website
    - ✅ **Featured**: Show in featured section
    - ✅ **Show in Premium Patterns**: Display in premium section
    - ✅ **Show in Trending Patterns**: Display in trending section
    - ✅ **Show in Categories Carousel**: Show in category carousel

### Step 4: Save Product

1. Review all information
2. Click **"Create Product"** button (bottom right)
3. Product will be created with **inventory quantity: 0**
4. You'll be redirected to the Products list

---

## 📦 Part 2: Managing Inventory

### Important Note
**After creating a product, it has 0 stock by default. You MUST add inventory before customers can purchase it.**

### Method 1: Using Barcode/QR Code Scanner (Recommended)

#### Step 1: Go to Inventory Page

1. Click **"Inventory"** in the admin sidebar
2. You'll see the Inventory Management page

#### Step 2: Scan or Enter Identifier

**Option A: Using Barcode**
- Scan the barcode with a barcode scanner, OR
- Type the barcode number manually
- Example: Enter the barcode from your price tag

**Option B: Using Variant Code (QR)**
- Scan the QR code, OR
- Type the variant code manually
- Format: "SR-SILK-GREEN-1225"
- Example: Enter "SR-SILK-GREEN-1225"

**Option C: Using Product SKU**
- If you have a barcode scanner that can scan SKU, use it
- Or manually enter the SKU

#### Step 3: Select Transaction Type

- **Stock IN**: Adding inventory (receiving new stock)
- **Stock OUT**: Removing inventory (sold, damaged, returned)

#### Step 4: Enter Quantity

- Enter the number of units
- Example: If you received 10 sarees, enter `10`

#### Step 5: Select Stock Type

- **ONLINE**: Stock available for online orders
- **OFFLINE**: Stock in physical store

#### Step 6: Add Notes (Optional)

- Example: "Received from supplier", "Sale to customer", "Damaged item"

#### Step 7: Process Transaction

1. Click **"Process Transaction"** button
2. System will:
   - Find the product/variant by barcode or variant code
   - Update inventory quantity
   - Create a stock log entry
3. You'll see a success message
4. Recent transactions will appear on the right side

### Method 2: Direct Quantity Update (Future Enhancement)

Currently, inventory is managed through scanning. Direct quantity updates through product edit can be added if needed.

---

## 📝 Complete Example: Adding "Party Wear Saree" from Your Bill

### Step 1: Create Product

```
Product Name: Premium Green Party Wear Saree
SKU: 1225
Barcode: (enter barcode from price tag)
Category: Party Wear / Designer
Base Price: ₹750.00
Compare At Price: ₹950.00
Cost Price: ₹500.00 (your purchase cost)

Short Description: Elegant green saree with intricate gold embroidery, perfect for parties and special occasions.

Description: 
This stunning party wear saree features a rich green base with elaborate gold zari work and multi-colored embroidery. The intricate patterns include floral motifs and traditional designs, making it perfect for weddings, festivals, and special celebrations.

Fabric Type: Silk
Saree Length: 5.5 meters
Blouse Included: Yes

Images:
- Add main product image URL
- Add detail images (embroidery close-up, etc.)

Tags:
- Party Wear
- Embroidered
- Green
- Gold Work
- Designer

Status:
✅ Active
✅ Featured (if it's a special product)
```

### Step 2: Add Inventory

1. Go to **Inventory** page
2. Enter barcode or variant code from price tag
3. Select **Stock IN**
4. Enter quantity: `10` (or however many you have)
5. Select **ONLINE** stock type
6. Add note: "Initial stock from supplier"
7. Click **"Process Transaction"**

### Step 3: Verify

1. Go back to **Products** page
2. Find your product
3. Check inventory quantity (should show the quantity you added)

---

## 🔍 Finding Products for Inventory Updates

### By Barcode
- Scan or enter the barcode number
- System finds product automatically

### By Variant Code (QR)
- Scan or enter variant code like "SR-SILK-GREEN-1225"
- System finds the specific variant

### By SKU
- If your scanner supports SKU scanning
- Or manually enter SKU in inventory page

---

## 📊 Inventory Best Practices

### 1. When Receiving Stock (Stock IN)
- Always scan barcode/variant code when receiving new stock
- Enter accurate quantity
- Add notes: "Received from [supplier name]"
- Select appropriate stock type (ONLINE/OFFLINE)

### 2. When Selling (Stock OUT)
- Scan barcode when item is sold
- System automatically validates sufficient stock
- Add notes: "Sale to customer" or order number

### 3. Regular Audits
- Review stock logs regularly
- Check for discrepancies
- Update inventory as needed

### 4. Low Stock Alerts
- System tracks low stock (default: 5 units)
- Monitor products with low inventory
- Reorder when stock gets low

---

## 🎯 Quick Reference

### Product Creation Checklist
- [ ] Product name and SKU
- [ ] Category selected
- [ ] Prices set (base, compare, cost)
- [ ] Images added (at least 1, preferably 3-5)
- [ ] Description written
- [ ] Tags added
- [ ] Variants added (if applicable)
- [ ] Status checkboxes set
- [ ] Product saved

### Inventory Management Checklist
- [ ] Product created first
- [ ] Barcode/variant code ready
- [ ] Go to Inventory page
- [ ] Scan or enter identifier
- [ ] Select Stock IN
- [ ] Enter quantity
- [ ] Process transaction
- [ ] Verify inventory updated

---

## ❓ Common Questions

### Q: Can I add inventory without scanning?
**A:** Currently, inventory is managed through the scanning interface. This ensures accuracy and creates audit trails. Direct quantity updates can be added if needed.

### Q: What if I don't have a barcode?
**A:** You can use:
- SKU number
- Variant code (QR format)
- Or add a barcode later in product edit

### Q: Can I edit product after creation?
**A:** Yes! Click the Edit icon (pencil) next to any product in the Products list.

### Q: What happens if I enter wrong quantity?
**A:** You can process another transaction to correct it:
- If you added too much: Use Stock OUT to reduce
- If you added too little: Use Stock IN to add more

### Q: How do I track inventory changes?
**A:** Check the "Recent Transactions" section on the Inventory page. All stock movements are logged with:
- Date and time
- Product name
- Transaction type (IN/OUT)
- Quantity
- Who made the change

---

## 🚀 Quick Start Example

**Scenario:** You have 5 green party wear sarees to add

1. **Create Product:**
   - Go to Products → Add Product
   - Name: "Green Party Wear Saree"
   - SKU: "1225"
   - Price: ₹750
   - Save

2. **Add Inventory:**
   - Go to Inventory
   - Enter SKU: "1225" (or scan barcode)
   - Select: Stock IN
   - Quantity: 5
   - Stock Type: ONLINE
   - Click "Process Transaction"

3. **Done!** Product is now live with 5 units in stock.

---

This system ensures accurate inventory tracking and provides a complete audit trail for all stock movements.

