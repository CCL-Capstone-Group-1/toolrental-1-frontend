# 🧰 Tool Lending Library — Frontend

## 🔧 Overview
This is the frontend for the Tool Lending Library application. It is built with React + Vite and provides the user interface for browsing tools, managing listings, viewing profiles, and interacting with the rental system.

The frontend communicates with the backend API and Supabase authentication to deliver a smooth user experience.

---

## 🗂️ Folder Structure

frontend/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # 🧰 Navigation bar
│   │   ├── ListingCard.jsx       # 🔨 Tool preview card
│   │   ├── ListingForm.jsx       # 🪛 Form for adding/editing listings
│   │   ├── ItemList.jsx          # 🪚 List of available tools
│   │   ├── SearchFilterBar.jsx   # 🗂️ Search + filter UI
│   │   ├── SwapModal.jsx         # ⚙️ Modal for tool swap actions
│   │   ├── LoadingMessage.jsx    # 📦 Loading indicator
│   │   └── EmptyState.jsx        # 🧱 Empty results UI
│   │
│   ├── pages/
│   │   ├── Home.jsx              # 🏠 Homepage
│   │   ├── MyListings.jsx        # 🔧 User’s listings
│   │   └── Profile.jsx           # 🧰 User profile
│   │
│   ├── styles.css                # 🎨 Global styles
│   ├── main.jsx                  # 🚀 App entry point
│   └── App.jsx                   # 🛠️ Root component
│
├── package.json                  # 📦 Dependencies
├── vite.config.js                # ⚙️ Vite configuration
└── README.md                     # 📝 Frontend documentation

---

⚙️ Technologies
React
Vite
JavaScript (ES6+)
CSS
Supabase Auth (planned integration)
Axios or Fetch for API calls

---

🔨 Planned Features
Tool browsing UI
Listing creation & editing
User profile dashboard
Search + filter system
Tool swap modal
Integration with backend API
Supabase authentication

---

🗒️ Notes
This README aligns with the Capstone Project task list stored in shared Google Doc. Track frontend tasks and update README as new components and pages are added.

## ⚠️ Build Status
The production build could not run because dependencies are missing and the install was cancelled.
