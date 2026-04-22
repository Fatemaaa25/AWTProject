# AgriSmart - AI-Powered Agriculture Platform

A full-stack web application for smart farming with crop recommendations, weather insights, and user authentication.

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Crop Recommendations**: AI-powered suggestions based on farm data
- **Weather Insights**: Real-time weather data and forecasts
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons

## Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React
- React Hot Toast
- Axios

### Backend
- Node.js
- Express.js
- MongoDB Atlas with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS support

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB Atlas:
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier is sufficient)
   - Create a database user with read/write permissions
   - Whitelist your IP address (0.0.0.0/0 for development)
   - Get your connection string

4. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your MongoDB Atlas connection string:
     ```
     MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority
     ```
    - Add your Groq API key for smart recommendations:
       ```
       GROQ_API_KEY=your-groq-api-key
       ```
   - Update `JWT_SECRET` with a secure key for production

### Running the Application

#### Option 1: Run both frontend and backend together
```bash
npm run dev:full
```

#### Option 2: Run separately

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run dev
```

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

#### Features
- `POST /api/recommendations` - Get crop recommendations (protected)
- `POST /api/smart-recommendations` - LLM-powered crop recommendations from Groq
- `GET /api/weather` - Get weather insights (protected)
- `GET /api/health` - Health check endpoint

### Usage

1. **Register a new account**:
   - Click "Sign Up" on the landing page
   - Fill in your details and submit

2. **Login**:
   - Use your email and password to login
   - Token will be stored in localStorage

3. **Access Dashboard**:
   - After login, you'll be redirected to the dashboard
   - Access crop recommendations and weather insights

### Development Notes

- User data is stored in MongoDB Atlas cloud database
- JWT tokens expire after 7 days
- Passwords are hashed using bcryptjs
- Frontend runs on port 5173 (Vite default)
- Backend runs on port 5000

### Security Considerations

- Change the `JWT_SECRET` in production
- Secure your MongoDB Atlas connection with strong credentials
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Use HTTPS in production
- Enable MongoDB Atlas security features (IP whitelisting, network encryption)

### Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run dev:full` - Start both frontend and backend
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## License

MIT License
