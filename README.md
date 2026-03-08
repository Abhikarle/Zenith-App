# Zenith - AI-Powered Task Management

Zenith is a futuristic, high-performance task management application built with React, TypeScript, and Tailwind CSS. It leverages the power of Gemini AI to provide smart productivity insights and task suggestions.

![Zenith Preview](https://picsum.photos/seed/zenith/1200/600)

## 🚀 Features

- **Futuristic UI**: A sleek, dark-themed interface with smooth animations and glassmorphism effects.
- **AI Intelligence**: Smart task reminders and productivity tips powered by Google Gemini.
- **Real-time Sync**: Instant data persistence using Firebase Firestore.
- **Secure Authentication**: Google Login integration via Firebase Auth.
- **Smart Task Management**:
  - Drag-and-drop reordering.
  - Priority-based filtering and sorting.
  - Category organization.
  - AI-generated subtask suggestions.
- **Interactive Dashboard**: Visual analytics of your productivity trends.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4, Lucide React (Icons), Motion (Animations)
- **State Management**: Zustand
- **Backend**: Firebase (Auth & Firestore)
- **AI**: Google Gemini SDK (`@google/genai`)
- **Testing**: Cypress

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/zenith-task-app.git
   cd zenith-task-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔐 Firebase Configuration

To use your own Firebase project:
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Google Provider) and **Firestore**.
3. Copy your project configuration into `src/firebase-applet-config.json`.
4. Deploy the security rules provided in `firestore.rules`.

## 🧪 Testing

Run Cypress end-to-end tests:
```bash
npm test
```

## 📄 License

This project is licensed under the Apache-2.0 License.
