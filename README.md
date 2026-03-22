# ValuateAI — Industrial Property Intelligence Platform

<div align="center">

![ValuateAI Banner](https://img.shields.io/badge/ValuateAI-Industrial%20Property%20Intelligence-3b82f6?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIyIiB5PSIxNCIgd2lkdGg9IjUiIGhlaWdodD0iMTIiIHJ4PSIxIiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9IjkiIHk9IjgiIHdpZHRoPSI1IiBoZWlnaHQ9IjE4IiByeD0iMSIgZmlsbD0id2hpdGUiIG9wYWNpdHk9IjAuOCIvPjxyZWN0IHg9IjE2IiB5PSI0IiB3aWR0aD0iNSIgaGVpZ2h0PSIyMiIgcng9IjEiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjYiLz48cGF0aCBkPSJNMiAxOCBMNyAxMiBMMTMgMTUgTDIwIDYgTDI2IDEwIiBzdHJva2U9IiMxMGI5ODEiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**AI-powered property valuation for India's industrial corridors.**  
Instant. Verified. Bankable.

[Live Demo](#) · [Report Bug](https://github.com/omdesale777/Valuate-AI/issues) · [Request Feature](https://github.com/omdesale777/Valuate-AI/issues)

</div>

---

## What is ValuateAI?

ValuateAI eliminates the opacity and subjectivity in industrial property valuation. Built for real estate professionals, urban planners, and industrial property investors across Nashik, Mumbai, and Pune — it delivers AI-powered market valuations in seconds.

Point your camera at a site, let GPS lock your location, and get a comprehensive investment-grade valuation report powered by Gemini AI — complete with rental yield estimates, risk flags, and neighborhood intelligence.

---

## Features

### 🎯 Two Modes of Operation
- **Quick Capture** — Open camera + auto GPS on landing. Click a photo, confirm 3 fields, get your valuation in under 30 seconds
- **Manual Entry** — Full detailed form with survey number, building age, construction quality, zoning, and more

### 🤖 AI Valuation Engine
- Google Gemini AI analyzes site photos for construction quality, structural condition, and surroundings
- Generates estimated market value in INR (city-calibrated Maharashtra rates)
- Provides investment grade (A / B+ / B / C / D), rental yield, and confidence score
- Lists actionable insights and risk flags per property

### 🗺️ Neighborhood Intelligence
- OpenStreetMap Overpass API fetches nearby banks, hospitals, schools, and transport
- Composite connectivity score (0–100) based on amenity density
- Distance to each amenity in meters/km

### 📊 Live Valuation Feed
- Real-time syncing dashboard (30s polling via SWR)
- Grid and table views with city/zone/sort filters
- New valuation notifications

### 🔍 Remote Property Lookup
- Search by survey number or property ID
- Instant results with full valuation data
- Pre-fill form from lookup results

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v3 + CSS Variables |
| Database | MongoDB Atlas (Mongoose ODM) |
| AI Engine | Google Gemini AI (Vision + Text) |
| Image Storage | Vercel Blob |
| Animations | Framer Motion |
| Data Fetching | SWR |
| Maps/POI | OpenStreetMap Overpass API |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey))
- Vercel account (for Blob storage)

### Installation

```bash
# Clone the repository
git clone https://github.com/omdesale777/Valuate-AI.git
cd Valuate-AI

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/valuateai?retryWrites=true&w=majority

# Google Gemini AI
GEMINI_API_KEY=AIza...

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=ValuateAI
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed Sample Data (Optional)

```bash
npm install -D ts-node
npx ts-node --project tsconfig.json scripts/seed.ts
```

This inserts 15 realistic sample properties across Nashik, Mumbai, and Pune.

---

## Project Structure

```
valuateai/
├── app/
│   ├── api/                    # API routes (properties, valuation, upload, amenities)
│   ├── page.tsx                # Main page with mode switching
│   ├── layout.tsx              # Root layout + providers
│   └── globals.css             # Design system + CSS variables
├── components/
│   ├── cards/                  # PropertyCard, ValuationResultCard
│   ├── forms/                  # Step1, Step2, Step3 form components
│   ├── layout/                 # Navbar, Footer
│   ├── sections/               # HeroSection, QuickCapture, LiveFeed, etc.
│   └── ui/                     # GlassCard, Button, Toast, FormComponents, etc.
├── hooks/                      # useGeolocation, useCameraCapture, usePropertyForm, useValuationFeed
├── lib/                        # mongodb, gemini, overpass, nominatim, formatters
├── models/                     # Mongoose Property schema
├── scripts/                    # seed.ts
└── types/                      # TypeScript interfaces
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/properties` | Paginated list with filters |
| `POST` | `/api/properties` | Create new property |
| `GET` | `/api/properties/lookup?q=` | Search by survey number |
| `GET` | `/api/properties/[id]` | Get single property |
| `POST` | `/api/valuation/analyze` | Trigger Gemini AI valuation |
| `POST` | `/api/upload` | Upload site image to Vercel Blob |
| `GET` | `/api/amenities?lat=&lon=` | Fetch OSM neighborhood data |
| `GET` | `/api/geocode/reverse?lat=&lon=` | Reverse geocode coordinates |

---

## Market Coverage

| City | Zone | Rate Range |
|---|---|---|
| Nashik | MIDC Industrial | ₹800 – ₹2,500 / sq ft |
| Pune | Industrial Corridors | ₹1,500 – ₹4,500 / sq ft |
| Mumbai | Suburban Industrial | ₹3,000 – ₹8,000 / sq ft |

---

## Deployment

### Deploy to Vercel

```bash
npx vercel
```

Add all environment variables in your Vercel project dashboard under **Settings → Environment Variables**.

> ⚠️ Camera capture (`capture="environment"`) only works on HTTPS. Test the full flow on your Vercel deployment URL, not localhost.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## Roadmap

- [ ] WhatsApp report sharing
- [ ] PDF export of valuation report
- [ ] Broker marketplace integration
- [ ] Historical valuation tracking
- [ ] Expand to Tier 2 cities (Aurangabad, Nagpur, Kolhapur)
- [ ] Comparable sales analysis from registry data
- [ ] Multi-language support (Marathi, Hindi)

---

## Disclaimer

> Valuations generated by ValuateAI are AI-powered estimates based on market data and site analysis. They are intended as reference points only and do not constitute certified appraisals or financial advice. Always consult a licensed property valuer for legal or financial decisions.

---


---

<div align="center">

Built with ♥ in India 🇮🇳

**ValuateAI** by [Danny (Om Desale)](https://github.com/omdesale777)

</div>
