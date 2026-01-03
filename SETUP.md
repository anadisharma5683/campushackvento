# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDkxk_YjcQpyjFCYTTsJ6IfIWIeI4KKqBA
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gen-lang-client-0269513542.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=gen-lang-client-0269513542
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gen-lang-client-0269513542.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=78525362262
   NEXT_PUBLIC_FIREBASE_APP_ID=1:78525362262:web:dbd850fd77c88b0d2fcbf7
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-9SB4YG9BX5

   # Google Gemini API Key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your Gemini API key from: https://makersuite.google.com/app/apikey

3. **Firebase Setup**
   - The Firebase configuration is already set up in `lib/firebase.ts`
   - Make sure your Firebase project has Firestore enabled
   - Enable Google Authentication in Firebase Console

4. **Firestore Collections**
   Create the following collections in your Firestore database:
   
   - **users** (with subcollections as needed)
   - **internships**
   - **applications**
   - **reviews**

5. **Run Development Server**
   ```bash
   npm run dev
   ```

6. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Firebase Security Rules

Add these rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data, admins can read all
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'tpo']);
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Everyone can read internships
    match /internships/{internshipId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'tpo'];
    }
    
    // Students can read their own applications, admins can read all
    match /applications/{applicationId} {
      allow read: if request.auth != null && (resource.data.studentId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'tpo']);
      allow create: if request.auth != null && request.auth.uid == resource.data.studentId;
      allow update: if request.auth != null && (resource.data.studentId == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'tpo']);
    }
    
    // Everyone can read reviews, authenticated users can create
    match /reviews/{reviewId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

## Sample Data Structure

### User Document
```json
{
  "email": "student@example.com",
  "displayName": "John Doe",
  "role": "student",
  "profile": {
    "gpa": 8.5,
    "department": "Computer Science",
    "year": 3,
    "skills": ["React", "Node.js", "Python"]
  },
  "preferences": {
    "jobTypes": ["internship", "full-time"],
    "location": "Remote"
  }
}
```

### Internship Document
```json
{
  "title": "Software Engineering Intern",
  "company": "Tech Corp",
  "stipend": 30000,
  "deadline": "2024-12-31",
  "status": "open",
  "applicants": 0,
  "eligibilityCriteria": {
    "minGpa": 7.5,
    "year": [3, 4],
    "department": ["Computer Science", "IT"]
  },
  "description": "Join our team as a software engineering intern...",
  "location": "Remote",
  "type": "internship"
}
```

## Testing the Application

1. **Sign in as a Student**
   - Use Google Sign-In
   - You'll be redirected to the student dashboard
   - Browse internships and apply

2. **Sign in as Admin/TPO**
   - Create a user document with `role: "admin"` or `role: "tpo"` in Firestore
   - Sign in with the same Google account
   - Access the admin dashboard

3. **Test AI Features**
   - Click the CareerBot floating button
   - Try the Resume Analyzer in the student dashboard

## Troubleshooting

### Firebase Auth Issues
- Make sure Google Sign-In is enabled in Firebase Console
- Check that authorized domains include localhost

### Gemini API Errors
- Verify your API key is correct in `.env.local`
- Check API quota limits

### Firestore Permission Errors
- Review and update security rules
- Ensure user documents have the correct role field

## Next Steps

- Add more internship listings
- Configure email notifications
- Set up Cloud Functions for automated workflows
- Add file upload for resumes
- Implement PDF parsing for resume analyzer

