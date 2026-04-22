import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Groq } from 'groq-sdk'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const MONGODB_URI = process.env.MONGODB_URI
const GROQ_API_KEY = process.env.GROQ_API_KEY
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null

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

// Farm Data Schema
const farmDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Summer', 'Year-round'],
    required: true
  },
  soilType: {
    type: String,
    enum: ['Black soil', 'Red soil', 'Sandy soil', 'Clay soil', 'Loamy soil', 'Alluvial soil'],
    required: true
  },
  waterAvailability: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Rainfed only', 'Borewell', 'Canal irrigation', 'Drip irrigation'],
    required: true
  },
  budget: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true
  },
  goal: {
    type: String,
    enum: ['High profit', 'Low risk', 'Fast harvest', 'Household use', 'Fodder'],
    required: true
  },
  preference: {
    type: String,
    enum: ['Organic', 'Chemical', 'Mixed'],
    required: true
  },
  rainfall: {
    type: String,
    enum: ['Low rainfall', 'Moderate', 'Heavy rainfall'],
    required: true
  },
  temperature: {
    type: String,
    enum: ['Hot', 'Moderate', 'Cold'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  preferredCrop: {
    type: String,
    enum: ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Groundnut', 'Soybean', 'Millets'],
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Farm Data model
const FarmData = mongoose.model('FarmData', farmDataSchema)

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

const buildRecommendationPrompt = (data) => {
  const {
    location,
    landSize,
    season,
    soilType,
    waterAvailability,
    previousCrop,
    budget,
    expectedGoal
  } = data

  return `Suggest 3 crops for this farm in India.
Input:
location: ${location}
landSize: ${landSize}
season: ${season}
soilType: ${soilType}
water: ${waterAvailability}
previousCrop: ${previousCrop || 'NA'}
budget: ${budget}
goal: ${expectedGoal}

Rules:
- Keep choices realistic for season, soil, and water.
- Consider crop rotation with previousCrop.
- Short farmer-friendly reasons.
- Return JSON only.

Format:
{"summary":"...","recommendations":[{"crop":"...","reason":"...","tips":["...","..."]}]}`
}

const parseModelResponse = (responseText) => {
  if (!responseText || typeof responseText !== 'string') {
    return null
  }

  const cleaned = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  try {
    const parsed = JSON.parse(cleaned)
    if (parsed && Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
      return {
        summary: parsed.summary || 'These crops match your farm conditions and goals.',
        recommendations: parsed.recommendations.slice(0, 3)
      }
    }
  } catch {
    return null
  }

  return null
}

const weatherCodeMap = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Rain showers',
  81: 'Heavy rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm'
}

const getWeatherCondition = (code) => weatherCodeMap[code] || 'Unknown'

const safeNumber = (value, fallback = 0) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

const buildWeatherWarnings = ({ temperature, humidity, rainfall }) => {
  const warnings = []

  if (temperature > 40) {
    warnings.push('Extreme heat risk')
  }

  if (rainfall < 20) {
    warnings.push('Low rainfall')
  }

  if (humidity > 80) {
    warnings.push('High disease risk')
  }

  return warnings.length > 0 ? warnings : ['No major weather risk detected']
}

const buildWeatherInsightPrompt = ({ weather, crops, warnings }) => {
  return `You are an agriculture expert.

Weather:
Temperature: ${weather.temperature}°C
Humidity: ${weather.humidity}%
Rainfall: ${weather.rainfall} mm
Condition: ${weather.condition}

Farmer crops:
${crops.join(', ')}

Warnings:
${warnings.join(', ')}

Give short output with:
1) Best crop to focus on (choose from farmer crops)
2) Risks
3) Actionable farming advice`
}

const fetchJson = async (url) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`External API request failed with status ${response.status}`)
  }
  return response.json()
}

const resolveCoordinates = async ({ location, latitude, longitude }) => {
  const lat = safeNumber(latitude, NaN)
  const lon = safeNumber(longitude, NaN)

  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    return {
      latitude: lat,
      longitude: lon,
      label: location || 'Auto-detected location'
    }
  }

  if (!location) {
    throw new Error('Location is required when coordinates are not provided')
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
  const geocode = await fetchJson(url)
  const first = geocode?.results?.[0]

  if (!first) {
    throw new Error('Could not find coordinates for the provided location')
  }

  return {
    latitude: first.latitude,
    longitude: first.longitude,
    label: `${first.name}${first.admin1 ? `, ${first.admin1}` : ''}${first.country ? `, ${first.country}` : ''}`
  }
}

const fallbackWeatherInsight = ({ crops, warnings }) => {
  const crop = crops[0] || 'the most weather-resilient crop in your list'
  return `Best crop: ${crop}\nRisks: ${warnings.join(', ')}\nAdvice: Increase irrigation frequency in hot periods, monitor pest and fungal risk, and follow stage-wise nutrient scheduling.`
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

app.post('/api/smart-recommendations', async (req, res) => {
  try {
    if (!groq) {
      return res.status(500).json({
        error: 'Missing GROQ_API_KEY in server environment variables. Please add your GROQ API key to the .env file.'
      })
    }

    const requiredFields = [
      'location',
      'landSize',
      'season',
      'soilType',
      'waterAvailability',
      'expectedGoal'
    ]

    const missing = requiredFields.filter((field) => !req.body?.[field])
    if (missing.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(', ')}`
      })
    }

    const prompt = buildRecommendationPrompt(req.body)

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.4,
      max_completion_tokens: 500,
      top_p: 1,
      stream: true,
      reasoning_effort: 'low'
    })

    let modelOutput = ''
    for await (const chunk of chatCompletion) {
      modelOutput += chunk.choices?.[0]?.delta?.content || ''
    }

    const parsed = parseModelResponse(modelOutput)
    if (!parsed) {
      return res.status(502).json({
        error: 'Model returned unexpected format. Please try again.'
      })
    }

    return res.json(parsed)
  } catch (error) {
    console.error('Smart recommendation error:', error)
    return res.status(500).json({
      error: 'Failed to generate recommendations. Please try again shortly.'
    })
  }
})

app.post('/api/weather', async (req, res) => {
  try {
    const { location, crops, latitude, longitude } = req.body || {}

    if (!Array.isArray(crops) || crops.length === 0) {
      return res.status(400).json({
        error: 'At least one crop must be selected'
      })
    }

    const coordinates = await resolveCoordinates({ location, latitude, longitude })

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=5&timezone=auto`
    const weatherData = await fetchJson(weatherUrl)

    const current = weatherData.current || {}
    const daily = weatherData.daily || {}

    const temperature = safeNumber(current.temperature_2m)
    const humidity = safeNumber(current.relative_humidity_2m)
    const rainfall = safeNumber(daily.precipitation_sum?.[0], safeNumber(current.precipitation))
    const weatherCode = safeNumber(current.weather_code, 0)
    const condition = getWeatherCondition(weatherCode)

    const warnings = buildWeatherWarnings({ temperature, humidity, rainfall })

    const forecast = (daily.time || []).slice(0, 5).map((date, index) => ({
      date,
      tempMax: safeNumber(daily.temperature_2m_max?.[index]),
      tempMin: safeNumber(daily.temperature_2m_min?.[index]),
      precipitation: safeNumber(daily.precipitation_sum?.[index]),
      condition: getWeatherCondition(safeNumber(daily.weather_code?.[index]))
    }))

    const weather = {
      location: coordinates.label,
      temperature,
      humidity,
      rainfall,
      condition
    }

    let insights = fallbackWeatherInsight({ crops, warnings })

    if (groq) {
      const prompt = buildWeatherInsightPrompt({ weather, crops, warnings })
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        model: 'openai/gpt-oss-120b',
        temperature: 0.3,
        max_completion_tokens: 400,
        top_p: 1,
        stream: true,
        reasoning_effort: 'low'
      })

      let output = ''
      for await (const chunk of completion) {
        output += chunk.choices?.[0]?.delta?.content || ''
      }

      if (output.trim()) {
        insights = output.trim()
      }
    }

    return res.json({
      weather,
      forecast,
      warnings,
      insights
    })
  } catch (error) {
    console.error('Weather insights error:', error)
    return res.status(500).json({
      error: 'Failed to generate weather insights. Please try again.'
    })
  }
})

// Seasonal crop calendar endpoint for structured seasonal crop recommendations
app.post('/api/seasonal-calendar', async (req, res) => {
  try {
    if (!groq) {
      return res.status(500).json({
        error: 'Missing GROQ_API_KEY in server environment variables. Please add your GROQ API key to the .env file.'
      })
    }

    const { location } = req.body
    if (!location) {
      return res.status(400).json({ error: 'Location is required' })
    }

    const prompt = `You are an agricultural expert providing seasonal crop recommendations for ${location}.

Please provide a structured JSON response with crop recommendations for all 4 seasons. For each season, recommend 3-5 suitable crops with the following details:

Required JSON format:
{
  "seasons": {
    "Kharif": {
      "crops": [
        {
          "name": "Rice",
          "emoji": "??",
          "duration": 120,
          "yield": "4.5",
          "suitability": 85
        }
      ]
    },
    "Rabi": {
      "crops": [
        {
          "name": "Wheat", 
          "emoji": "??",
          "duration": 110,
          "yield": "3.2",
          "suitability": 78
        }
      ]
    },
    "Summer": {
      "crops": [
        {
          "name": "Maize",
          "emoji": "??", 
          "duration": 90,
          "yield": "2.8",
          "suitability": 72
        }
      ]
    },
    "Year-round": {
      "crops": [
        {
          "name": "Sugarcane",
          "emoji": "??",
          "duration": 365,
          "yield": "70",
          "suitability": 88
        }
      ]
    }
  }
}

Important guidelines:
- Duration should be in days (integer)
- Yield should be in tons/hectare (decimal)
- Suitability should be 0-100 (integer)
- Use appropriate emojis for each crop
- Consider the local climate, soil conditions, and traditional farming practices for ${location}
- Focus on crops that are actually suitable for the region

Return ONLY the JSON object, no additional text.`

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.4,
      max_completion_tokens: 1000,
      top_p: 1,
      stream: false,
      reasoning_effort: 'low'
    })

    const response = chatCompletion.choices[0]?.message?.content
    
    if (!response) {
      return res.status(502).json({
        error: 'Model returned empty response. Please try again.'
      })
    }

    let parsedData
    try {
      // Try to parse the response as JSON
      parsedData = JSON.parse(response)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      return res.status(502).json({
        error: 'Model returned invalid JSON format. Please try again.'
      })
    }

    return res.json({
      success: true,
      data: parsedData,
      location: location
    })
  } catch (error) {
    console.error('Seasonal calendar error:', error)
    return res.status(500).json({
      error: 'Failed to generate seasonal crop recommendations. Please try again shortly.'
    })
  }
})

// Farm Data API endpoints
app.post('/api/farm-data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const farmData = { ...req.body, userId }
    
    // Check if user already has farm data
    const existingData = await FarmData.findOne({ userId })
    
    if (existingData) {
      // Update existing data
      const updatedData = await FarmData.findOneAndUpdate(
        { userId },
        { ...farmData, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      res.json({ message: 'Farm data updated successfully', farmData: updatedData })
    } else {
      // Create new farm data
      const newFarmData = new FarmData(farmData)
      await newFarmData.save()
      res.status(201).json({ message: 'Farm data saved successfully', farmData: newFarmData })
    }
  } catch (error) {
    console.error('Save farm data error:', error)
    res.status(500).json({ error: 'Failed to save farm data' })
  }
})

app.get('/api/farm-data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id
    const farmData = await FarmData.findOne({ userId })
    
    if (!farmData) {
      return res.status(404).json({ error: 'No farm data found' })
    }
    
    res.json({ farmData })
  } catch (error) {
    console.error('Get farm data error:', error)
    res.status(500).json({ error: 'Failed to retrieve farm data' })
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
