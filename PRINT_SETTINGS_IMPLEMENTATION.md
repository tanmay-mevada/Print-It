# Print Link - Multi-Step Checkout Flow Implementation

## Overview
This document describes the implementation of the multi-step checkout flow: **Upload → Shop Selection → Print Settings → Payment**

## Flow Description

### Step 1: Upload Document
- Location: `/dashboard` or `/upload`
- User uploads a document (PDF, Word, Excel)
- File size limited to 10MB
- On successful upload, displays shop selection modal

### Step 2: Shop Selection
- User selects a shop from available options
- Shows shop location and pricing (B/W and Color)
- Redirects to Print Settings page

### Step 3: Print Settings (NEW)
- Location: `/print-settings`
- Query Parameters: `uploadId` and `shopId`
- Users can configure:
  - **Print Color**: Black & White or Color
  - **Print Sides**: Single-sided or Double-sided
  - **Number of Copies**: Adjustable with +/- buttons (1-999)
  - **Binding Option**: No Binding, Staple (+₹5), or Spiral Bind (+₹25)
- Real-time price calculation based on selections
- Stores settings in database
- Proceeds to Payment with all print settings parameters

### Step 4: Payment
- Location: `/payment`
- Query Parameters: `uploadId`, `shopId`, `printColor`, `printSides`, `printCopies`, `printBinding`
- Displays comprehensive order summary including:
  - Document details
  - Selected shop
  - Print settings summary (color, sides, copies, binding)
  - Price breakdown with binding costs
  - Total amount

## Database Changes

Run the migration to add print settings columns:

```sql
-- supabase/migrations/add_print_settings.sql
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_color VARCHAR(10) DEFAULT 'bw';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_sides VARCHAR(10) DEFAULT 'single';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_copies INTEGER DEFAULT 1;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_binding VARCHAR(10) DEFAULT 'none';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id);
```

### Column Details:
- `print_color`: 'bw' or 'color'
- `print_sides`: 'single' or 'double'
- `print_copies`: 1-999
- `print_binding`: 'none', 'staple', or 'spiral'
- `shop_id`: Foreign key to shops table

## Files Modified/Created

### New Files
- `/src/app/print-settings/page.tsx` - Print settings configuration page
- `/supabase/migrations/add_print_settings.sql` - Database migration

### Modified Files
- `/src/app/dashboard/page.tsx`:
  - Changed `handleProceedToPayment()` to `handleProceedToPrintSettings()`
  - Now redirects to `/print-settings` instead of `/payment`
  
- `/src/app/payment/page.tsx`:
  - Added print settings parameters from query string
  - Added Print Settings section to order summary
  - Updated price calculation to include binding costs
  - Enhanced UI with print settings display

## User Interface Features

### Print Settings Page
- Visual indicators for each option (emojis for easy identification)
- Selected options highlighted with blue border and background
- Real-time price breakdown showing:
  - Base printing cost
  - Binding cost (if applicable)
  - Total estimated cost
- Responsive grid layout for all options
- Clear pricing information for each tier

### Payment Summary
- Four-column grid showing selected print settings
- Detailed price breakdown section
- Dynamic calculation based on all selections
- Yellow warning note about final pricing based on actual pages

## Pricing Calculation

```
Total = (Base Price per Page × Number of Copies) + Binding Cost

Where:
- Base Price = shop's B/W price or Color price (depending on selection)
- Binding Cost = 0 for 'none', 5 for 'staple', 25 for 'spiral'
```

## Navigation Flow

```
Dashboard (Upload)
    ↓
Shop Selection Modal
    ↓
Print Settings Page (/print-settings?uploadId=X&shopId=Y)
    ↓
Payment Page (/payment?uploadId=X&shopId=Y&printColor=bw&printSides=single&printCopies=1&printBinding=none)
    ↓
Success Page (/success?uploadId=X)
```

## Implementation Notes

1. **Session Persistence**: Print settings are stored in the database when transitioning from print-settings to payment
2. **Query Parameters**: All selections are passed through URL for easy debugging and bookmarking
3. **Error Handling**: Validation occurs at each step; users are redirected to dashboard if required parameters are missing
4. **Responsive Design**: All pages are fully responsive with mobile-first approach
5. **Accessibility**: Uses semantic HTML and clear visual indicators for selections

## Testing Checklist

- [ ] Upload succeeds and shows shop selection
- [ ] Shop selection modal displays correctly
- [ ] Clicking "Proceed to Payment" redirects to print settings
- [ ] All print settings options are clickable
- [ ] Price updates correctly when changing options
- [ ] Print settings page saves to database
- [ ] Payment page displays all settings correctly
- [ ] Price breakdown on payment page matches print settings calculations
- [ ] Back button works on print settings and payment pages
- [ ] Mobile layout is responsive

## Future Enhancements

- Add step indicator (1 of 4, 2 of 4, etc.)
- Add print preview functionality
- Implement actual payment gateway integration (Razorpay)
- Add order tracking
- Support for file page count API integration for accurate pricing
