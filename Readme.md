# 🤖 AstroBot Backend

A Node.js/Express REST API backend for **AstroBot** — an AI-powered astrology chatbot. This document covers the server setup, authentication, user profile, and AI chat modules.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (JSON Web Tokens) + bcrypt
- **AI:** Google Gemini 2.5 Flash (via `@google/generative-ai`)
- **Other:** cookie-parser, cors, dotenv

---

## 📁 Project Structure

```
├── config/
│   └── database.js         # MongoDB connection setup
├── routes/
│   ├── authRoutes.js        # Auth endpoints (signup, login, logout)
│   ├── userRoutes.js        # User profile endpoints
│   └── chatRoutes.js        # AI chat endpoints
├── controller/
│   ├── authController.js   # Auth request handling & validation
│   ├── userController.js   # User profile request handling
│   └── chatController.js   # Chat request handling
├── services/
│   ├── authService.js      # Auth business logic (DB ops, hashing, JWT)
│   ├── userService.js      # User update logic
│   └── chatService.js      # Gemini AI integration & chat history logic
├── middleware/
│   └── userAuth.js         # JWT verification middleware
├── models/
│   ├── user.js             # Mongoose User schema
│   └── chat.js             # Mongoose Chat schema
└── utils/
    ├── validation.js        # Input validation helpers
    └── gemini.js            # Gemini AI client setup
└── app.js                # App entry point
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=your_port
MONGO_URI=your_mongodb_connection_string
JSON_WEB_TOKEN_SECRET_KEY=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## ⚙️ Server Setup (`app.js`)

The entry point bootstraps the entire application:

- Loads environment variables via `dotenv`
- Registers middleware: `express.json()`, `cookie-parser`, and `cors`
- CORS is configured to allow requests only from the deployed frontend (`https://astrobot-psi.vercel.app`) with credentials enabled
- Mounts route modules under `/auth`, `/user`, and `/ai` prefixes
- Exposes a `/health` endpoint for uptime checks
- Calls `startServer()` which first establishes the MongoDB connection, then starts listening on the configured port — if DB connection fails, the server does not start

---

## 💾 Database Config (`config/database.js`)

- Uses `mongoose.connect()` with the `MONGO_URI` from `.env`
- Exported as `connectDB()` and called once during server startup
- Logs success or error to the console

---

## 🔑 Authentication Module

### **Routes (`routes/authRoutes.js`)**

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | `/auth/signup` | Register a new user |
| POST   | `/auth/login`  | Login existing user |
| POST   | `/auth/logout` | Logout current user |

---

### **Controller (`controller/authController.js`)**

Acts as the **gatekeeper** between the HTTP layer and business logic. Responsibilities:

#### **`signup`**

- Whitelists only accepted fields: `fullName`, `emailId`, `password`, `dob`, `birthTime`, `birthPlace`
- Rejects any request body containing unexpected keys
- Calls `isDataValid()` to validate all fields before proceeding
- On success, sets a secure HTTP-only cookie with the JWT token (expires in 8 hours)
- Returns the created user object with a 200 status

#### **`login`**

- Whitelists only `emailId` and `password`
- Validates email format and password strength via utility functions
- On success, sets the same secure cookie
- Returns the user object with a 200 status

#### **`logout`**

- Clears the auth cookie by setting it to an expired date
- Returns a 200 success message

All handlers wrap logic in try/catch and return a 500 with the error message on failure.

---

### **Service (`services/authService.js`)**

Contains the **core business logic**, separated cleanly from the controller:

#### **`signup`**

1. Checks if a user with the given `emailId` already exists in MongoDB — throws if found
2. Hashes the password using `bcrypt` with a salt of 10
3. Creates and saves a new `User` document
4. Signs a JWT with the user's `_id` (expires in 1 hour)
5. Returns `{ user, token }`

#### **`login`**

1. Looks up the user by `emailId` — throws if not found
2. Compares the provided password against the stored hash using `bcrypt.compare()`
3. Signs a new JWT on success
4. Returns `{ user, token }`

---

## 🔄 Auth Flow Diagram

```
Client
  │
  ├─ POST /auth/signup ──► authController.signup
  │                             │
  │                        Validate fields
  │                             │
  │                        authService.signup
  │                             │
  │                     Check existing user (MongoDB)
  │                             │
  │                     Hash password (bcrypt)
  │                             │
  │                     Save User to DB
  │                             │
  │                     Sign JWT
  │                             │
  │◄──── Set cookie + return user ────────────────
  │
  ├─ POST /auth/login ───► authController.login
  │                             │
  │                        Validate fields
  │                             │
  │                        authService.login
  │                             │
  │                     Find user by emailId
  │                             │
  │                     Compare password (bcrypt)
  │                             │
  │                     Sign JWT
  │                             │
  │◄──── Set cookie + return user ────────────────
  │
  └─ POST /auth/logout ──► Clear cookie ──► 200 OK
```

---

## 👤 User Module

### **Routes (`routes/userRoutes.js`)**

Both routes are protected by the `userAuth` middleware — a valid JWT cookie is required.

| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| GET    | `/user/profile` | Fetch logged-in user's profile  |
| PATCH  | `/user/profile` | Update logged-in user's profile |

---

### **Middleware (`middleware/userAuth.js`)**

The `userAuth` middleware runs before any protected route:

- Reads the JWT token from the `token` cookie
- Verifies it using `JSON_WEB_TOKEN_SECRET_KEY`
- Fetches the corresponding user from MongoDB and attaches them to `req.user`
- If the token is missing, expired, or invalid, the request is rejected before reaching the controller

---

### **Controller (`controller/userController.js`)**

#### **`getProfile`**

- Reads `req.user` (already populated by `userAuth`) and returns it directly
- No additional DB call needed since the middleware handles it

#### **`updateProfile`**

- Whitelists only: `fullName`, `password`, `dob`, `birthTime`, `birthPlace`
- Rejects any unexpected fields in the request body
- Passes the validated data and user `_id` to the service layer
- Returns the updated user document

---

### **Service (`services/userService.js`)**

#### **`updateProfile`**

- Calls `User.findByIdAndUpdate()` with `returnDocument: "after"` to get the updated document back
- Returns the updated user to the controller

---

## 🤖 AI Chat Module

### **Routes (`routes/chatRoutes.js`)**

Both routes are protected by `userAuth`.

| Method | Endpoint      | Description                        |
| ------ | ------------- | ---------------------------------- |
| POST   | `/ai/chat`    | Send a query and get an AI reading |
| GET    | `/ai/history` | Fetch all past chat conversations  |

---

### **Controller (`controller/chatController.js`)**

#### **`searchQuery`**

- Extracts the `query` string from `req.body`
- Picks only the necessary user fields from `req.user`: `fullName`, `dob`, `birthTime`, `birthPlace`, `_id`
- Passes them to `chatService.handleGptSearchClick()` and returns the AI response

#### **`getHistory`**

- Extracts `_id` from `req.user`
- Calls `chatService.getChatHistory()` and returns all past conversations for that user

---

### **Service (`services/chatService.js`)**

This is the core of the AstroBot experience.

#### **`handleGptSearchClick(userData, query)`**

1. **Builds a detailed prompt** for Gemini acting as _"Jyotish Acharya"_ — a Vedic/Western astrologer with 30+ years experience
2. **Injects user birth data** (`name`, `dob`, `birthTime`, `birthPlace`) and today's date into the prompt dynamically
3. **Instructs Gemini** to return only future-focused predictions (nothing before today), scoped strictly to the user's query
4. **Calls Gemini 2.5 Flash** via `ai.models.generateContent()`
5. **Strips any markdown fences** (` ```json ``` `) from the response before parsing — Gemini sometimes adds these
6. **Parses the JSON** response into a structured object with fields: `summary`, `career`, `finance`, `love`, `health`, `advice[]`, `important_dates[]`
7. **Saves the conversation** to MongoDB under the user's `Chat` document — creates a new document if first-time, otherwise pushes a new conversation entry
8. Returns the parsed AI response to the controller

#### **`getChatHistory(userId)`**

- Finds the user's `Chat` document by `userId`
- Returns an array of all conversations, each with a `title` (first 50 chars of the query) and their `messages` (request + response pairs)

---

## 📊 AI Response Structure

```json
{
  "summary": "Concise prediction based on active planetary positions",
  "career": "Only if relevant to the query",
  "finance": "Only if relevant to the query",
  "love": "Only if relevant to the query",
  "health": "Only if relevant to the query",
  "advice": ["Actionable advice based on current planetary positions", "..."],
  "important_dates": ["YYYY-MM-DD"]
}
```

---

## 🔄 Full Request Flow Diagram

```
Client (Authenticated via cookie)
  │
  ├─ POST /ai/chat ─────────────► chatController.searchQuery
  │   { query: "..." }                    │
  │                              Extract user data from req.user
  │                                       │
  │                              chatService.handleGptSearchClick
  │                                       │
  │                              Build personalized Gemini prompt
  │                              (inject birth data + today's date)
  │                                       │
  │                              Call Gemini 2.5 Flash API
  │                                       │
  │                              Strip markdown → Parse JSON
  │                                       │
  │                              Save to Chat collection (MongoDB)
  │                                       │
  │◄────────────── Return structured AI response ──────────────────
  │
  ├─ GET /ai/history ───────────► chatController.getHistory
  │                                       │
  │                              chatService.getChatHistory(userId)
  │                                       │
  │                              Fetch Chat doc from MongoDB
  │                                       │
  │◄────────────── Return all conversations ───────────────────────
  │
  ├─ GET /user/profile ─────────► userController.getProfile
  │                                       │
  │                              Return req.user (set by userAuth)
  │◄────────────── User data ──────────────────────────────────────
  │
  └─ PATCH /user/profile ───────► userController.updateProfile
      { fullName, dob, ... }              │
                                 Validate fields whitelist
                                          │
                                 userService.updateProfile
                                          │
                                 findByIdAndUpdate (MongoDB)
                                          │
                         ◄─────── Return updated user ───────────
```

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start the server
npm start
```

---

# 🌟 AstroBot Frontend

A React-based frontend for **AstroBot** — an AI-powered astrology chatbot. Built with Vite, Redux Toolkit, and Tailwind CSS.

---

## 🛠️ Tech Stack

- **Framework:** React (Vite)
- **State Management:** Redux Toolkit + RTK Query
- **Routing:** React Router DOM v6
- **Forms & Validation:** Formik + Yup
- **Notifications:** React Toastify
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

---

## 📁 Project Structure

```
src/
├── api/
│   ├── api.js              # RTK Query API slices (auth, chat, user)
│   └── baseQuery.js        # Base fetch config + 401 auto-logout handler
├── store/
│   └── appstore.js         # Redux store setup
├── routes/
│   └── route.js            # React Router config
├── components/
│   ├── AppLayout.jsx        # Root layout wrapper with background
│   ├── ProtectedRoute.jsx   # Redirects unauthenticated users to /auth
│   ├── AuthRoute.jsx        # Redirects logged-in users away from /auth
│   └── ErrorPage.jsx        # Custom 404 page
├── pages/
│   ├── hero/
│   │   └── Hero.jsx         # Landing page
│   ├── auth/
│   │   ├── Auth.jsx         # Login/Signup toggle wrapper
│   │   └── components/
│   │       ├── Login.jsx    # Login form
│   │       └── Signup.jsx   # Signup form
│   ├── ai/
│   │   ├── Astrobot.jsx     # AI landing page (post-login home)
│   │   ├── Chat.jsx         # Chat page layout
│   │   └── components/
│   │       ├── ChatScreen.jsx  # Message list + input
│   │       ├── ChatHeader.jsx  # Header with logout button
│   │       ├── Sidebar.jsx     # Chat history sidebar
│   │       └── BotMessage.jsx  # Structured AI response renderer
│   └── dashboard/
│       └── Profile.jsx      # Profile view & update form
└── App.jsx                  # Root component (Provider + Router + Toast)
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=your_backend_api_url
```

---

## 🗺️ Routing (`routes/route.js`)

All routes are nested under `AppLayout`, which applies the global dark background.

| Path         | Component      | Protection     | Description                         |
| ------------ | -------------- | -------------- | ----------------------------------- |
| `/`          | `Hero`         | Public         | Landing page                        |
| `/auth`      | `Auth`         | AuthRoute      | Login/Signup (blocked if logged in) |
| `/ai`        | `AstrobotPage` | ProtectedRoute | Post-login home with navigation     |
| `/ai/chat`   | `Chat`         | ProtectedRoute | AI chat interface                   |
| `/dashboard` | `Profile`      | ProtectedRoute | View & update profile               |
| `*`          | `ErrorPage`    | —              | Custom 404                          |

---

## 🛡️ Route Guards

### **`ProtectedRoute`**

- Checks `localStorage` for `isLoggedIn` key
- If not found, redirects to `/auth`
- Wraps all authenticated pages

### **`AuthRoute`**

- Reads the `token` cookie from `document.cookie`
- If a token is present (user already logged in), redirects to `/ai`
- Prevents logged-in users from accessing the login/signup page

---

## 🌐 API Layer (`api/`)

### **Base Query (`baseQuery.js`)**

- Wraps RTK Query's `fetchBaseQuery` with `credentials: "include"` so cookies are sent with every request
- Reads `VITE_API_URL` from env for the base URL
- Implements a **global 401 auto-logout handler**:
  - If any request returns a 401 (token expired/invalid), it automatically calls `/auth/logout`
  - Shows a toast: "Session expired. Please login again."
  - Redirects to `/auth` after 1.2 seconds
  - Uses an `isLoggingOut` flag to prevent multiple simultaneous logout calls

### **API Slices (`api.js`)**

Three separate RTK Query API slices, all using `baseQueryWithAuth`:

#### **`authApi`**

| Hook                | Method | Endpoint       | Description       |
| ------------------- | ------ | -------------- | ----------------- |
| `useSignupMutation` | POST   | `/auth/signup` | Register new user |
| `useLoginMutation`  | POST   | `/auth/login`  | Login user        |
| `useLogoutMutation` | POST   | `/auth/logout` | Logout user       |

#### **`chatApi`**

| Hook                     | Method | Endpoint      | Description        |
| ------------------------ | ------ | ------------- | ------------------ |
| `useSendMessageMutation` | POST   | `/ai/chat`    | Send query to AI   |
| `useGetHistoryQuery`     | GET    | `/ai/history` | Fetch chat history |

#### **`userApi`**

| Hook                       | Method | Endpoint        | Description        |
| -------------------------- | ------ | --------------- | ------------------ |
| `useGetProfileQuery`       | GET    | `/user/profile` | Fetch user profile |
| `useUpdateProfileMutation` | PATCH  | `/user/profile` | Update profile     |

---

## 📄 Pages & Components

### **`AppLayout.jsx`**

- Root layout with a full-screen dark background image overlay using a CSS gradient
- Renders child routes via `<Outlet />`

---

### **Hero Page (`/`)**

- Simple landing page with app tagline and a "Get Started" button linking to `/auth`

---

### **Auth Page (`/auth`) — `Auth.jsx`**

- Toggles between `Login` and `Signup` components using local `useState`
- Shares a toggle link below the form

#### **`Login.jsx`**

- Formik form with `emailId` and `password` fields
- Yup validation: valid email + strong password regex
- On success: sets `localStorage.isLoggedIn = "true"`, navigates to `/ai`

#### **`Signup.jsx`**

- Formik form with all 6 fields: `fullName`, `emailId`, `password`, `dob`, `birthTime`, `birthPlace`
- Yup validation for each field including date format (`DD/MM/YYYY`), time format (`HH:MM am/pm`), and password strength
- On success: sets `localStorage.isLoggedIn = "true"`, navigates to `/ai`

---

### **AstroBot Page (`/ai`) — `AstrobotPage.jsx`**

- Post-login landing page with two navigation buttons:
  - **Dashboard** → `/dashboard`
  - **Chat with AI** → `/ai/chat`
- Displays a spinning astrology wheel image

---

### **Chat Page (`/ai/chat`) — `Chat.jsx`**

Composed of two components side by side:

#### **`Sidebar.jsx`**

- Calls `useGetHistoryQuery` on mount to load past conversations
- Displays each conversation's `title` (first 50 chars of the query) in a scrollable list
- Shows loading/error states gracefully

#### **`ChatScreen.jsx`**

- Maintains local `messages` state (array of `{ sender, text/data }`)
- Initializes with a bot greeting message
- On form submit:
  1. Immediately appends the user's message to the chat
  2. Sets `isBotLoading = true` to show a loading indicator
  3. Calls `useSendMessageMutation` with the query
  4. Appends the structured bot response on success
- Auto-scrolls to the latest message using a `useRef` + `useEffect`
- Passes bot responses to `BotMessage` for structured rendering

#### **`ChatHeader.jsx`**

- Displays the bot name, avatar, and online status
- Logout button calls `useLogoutMutation`, clears `localStorage.isLoggedIn`, and navigates to `/`

#### **`BotMessage.jsx`**

- Handles two response types:
  - **String** → renders plain text (e.g., the initial greeting)
  - **Object** → renders a structured card layout with:
    - Summary paragraph
    - 2-column grid for `career`, `finance`, `love`, `health` (only shown if present in response)
    - Advice bullet list
    - Important dates as styled badges
- Each section is color-coded with a left border accent

---

### **Profile Page (`/dashboard`) — `Profile.jsx`**

- Calls `useGetProfileQuery` to pre-fill the form with current user data
- Uses `enableReinitialize: true` in Formik so the form updates once data loads
- Editable fields: `fullName`, `dob`, `birthTime`, `birthPlace` (email is not editable)
- Live preview panel on the right side shows the current form values in real time
- On submit: calls `useUpdateProfileMutation`, shows a success toast, navigates to `/ai`

---

## ✅ Validation Rules (Yup)

| Field        | Rule                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| `fullName`   | Required, 4–25 characters                                                   |
| `emailId`    | Required, valid email format                                                |
| `password`   | Required, min 8 chars, must have uppercase, lowercase, number, special char |
| `dob`        | Required, format: `DD/MM/YYYY`                                              |
| `birthTime`  | Required, format: `HH:MM am/pm`                                             |
| `birthPlace` | Required, min 2 characters                                                  |

---

## 🔄 Auth Flow

```
User visits /auth
        │
   Already has cookie?
        │
   Yes ─┤─► Redirect to /ai  (AuthRoute)
        │
   No   │
        ▼
   Login / Signup form
        │
   On success:
   - Cookie set by backend (httpOnly)
   - localStorage.isLoggedIn = "true"
   - Navigate to /ai
        │
        ▼
   Protected pages accessible (ProtectedRoute checks localStorage)
        │
   On logout or 401:
   - Cookie cleared by backend
   - localStorage.isLoggedIn removed
   - Redirect to /auth or /
```

---

## 💬 Chat Flow

```
User types query in ChatScreen
        │
        ▼
Append user message to local state
        │
        ▼
POST /ai/chat  (useSendMessageMutation)
        │
        ▼
Show loading indicator
        │
        ▼
Receive structured JSON from backend
        │
        ▼
Append bot message to local state
        │
        ▼
BotMessage renders:
  ├── Summary
  ├── Career / Finance / Love / Health (if present)
  ├── Advice list
  └── Important dates as badges
```

---

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```
