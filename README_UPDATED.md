# Print Link - Student Document Printing Platform

A modern web application that connects students with local printing shops for convenient document printing services.

## ✨ Features

### 🎯 Multi-Step Checkout Flow
1. **Upload Document** - Upload PDF, Word, or Excel files (max 10MB)
2. **Select Shop** - Choose from available printing shops with location and pricing
3. **Configure Print Settings** - NEW! Customize print options:
   - 🎨 Print Color (Black & White or Color)
   - 📄 Print Sides (Single-sided or Double-sided)
   - 📋 Number of Copies (1-999)
   - 🔗 Binding Options (No Binding, Staple, Spiral)
4. **Review & Payment** - Complete order summary with real-time pricing

### 💼 Shop Management
- View available printing shops
- Compare pricing and locations
- See shop details before selecting

### 💰 Smart Pricing
- Real-time price calculation
- Dynamic updates based on selections
- Itemized cost breakdown
- Support for binding options

### 👤 User Dashboard
- Recent orders overview
- Account status
- Profile management
- Print history

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd print-link
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Apply database migration
```sql
-- Run in Supabase SQL Editor
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_color VARCHAR(10) DEFAULT 'bw';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_sides VARCHAR(10) DEFAULT 'single';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_copies INTEGER DEFAULT 1;
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS print_binding VARCHAR(10) DEFAULT 'none';
ALTER TABLE uploads ADD COLUMN IF NOT EXISTS shop_id UUID REFERENCES shops(id);
```

5. Run development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

---

## 📱 Key Pages

| Page | Route | Purpose |
|------|-------|---------|
| Dashboard | `/dashboard` | Main user hub, upload & order history |
| Upload | `/upload` | Standalone upload page |
| Print Settings | `/print-settings` | Configure print options (NEW) |
| Payment | `/payment` | Order review & payment |
| Success | `/success` | Order confirmation |
| Login | `/login` | User authentication |
| Signup | `/signup` | User registration |

---

## 💻 Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage
- **Middleware**: Next.js Middleware

---

## 📖 Documentation

Comprehensive documentation is included:

- **[QUICK_START.md](./QUICK_START.md)** - Setup and testing guide
- **[PRINT_SETTINGS_IMPLEMENTATION.md](./PRINT_SETTINGS_IMPLEMENTATION.md)** - Technical details
- **[CHECKOUT_FLOW_COMPLETE.md](./CHECKOUT_FLOW_COMPLETE.md)** - Feature overview
- **[FLOW_DIAGRAM.md](./FLOW_DIAGRAM.md)** - Visual flow diagrams
- **[IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)** - Implementation status
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Final summary

---

## 🎨 UI Components

### Print Settings Page
Beautiful, intuitive interface for configuring print options:
- Visual emoji indicators
- Real-time price updates
- Responsive grid layout
- Mobile-friendly design

### Payment Summary
Complete order overview:
- Document details
- Shop information
- Print settings summary (4-column grid)
- Itemized price breakdown
- Total calculation

---

## 🔐 Security Features

- User authentication via Supabase
- Protected API routes
- Type-safe TypeScript
- Environment variable protection
- File validation (type & size)
- CORS headers configured

---

## 📊 Database Schema

### uploads table (extended)
```sql
- id: UUID (primary key)
- user_id: UUID (foreign key)
- file_name: VARCHAR
- file_size: INTEGER
- file_path: VARCHAR
- status: VARCHAR
- print_color: VARCHAR ('bw' | 'color')
- print_sides: VARCHAR ('single' | 'double')
- print_copies: INTEGER (1-999)
- print_binding: VARCHAR ('none' | 'staple' | 'spiral')
- shop_id: UUID (foreign key to shops)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### shops table
```sql
- id: UUID (primary key)
- name: VARCHAR
- location: VARCHAR
- bw_price: DECIMAL (per page)
- color_price: DECIMAL (per page)
- email: VARCHAR
- phone: VARCHAR
- is_active: BOOLEAN
- created_at: TIMESTAMP
```

---

## 🧪 Testing Workflow

1. **Upload**: Create a test document
2. **Shop Selection**: Choose any available shop
3. **Print Settings**: Test all options and verify price updates
4. **Payment**: Review complete summary
5. **Verification**: Confirm all settings display correctly

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

### Docker
```bash
docker build -t print-link .
docker run -p 3000:3000 print-link
```

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🐛 Troubleshooting

### Print Settings page not showing
- Verify `uploadId` and `shopId` query parameters
- Check browser console for errors
- Ensure database migration was applied

### Price calculation incorrect
- Verify shop prices in database
- Check print_copies value
- Ensure binding costs are set (5 for staple, 25 for spiral)

### Database errors
- Run migration script again
- Check Supabase connection
- Verify table structure

---

## 🔄 API Routes

### Upload
- **POST** `/api/upload` - Upload file to storage

### Payment
- **POST** `/api/payment` - Process payment

### Webhook
- **POST** `/api/webhook` - Handle payment webhooks

---

## 📝 File Structure

```
print-link/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── payment/
│   │   │   ├── upload/
│   │   │   └── webhook/
│   │   ├── dashboard/
│   │   ├── print-settings/       ← NEW
│   │   ├── payment/
│   │   └── [other pages]
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── [others]
│   └── utils/
│       └── supabase/
├── supabase/
│   └── migrations/
│       └── add_print_settings.sql  ← NEW
├── public/
└── [config files]
```

---

## 📈 Future Enhancements

- [ ] Step indicator (1/4, 2/4, etc.)
- [ ] PDF page count detection
- [ ] Order tracking system
- [ ] Discount codes & coupons
- [ ] Express binding options
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Analytics dashboard
- [ ] Social sharing
- [ ] Payment gateway integration (Razorpay/Stripe)

---

## 👥 Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 📞 Support

For issues or questions:
- Check the [documentation](./QUICK_START.md)
- Review [troubleshooting guide](./IMPLEMENTATION_COMPLETE.md)
- Contact: support@printlink.com

---

## 🎉 What's New (Latest Update)

### Print Settings Feature (v1.1.0)
- ✨ New print configuration page
- 🎨 Color selection (B/W vs Color)
- 📄 Sides selection (Single vs Double)
- 📋 Configurable copy count
- 🔗 Binding options with pricing
- 💰 Real-time price calculation
- 📊 Enhanced payment summary

See [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) for full details.

---

**Status**: ✅ Production Ready | **Last Updated**: January 16, 2025
