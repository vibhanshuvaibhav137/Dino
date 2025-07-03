# Ball Runner Game

Ball Runner is a modern, browser-based endless runner game inspired by the classic Chrome Dino, reimagined with a fresh twist. Built with React on the frontend and Node.js/Express on the backend, the project features a robust architecture designed for performance and scalability.

In Ball Runner, players control a ball, jump over obstacles, and aim to beat their personal best scores. The game handles user registration seamlessly using browser fingerprinting—no sign-up required. Players can compete on a global leaderboard, with all progress and scores persistently stored, even during offline play.

---

## 🌐 Live Demo

**Play Ball Runner now:** [https://ball-runner-app.vercel.app/](https://ball-runner-app.vercel.app/)

---

## 📝 Project Overview

- **Endless runner gameplay** with smooth controls and increasing difficulty.
- **Anonymous browser authentication**: No sign-up, users are uniquely identified by browser fingerprints.
- **Persistent stats & leaderboard**: Scores, total games, jumps, and more, with a global competitive board.
- **Offline support**: Play and save scores offline, automatic sync when online.
- **Modern stack**: React 19, Zustand, Tailwind CSS (frontend); Node.js (ESM), Express v5, Mongoose (backend).
- **Secure JWT authentication** for all protected API routes.

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** (v18 or newer recommended)
- **MongoDB** (local or Atlas Cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/vibhanshuvaibhav137/Dino.git
cd Dino
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```
PORT=8000
MONGODB_URL=mongodb://localhost:27017 (your mongoDB url without "/" in the end)
ACCESS_TOKEN_SECRET=your_jwt_secret
ACCESS_TOKEN_EXPIRY=7d
CORS_ORIGIN=http://localhost:3000
NODE_ENV="development"
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open new terminal:

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend will run at [http://localhost:3000](http://localhost:3000).

---

## 🌐 API Endpoints & Sample Requests

### **Authentication**

<details>
<summary><strong>Register / Login</strong></summary>

**POST** `/api/v1/auth/register`  
**POST** `/api/v1/auth/login`

Sample Request:
```json
{
  "browserId": "unique-browser-id",
  "browserFingerprint": "fingerprint-string",
  "userAgent": "Mozilla/5.0 ..."
}
```
</details>

---

### **User Profile**

<details>
<summary><strong>Get User Profile (JWT Protected)</strong></summary>

**GET** `/api/v1/user/profile`  
_Headers_: `Authorization: Bearer <token>`

Response:
```json
{
  "user": {
    "_id": "...",
    "browserId": "...",
    "gamesPlayed": 2,
    "highScore": 100,
    ...
  }
}
```
</details>

---

### **Scores**

<details>
<summary><strong>Submit Score / Sync / Leaderboard</strong></summary>

**POST** `/api/v1/scores/`  
**POST** `/api/v1/scores/sync`  
**GET** `/api/v1/scores/leaderboard`  
**GET** `/api/v1/scores/user-score` (JWT Protected)

Sample Submit Score:
```json
{
  "score": 120,
  "gameData": {
    "jumps": 10,
    "obstaclesHit": 1
  }
}
```
</details>

---

### **Health Check**

**GET** `/api/v1/health`  
Returns server status and current timestamp.

---

## 🛠 Technologies Used

**Frontend:**
- React 19
- Zustand
- Tailwind CSS
- Vite
- Heroicons
- Axios

**Backend:**
- Node.js (ESM)
- Express v5
- Mongoose (MongoDB)
- JWT (`jsonwebtoken`)
- bcrypt
- Helmet, CORS, Rate-limiting, Validator, Cookie-parser, dotenv

---

## 📁 Project Structure

```
Dino/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── db/
│   │   ├── utils/
│   │   └── ...
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
└── README.md
```

---

## 🖼️ Screenshots

### Homepage 
![Homepage](https://github.com/vibhanshuvaibhav137/ScoreCard-App/blob/02ad62e4a791975215786f191024a79efa24836a/ig1.png)


### Game Play
![Game Play](https://github.com/vibhanshuvaibhav137/ScoreCard-App/blob/02ad62e4a791975215786f191024a79efa24836a/ig2.png)


### Leaderboard and Scores
![Leaderboard and Scores](https://github.com/vibhanshuvaibhav137/ScoreCard-App/blob/02ad62e4a791975215786f191024a79efa24836a/ig3.png)

---

## 💡 How It Works

- **No Sign-Up Needed:** Auto-registration with browser fingerprinting on your first visit.
- **JWT Authentication:** API requests are authenticated with JWTs, stored securely.
- **Offline Play:** Scores and stats are kept locally when offline, then synced when reconnected.
- **Leaderboard:** Global leaderboard is managed on the backend and updated in real-time.

---

## 🛠 Development Scripts

**Backend:**
- `npm run dev` – Start backend with nodemon

**Frontend:**
- `npm run dev` – Start React dev server
- `npm run build` – Production build
- `npm run lint` – Lint codebase
- `npm run preview` – Preview production build

---

## 🤝 Contributing

Contributions are welcome! Please open an issue for major changes or feature discussions before submitting a pull request.

---

## 📄 License

MIT

