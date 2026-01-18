# PrintIt
### Smart Remote Printing Web Application

---

## Overview

PrintIt is a full-stack, remote-first web platform designed to modernize document printing services by connecting university students with nearby print shops. The platform allows students to upload documents, configure print specifications, complete secure online payments, and collect pre-printed documents using OTP-based verification.

The system addresses common inefficiencies in campus printing such as long queues, manual file sharing, pricing confusion, and cash handling issues. It is built with scalability, security, and real-world usability as core design principles.

---

## Problem Statement

Traditional student printing systems suffer from multiple inefficiencies:
- Long waiting queues during peak academic hours
- Productivity loss due to printer failures and manual coordination
- Inconvenient file transfer methods such as WhatsApp or pen drives
- Manual payment handling and lack of pricing transparency

These issues significantly disrupt academic workflows and demand a more efficient solution.

---

## Proposed Solution

PrintIt introduces a streamlined remote printing workflow:
1. Students upload documents and select a nearby print shop
2. Print specifications are configured (page count, copies, color mode, binding)
3. Real-time pricing is calculated automatically
4. Secure UPI payment is completed online
5. Print job is dispatched instantly to the shop dashboard
6. Documents are printed before student arrival
7. Secure pickup using a 6-digit OTP or QR verification

**Objective:** Zero waiting time, fast pickup, and a frictionless printing experience.

---

## Features

### For Students
- Automated file analysis using client-side parsing for PDF and DOCX files
- Real-time cost estimation based on pages, copies, color mode, and binding options
- Shop locator with live availability and price comparison
- Secure online payments via PayU (UPI)
- OTP-based secure document pickup

### For Shopkeepers
- Real-time order dashboard using WebSocket updates
- Order lifecycle management (Pending → Printing → Completed → Delivered)
- Revenue and print volume monitoring
- Dynamic pricing and shop availability controls

---

## Technology Stack

### Core Technologies
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

### Backend & Infrastructure
- **Database & Authentication:** Supabase (PostgreSQL with Row Level Security)
- **Storage:** Supabase Storage
- **Payments:** PayU India

### File Processing
- **PDF Parsing:** pdfjs-dist
- **DOCX Parsing:** jszip

### UI
- **Icons:** Lucide React

---

## System Architecture

The application follows a client-server-database architecture:
- **Client Side** handles file parsing, page detection, and UI interactions
- **Server Side** (Next.js API routes) manages payments, order validation, and OTP generation
- **Database** (Supabase) stores users, shops, orders, and configurations with real-time subscriptions

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- Supabase account
- PayU merchant account (test or production)

---

### Installation

```bash
git clone https://github.com/yourusername/printit.git
cd printit
npm install
# or
yarn install
```

### Environment Configuration

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PAYU_KEY=your_merchant_key
PAYU_SALT=your_merchant_salt
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Database Setup

```sql
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  role text check (role in ('student', 'shopkeeper')),
  email text
);

create table public.shops (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.users(id),
  name text not null,
  location text,
  is_open boolean default true,
  bw_price numeric default 2,
  color_price numeric default 10,
  spiral_price numeric default 30,
  lamination_price numeric default 40
);

create table public.uploads (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  shop_id uuid references public.shops(id),
  file_name text,
  storage_path text,
  file_size integer,
  status text default 'pending_payment',
  total_pages integer default 1,
  total_price numeric default 0,
  pickup_otp varchar(6),
  created_at timestamp with time zone default timezone('utc', now())
);

alter publication supabase_realtime add table public.uploads;
```

### Storage Setup

1. Create a public bucket named `documents` in Supabase Storage
2. Allow authenticated users to upload and read files

### Running the Application

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## Project Structure

```
/src
 ├─ app
 │  ├─ auth
 │  ├─ dashboard
 │  ├─ upload
 │  ├─ print-settings
 │  ├─ payment
 │  ├─ api
 ├─ components
 ├─ utils
```

---

## Security

- **Row Level Security (RLS)** enforced at the database level
- **Server-side price validation** to prevent client-side tampering
- **OTP-based verification** for secure document handover

---

## Team Information

**Team Name:** Turbo Cpp

| Name | GitHub Profile |
|------|----------------|
| Tanmay Mevada | [https://github.com/tanmay-mevada](https://github.com/tanmay-mevada) |
| Aum Ghodasara | [https://github.com/Ghatak18005](https://github.com/Ghatak18005) |
| Urvi Ladhani | [https://github.com/Urvi-Ladhani](https://github.com/Urvi-Ladhani) |

---

## License

MIT License
