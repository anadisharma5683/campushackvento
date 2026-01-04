# Campus to Career - Internship & Placement Platform

A production-ready, mobile-first MVP for a centralized internship and placement platform built with Next.js 14+, Firebase, and Google Gemini AI.

## Features

### 🎓 Student Dashboard
- **Real-time Internship Listings**: Live updates from Firestore
- **Application Pipeline**: Kanban-style view tracking application status
- **Smart Alerts**: Notifications for matching opportunities
- **AI Resume Analyzer**: Get AI-powered suggestions to improve your resume
- **Experience Wall**: Share and read anonymous peer reviews

### 👔 Admin/TPO Command Center
- **Analytics Dashboard**: Placement statistics with interactive charts
- **Pipeline Stats**: Department-wise breakdown
- **Student Directory**: Filterable table with export to CSV
- **Dynamic Reporting**: Filter by GPA, Year, Department

### 🤖 AI Features
- **CareerBot**: Floating chat widget powered by Google Gemini
- **Resume Analysis**: AI-powered resume improvement suggestions

### 🔐 Authentication
- Google Sign-In via Firebase Auth
- Role-based routing (Student/Admin/TPO)
- Protected routes

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **UI**: Framer Motion, Lucide React Icons
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI**: Google Gemini API
- **State Management**: Zustand
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project configured
- Google Gemini API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

The Firebase configuration is already set up in `lib/firebase.ts`. Make sure your Firestore database has the following collections:

### Collections Structure

- **users**: User profiles with role, profile data, preferences
- **internships**: Internship listings with eligibility criteria
- **applications**: Student applications with status and timeline
- **reviews**: Anonymous peer reviews

## Project Structure

```
├── app/
│   ├── api/              # API routes (Gemini integration)
│   ├── admin/            # Admin/TPO dashboard
│   ├── dashboard/        # Student dashboard
│   └── layout.tsx         # Root layout with providers
├── components/
│   ├── admin/            # Admin dashboard components
│   ├── ai/               # AI components (CareerBot)
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Student dashboard components
│   ├── navigation/       # Sidebar and mobile nav
│   └── providers/        # Context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and Firebase config
└── store/                # Zustand state management
```

## Features in Detail

### Smart Workflows
- **Auto-Eligibility Check**: Validates GPA and year requirements before application
- **Real-time Updates**: Uses Firestore listeners for instant data sync
- **Digital Signatures**: Canvas-based signature component (ready for implementation)

### Mobile-First Design
- Responsive layout with mobile bottom navigation
- Desktop sidebar navigation
- Touch-friendly interactions

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key
```

## Optimizations for Vercel Deployment

This application is optimized for Vercel deployment with the following features:

- **Bundle Size Optimization**: Removed unnecessary dependencies and tree-shaken imports
- **Image Optimization**: Configured for WebP and AVIF formats
- **API Route Optimization**: Efficient serverless functions with proper error handling
- **Server Component Optimization**: Proper usage of `dynamic` imports where needed
- **Caching Headers**: Proper cache control for static assets
- **Compression**: Gzip compression enabled by default on Vercel
- **CDN**: Automatic asset optimization and delivery via Vercel's global CDN

## Page Connectivity

All pages are properly connected with:

- **Protected Routes**: Role-based access control for admin and student dashboards
- **Navigation**: Consistent sidebar and mobile navigation across pages
- **Authentication Flow**: Seamless Google OAuth integration
- **State Management**: Zustand store for global authentication state
- **API Integration**: Properly configured API routes for AI features

## Deployment

This app is configured for easy deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the build command to `npm run build`
3. Set the output directory to `.next`
4. Add your environment variables in the Vercel dashboard
5. Deploy!

## License

MIT

# campushackvento