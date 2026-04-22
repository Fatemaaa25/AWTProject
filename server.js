import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const MONGODB_URI = process.env.MONGODB_URI

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// User model
const User = mongoose.model('User', userSchema)

// MongoDB connection
const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      console.error('MONGODB_URI is not defined in environment variables')
      process.exit(1)
    }
    
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB Atlas')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      name: user.name 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  })
}

// Routes
app.post('/api/auth/register', async (req, res) => {
  console.log('Registration request received:', req.body)
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    await newUser.save()

    // Generate token
    const token = generateToken(newUser)

    // Return user data without password
    const userObj = newUser.toObject()
    const { password: _, ...userWithoutPassword } = userObj

    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    if (error.code === 11000) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user)

    // Return user data without password
    const userObj = user.toObject()
    const { password: _, ...userWithoutPassword } = userObj

    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Return user data without password
    const userObj = user.toObject()
    const { password: _, ...userWithoutPassword } = userObj

    res.json({
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Mock endpoints for other features
app.post('/api/recommendations', authenticateToken, (req, res) => {
  // Mock crop recommendations
  res.json({
    recommendations: [
      { crop: 'Wheat', confidence: 0.85, reason: 'Suitable for current soil conditions' },
      { crop: 'Rice', confidence: 0.72, reason: 'Good water availability' },
      { crop: 'Corn', confidence: 0.68, reason: 'Matches climate patterns' }
    ]
  })
})

app.get('/api/weather', authenticateToken, (req, res) => {
  // Mock weather data
  res.json({
    current: {
      temperature: 25,
      humidity: 65,
      description: 'Partly cloudy'
    },
    forecast: [
      { day: 'Tomorrow', temp: 27, condition: 'Sunny' },
      { day: 'Day 2', temp: 24, condition: 'Rainy' },
      { day: 'Day 3', temp: 26, condition: 'Cloudy' }
    ]
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start server
const startServer = async () => {
  await connectDB()
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/api/health`)
  })
}

startServer()
