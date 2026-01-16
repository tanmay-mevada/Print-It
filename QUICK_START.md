# 🚀 Quick Start Guide - Print Settings Flow

## What's New?

Your Print Link app now has a **4-step checkout process**:

```
Step 1: Upload → Step 2: Select Shop → Step 3: Configure Print Settings → Step 4: Payment
```

---

## 🛠️ Setup Instructions

### 1. Apply Database Migration

Run this SQL in your Supabase dashboard (SQL Editor):

```sql
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_color VARCHAR(10) DEFAULT 'bw';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_sides VARCHAR(10) DEFAULT 'single';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_copies INTEGER DEFAULT 1;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_binding VARCHAR(10) DEFAULT 'none';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id);

CREATE INDEX IF NOT EXISTS idx_uploads_shop_id ON uploads(shop_id);
```

**Or**: Copy the migration file from `supabase/migrations/add_print_settings.sql`

### 2. Verify Files

Make sure these files exist:
- ✅ `src/app/print-settings/page.tsx` (New print settings page)
- ✅ `src/app/dashboard/page.tsx` (Updated with new redirect)
- ✅ `src/app/payment/page.tsx` (Updated with print settings display)

### 3. Test the Flow

```bash
npm run dev
# Navigate to http://localhost:3000/dashboard
```

**Test Steps**:
1. Upload a document
2. Select a shop
3. You should now see the **Print Settings** page instead of payment
4. Configure: Color, Sides, Copies, Binding
5. See real-time price updates
6. Click "Continue to Payment"
7. Verify all settings display correctly on payment page

---

## 📋 Print Settings Page Features

### Options Available:

| Setting | Options | Price Impact |
|---------|---------|--------------|
| **Color** | B/W or Color | Affects base price |
| **Sides** | Single-sided or Double-sided | No direct cost |
| **Copies** | 1-999 (adjustable) | Multiplies base cost |
| **Binding** | None / Staple / Spiral | +₹0 / +₹5 / +₹25 |

### User Experience:
- 🎨 Visual emojis for quick identification
- 🔵 Blue selection highlight
- 🧮 Real-time price calculation
- 📊 Price breakdown section
- ⬅️ Back button to change shop
- ➡️ Continue button to payment

---

## 💰 Price Calculation Example

**Scenario**: Customer selects:
- Color: **B/W** (₹5/page)
- Copies: **10**
- Binding: **Staple** (+₹5)
- Shop B/W price: **₹5/page**

**Calculation**:
```
Print Cost = ₹5/page × 10 copies = ₹50
Binding Cost = ₹5 (staple)
Total = ₹50 + ₹5 = ₹55
```

---

## 🔗 URL Flow

```
Step 1: /dashboard
        ↓
        Upload file → uploadId generated

Step 2: /dashboard (shop modal)
        ↓
        Select shop → shopId selected

Step 3: /print-settings?uploadId=XXX&shopId=YYY
        ↓
        Configure settings → saved to database

Step 4: /payment?uploadId=XXX&shopId=YYY&printColor=bw&printSides=single&printCopies=10&printBinding=staple
        ↓
        Review order → ready for payment
```

---

## 🐛 Troubleshooting

### Print Settings page not showing?
- Check browser console for errors
- Verify `uploadId` and `shopId` query parameters
- Make sure database migration was applied

### Price not calculating correctly?
- Verify shop prices in database
- Check print_copies is being read correctly
- Ensure binding prices are set (5 for staple, 25 for spiral)

### Back button not working?
- Implemented as `router.back()` - should work if coming from shop selection
- Alternative: Click browser back button

---

## 📝 Code Changes Summary

### Dashboard (`src/app/dashboard/page.tsx`)
**Before**:
```tsx
const handleProceedToPayment = () => {
  router.push(`/payment?uploadId=${uploadId}&shopId=${selectedShop.id}`)
}
```

**After**:
```tsx
const handleProceedToPrintSettings = () => {
  router.push(`/print-settings?uploadId=${uploadId}&shopId=${selectedShop.id}`)
}
```

### Payment Page (`src/app/payment/page.tsx`)
**Added**:
```tsx
const printColor = searchParams.get('printColor') || 'bw'
const printSides = searchParams.get('printSides') || 'single'
const printCopies = parseInt(searchParams.get('printCopies') || '1')
const printBinding = searchParams.get('printBinding') || 'none'
```

**Added UI Section**:
```tsx
{/* Print Settings */}
<div className="mb-8 pb-8 border-b border-slate-200">
  <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
    <Printer className="w-5 h-5 text-blue-600" />
    Print Settings
  </h2>
  {/* 4-column grid showing all selections */}
</div>
```

---

## ✨ Features Included

- ✅ Print color selection (B/W vs Color)
- ✅ Print sides selection (Single vs Double)
- ✅ Configurable copy count (1-999)
- ✅ Binding options with prices
- ✅ Real-time price calculation
- ✅ Database persistence
- ✅ Full payment summary with all details
- ✅ Responsive mobile design
- ✅ Error handling & validation
- ✅ Loading states

---

## 🎯 Next Features to Add

1. **Step Indicator**: Show "Step 2 of 4" etc.
2. **Page Count Preview**: Auto-detect document pages
3. **Discount Codes**: Apply coupon codes
4. **Express Binding**: Additional binding options
5. **Order History**: Track past print settings

---

## 📞 Support

**Files to Reference**:
- 📖 `PRINT_SETTINGS_IMPLEMENTATION.md` - Full technical docs
- 📖 `CHECKOUT_FLOW_COMPLETE.md` - Complete overview
- 💻 `src/app/print-settings/page.tsx` - Component code
- 💻 `src/app/payment/page.tsx` - Updated payment page

---

**Ready to go!** 🎉

Your multi-step checkout flow is now complete and ready for users. The flow is: **Upload → Shop → Print Settings → Payment**
