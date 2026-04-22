import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { saveFarmData, getFarmData } from '../services/api.js'
import toast from 'react-hot-toast'
import ProgressBar from '../components/ProgressBar.jsx'
import StatsCard from '../components/StatsCard.jsx'
import RiskAssessment from '../components/RiskAssessment.jsx'
import SeasonalCalendar from '../components/SeasonalCalendar.jsx'

const seasonOptions = ['Kharif', 'Rabi', 'Summer', 'Year-round']
const soilTypeOptions = [
  'Black soil',
  'Red soil', 
  'Sandy soil',
  'Clay soil',
  'Loamy soil',
  'Alluvial soil'
]
const waterOptions = [
  'Low',
  'Medium', 
  'High',
  'Rainfed only',
  'Borewell',
  'Canal irrigation',
  'Drip irrigation'
]
const budgetOptions = ['Low', 'Medium', 'High']
const goalOptions = ['High profit', 'Low risk', 'Fast harvest', 'Household use', 'Fodder']
const preferenceOptions = ['Organic', 'Chemical', 'Mixed']
const rainfallOptions = ['Low rainfall', 'Moderate', 'Heavy rainfall']
const temperatureOptions = ['Hot', 'Moderate', 'Cold']
const cropOptions = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Groundnut', 'Soybean', 'Millets']

export default function Dashboard() {
  const { user } = useAuth()
  const [farmData, setFarmData] = useState({
    season: '',
    soilType: '',
    waterAvailability: '',
    budget: '',
    goal: '',
    preference: '',
    rainfall: '',
    temperature: '',
    location: '',
    preferredCrop: '',
    landSize: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [dataExists, setDataExists] = useState(false)
  const [recommendations, setRecommendations] = useState(null)

  useEffect(() => {
    loadFarmData()
  }, [])

  const loadFarmData = async () => {
    try {
      const response = await getFarmData()
      if (response.data.farmData) {
        setFarmData(response.data.farmData)
        setDataExists(true)
        generateDynamicRecommendations(response.data.farmData)
      }
    } catch (error) {
      // No farm data exists, that's okay
      console.log('No existing farm data found')
    }
  }

  const handleInputChange = (field, value) => {
    setFarmData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Dynamic calculation functions
  const calculateCropSuitability = (crop, farmData) => {
    const factors = {
      soilMatch: calculateSoilMatch(crop, farmData.soilType),
      waterNeeds: calculateWaterMatch(crop, farmData.waterAvailability),
      climateMatch: calculateClimateMatch(crop, farmData.temperature, farmData.rainfall),
      seasonMatch: calculateSeasonMatch(crop, farmData.season),
      marketDemand: calculateMarketDemand(crop, farmData.location)
    }
    
    const weights = { soilMatch: 0.25, waterNeeds: 0.25, climateMatch: 0.20, seasonMatch: 0.15, marketDemand: 0.15 }
    const suitability = Math.round(Object.entries(factors).reduce((sum, [key, value]) => sum + (value * weights[key]), 0))
    
    return { suitability, factors }
  }

  const calculateSoilMatch = (crop, soilType) => {
    const soilPreferences = {
      'Rice': { 'Loamy soil': 95, 'Clay soil': 90, 'Alluvial soil': 85, 'Black soil': 80, 'Red soil': 70, 'Sandy soil': 50 },
      'Wheat': { 'Loamy soil': 90, 'Alluvial soil': 85, 'Black soil': 80, 'Clay soil': 75, 'Red soil': 70, 'Sandy soil': 60 },
      'Cotton': { 'Black soil': 95, 'Loamy soil': 85, 'Alluvial soil': 80, 'Red soil': 75, 'Clay soil': 70, 'Sandy soil': 65 },
      'Maize': { 'Loamy soil': 90, 'Alluvial soil': 85, 'Black soil': 80, 'Red soil': 75, 'Clay soil': 70, 'Sandy soil': 60 },
      'Sugarcane': { 'Loamy soil': 95, 'Alluvial soil': 90, 'Black soil': 85, 'Clay soil': 80, 'Red soil': 70, 'Sandy soil': 60 }
    }
    return soilPreferences[crop]?.[soilType] || 50
  }

  const calculateWaterMatch = (crop, waterAvailability) => {
    const waterNeeds = {
      'Rice': { 'High': 95, 'Medium': 85, 'Low': 60, 'Canal irrigation': 90, 'Drip irrigation': 85, 'Borewell': 80, 'Rainfed only': 40 },
      'Wheat': { 'Medium': 90, 'Low': 75, 'High': 70, 'Canal irrigation': 85, 'Drip irrigation': 90, 'Borewell': 80, 'Rainfed only': 50 },
      'Cotton': { 'Medium': 85, 'Low': 80, 'High': 75, 'Drip irrigation': 90, 'Borewell': 85, 'Canal irrigation': 80, 'Rainfed only': 60 },
      'Maize': { 'Medium': 90, 'Low': 85, 'High': 70, 'Drip irrigation': 90, 'Borewell': 85, 'Canal irrigation': 80, 'Rainfed only': 65 },
      'Sugarcane': { 'High': 95, 'Medium': 85, 'Low': 60, 'Canal irrigation': 90, 'Drip irrigation': 85, 'Borewell': 80, 'Rainfed only': 45 }
    }
    return waterNeeds[crop]?.[waterAvailability] || 50
  }

  const calculateClimateMatch = (crop, temperature, rainfall) => {
    const climatePrefs = {
      'Rice': { 'Hot': { 'Heavy rainfall': 95, 'Moderate': 85, 'Low rainfall': 60 }, 'Moderate': { 'Heavy rainfall': 90, 'Moderate': 80, 'Low rainfall': 55 }, 'Cold': { 'Heavy rainfall': 60, 'Moderate': 50, 'Low rainfall': 30 } },
      'Wheat': { 'Cold': { 'Low rainfall': 90, 'Moderate': 80, 'Heavy rainfall': 70 }, 'Moderate': { 'Low rainfall': 85, 'Moderate': 75, 'Heavy rainfall': 65 }, 'Hot': { 'Low rainfall': 60, 'Moderate': 50, 'Heavy rainfall': 40 } },
      'Cotton': { 'Hot': { 'Low rainfall': 90, 'Moderate': 85, 'Heavy rainfall': 75 }, 'Moderate': { 'Low rainfall': 85, 'Moderate': 80, 'Heavy rainfall': 70 }, 'Cold': { 'Low rainfall': 50, 'Moderate': 45, 'Heavy rainfall': 35 } },
      'Maize': { 'Hot': { 'Moderate': 90, 'Low rainfall': 85, 'Heavy rainfall': 75 }, 'Moderate': { 'Moderate': 85, 'Low rainfall': 80, 'Heavy rainfall': 70 }, 'Cold': { 'Moderate': 60, 'Low rainfall': 55, 'Heavy rainfall': 45 } },
      'Sugarcane': { 'Hot': { 'Heavy rainfall': 95, 'Moderate': 90, 'Low rainfall': 70 }, 'Moderate': { 'Heavy rainfall': 85, 'Moderate': 80, 'Low rainfall': 60 }, 'Cold': { 'Heavy rainfall': 50, 'Moderate': 45, 'Low rainfall': 30 } }
    }
    return climatePrefs[crop]?.[temperature]?.[rainfall] || 50
  }

  const calculateSeasonMatch = (crop, season) => {
    const seasonCrops = {
      'Kharif': ['Rice', 'Cotton', 'Maize', 'Sugarcane'],
      'Rabi': ['Wheat', 'Mustard', 'Gram', 'Peas'],
      'Summer': ['Maize', 'Sugarcane', 'Cotton'],
      'Year-round': ['Sugarcane', 'Banana', 'Coconut']
    }
    return seasonCrops[season]?.includes(crop) ? 90 : 40
  }
  
  const calculateMarketDemand = (crop, location) => {
    const regionDemand = {
      'North India': { 'Wheat': 95, 'Rice': 85, 'Cotton': 75, 'Maize': 80 },
      'South India': { 'Rice': 95, 'Sugarcane': 90, 'Cotton': 80, 'Maize': 75 },
      'East India': { 'Rice': 95, 'Wheat': 70, 'Maize': 80, 'Sugarcane': 75 },
      'West India': { 'Cotton': 95, 'Wheat': 80, 'Sugarcane': 85, 'Maize': 75 }
    }
    
    let region = 'North India'
    if (location.toLowerCase().includes('tamil') || location.toLowerCase().includes('kerala') || location.toLowerCase().includes('bangalore')) region = 'South India'
    else if (location.toLowerCase().includes('kolkata') || location.toLowerCase().includes('assam')) region = 'East India'
    else if (location.toLowerCase().includes('mumbai') || location.toLowerCase().includes('pune') || location.toLowerCase().includes('gujarat')) region = 'West India'
    
    return regionDemand[region]?.[crop] || 70
  }

  const generateDynamicRecommendations = (farmData) => {
    const allCrops = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane']
    const recommendations = allCrops.map(crop => {
      const { suitability, factors } = calculateCropSuitability(crop, farmData)
      const season = farmData.season || 'Kharif'
      
      const cropDetails = {
        'Rice': { yield: '4-5 tons/hectare', season: 'Kharif', duration: '120-130 days' },
        'Wheat': { yield: '3-4 tons/hectare', season: 'Rabi', duration: '100-120 days' },
        'Cotton': { yield: '2-3 tons/hectare', season: 'Kharif', duration: '160-180 days' },
        'Maize': { yield: '3-4 tons/hectare', season: 'Kharif/Summer', duration: '90-110 days' },
        'Sugarcane': { yield: '60-80 tons/hectare', season: 'Year-round', duration: '12-14 months' }
      }
      
      return {
        name: crop,
        suitability,
        season,
        ...cropDetails[crop],
        factors: [
          { name: 'Soil Match', score: factors.soilMatch },
          { name: 'Water Needs', score: factors.waterNeeds },
          { name: 'Climate', score: factors.climateMatch },
          { name: 'Market Demand', score: factors.marketDemand }
        ]
      }
    }).sort((a, b) => b.suitability - a.suitability).slice(0, 3)
    
    setRecommendations(recommendations)
  }

  const calculateProfileCompletion = () => {
    // Count only the essential fields for profile completion
    const essentialFields = ['soilType', 'waterAvailability', 'budget', 'goal', 'preference', 'location']
    const filledFields = essentialFields.filter(field => farmData[field] && farmData[field] !== '')
    return Math.round((filledFields.length / essentialFields.length) * 100)
  }

  const getStatsData = () => {
    return [
      {
        title: 'Recommendations',
        value: recommendations ? recommendations.length : 0,
        subtitle: 'Crops suggested for you',
        icon: '??',
        color: 'success',
        trend: 12
      },
      {
        title: 'Risk Level',
        value: dataExists && recommendations ? getDynamicRiskData().level.charAt(0).toUpperCase() + getDynamicRiskData().level.slice(1) : 'Medium',
        subtitle: 'Overall assessment',
        icon: '??',
        color: dataExists && recommendations ? (getDynamicRiskData().level === 'low' ? 'success' : getDynamicRiskData().level === 'medium' ? 'warning' : 'danger') : 'warning',
        trend: dataExists && recommendations ? (getDynamicRiskData().level === 'low' ? -5 : getDynamicRiskData().level === 'medium' ? 0 : 8) : 0
      },
      {
        title: 'Land Area',
        value: farmData.landSize || 'Not set',
        subtitle: 'Acres of farmland',
        icon: '??',
        color: 'primary',
        trend: 0
      },
      {
        title: 'Weather Type',
        value: farmData.temperature || 'Not set',
        subtitle: 'Current temperature',
        icon: '??',
        color: 'warning',
        trend: 0
      },
      {
        title: 'Rainfall',
        value: farmData.rainfall || 'Not set',
        subtitle: 'Precipitation level',
        icon: '??',
        color: 'primary',
        trend: 0
      },
      {
        title: 'Current Season',
        value: farmData.season || 'Not set',
        subtitle: 'Growing season',
        icon: '??',
        color: 'success',
        trend: 0
      }
    ]
  }

  const getDynamicRiskData = () => {
    if (!dataExists || !recommendations) {
      return {
        level: 'medium',
        score: 45,
        recommendation: 'Complete your farm profile to get accurate risk assessment and mitigation strategies.',
        factors: [
          {
            factor: 'Data Availability',
            level: 'high',
            description: 'Insufficient farm data for accurate risk assessment',
            mitigation: 'Complete your farm profile to enable precise risk analysis'
          }
        ]
      }
    }

    const avgSuitability = recommendations.reduce((sum, crop) => sum + crop.suitability, 0) / recommendations.length
    const riskScore = Math.round(100 - avgSuitability)
    
    let riskLevel = 'low'
    if (riskScore > 60) riskLevel = 'high'
    else if (riskScore > 40) riskLevel = 'medium'
    
    const riskFactors = []
    
    if (farmData.rainfall === 'Low rainfall' || farmData.temperature === 'Cold') {
      riskFactors.push({
        factor: 'Weather Risk',
        level: farmData.rainfall === 'Low rainfall' ? 'high' : 'medium',
        description: farmData.rainfall === 'Low rainfall' 
          ? 'Low rainfall increases drought risk and irrigation dependency'
          : 'Cold temperatures may affect crop growth and yield',
        mitigation: farmData.rainfall === 'Low rainfall' 
          ? 'Implement water conservation techniques and drought-resistant crops'
          : 'Choose cold-tolerant crop varieties and adjust planting schedule'
      })
    }
    
    if (farmData.waterAvailability === 'Rainfed only' || farmData.waterAvailability === 'Low') {
      riskFactors.push({
        factor: 'Water Scarcity',
        level: farmData.waterAvailability === 'Rainfed only' ? 'high' : 'medium',
        description: farmData.waterAvailability === 'Rainfed only'
          ? 'Complete dependency on rainfall makes farming vulnerable to drought'
          : 'Limited water availability may restrict crop choices and yield',
        mitigation: farmData.waterAvailability === 'Rainfed only'
          ? 'Consider rainwater harvesting and drought-resistant crop varieties'
          : 'Implement efficient irrigation systems like drip irrigation'
      })
    }
    
    if (farmData.soilType === 'Sandy soil' || farmData.soilType === 'Red soil') {
      riskFactors.push({
        factor: 'Soil Limitations',
        level: 'medium',
        description: farmData.soilType === 'Sandy soil'
          ? 'Sandy soil has low water retention and nutrient content'
          : 'Red soil may have lower fertility and water retention',
        mitigation: farmData.soilType === 'Sandy soil'
          ? 'Add organic matter and implement regular fertilization'
          : 'Use soil amendments and proper crop rotation'
      })
    }
    
    if (farmData.budget === 'Low') {
      riskFactors.push({
        factor: 'Budget Constraints',
        level: 'medium',
        description: 'Limited budget may restrict access to quality inputs and technology',
        mitigation: 'Focus on low-cost high-yield crops and government subsidy schemes'
      })
    }
    
    riskFactors.push({
      factor: 'Market Volatility',
      level: 'medium',
      description: 'Crop prices fluctuate based on market demand and supply',
      mitigation: 'Diversify crop portfolio and explore contract farming options'
    })
    
    let recommendation = ''
    if (riskLevel === 'low') {
      recommendation = 'Your farm conditions are favorable for low-risk cultivation. Maintain good agricultural practices and consider crop rotation for sustainability.'
    } else if (riskLevel === 'medium') {
      recommendation = 'Moderate risks identified. Implement mitigation strategies and consider crop diversification to minimize potential losses.'
    } else {
      recommendation = 'High-risk conditions detected. Strongly recommend implementing all mitigation measures and possibly adjusting crop selection or farming practices.'
    }
    
    return {
      level: riskLevel,
      score: riskScore,
      recommendation,
      factors: riskFactors
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await saveFarmData(farmData)
      toast.success(dataExists ? 'Farm data updated successfully!' : 'Farm data saved successfully!')
      setDataExists(true)
    } catch (error) {
      toast.error('Failed to save farm data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-pale">
      <Navbar />

      <main className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-extrabold text-dark mb-2">
              Welcome back, {user?.name || 'Farmer'}! 
            </h1>
            <p className="text-slate-700">
              Manage your farm data and get personalized recommendations
            </p>
          </div>

          {/* Profile Completion Progress */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-display font-bold text-dark">Profile Completion</h2>
              <span className="text-sm font-medium text-slate-600">
                {calculateProfileCompletion()}% Complete
              </span>
            </div>
            <ProgressBar 
              percentage={calculateProfileCompletion()} 
              color={calculateProfileCompletion() >= 80 ? 'success' : calculateProfileCompletion() >= 50 ? 'warning' : 'primary'}
              size="large"
            />
            <p className="text-sm text-slate-600 mt-2">
              {calculateProfileCompletion() >= 80 
                ? 'Great! Your farm profile is nearly complete.'
                : calculateProfileCompletion() >= 50
                ? 'You\'re halfway there! Complete your profile for better recommendations.'
                : 'Complete your farm profile to get personalized recommendations.'}
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {getStatsData().map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>

          {/* Recommendation Systems */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Smart Recommendations Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">?</span>
                <h2 className="text-xl font-display font-bold text-dark">Smart Crop Recommendations</h2>
              </div>
              <p className="text-slate-700 mb-4">
                Get AI-powered crop recommendations based on your farm conditions
              </p>
              <Link
                to="/smart-recommendations"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 transition"
              >
                Get Recommendations
                <span>→</span>
              </Link>
            </div>

            {/* Weather Insights Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🌤️</span>
                <h2 className="text-xl font-display font-bold text-dark">Weather Insights</h2>
              </div>
              <p className="text-slate-700 mb-4">
                Get weather-based farming insights and recommendations
              </p>
              <Link
                to="/weather-insights"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 transition"
              >
                View Weather
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Visual Analytics Section */}
          {dataExists && recommendations && (
            <div className="space-y-8 mb-8">
              {/* Seasonal Calendar */}
              <div>
                <h2 className="text-2xl font-display font-bold text-dark mb-6">Seasonal Planning Calendar</h2>
                <SeasonalCalendar crops={recommendations} currentSeason={farmData.season} farmData={farmData} />
              </div>
            </div>
          )}

          {/* Risk Assessment - Always visible */}
          <div className="mb-8">
            <RiskAssessment risks={getDynamicRiskData().factors} overallRisk={getDynamicRiskData()} />
          </div>

          {/* Farm Data Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-dark">Farm Information</h2>
              <span className="text-sm text-slate-600">
                {dataExists ? 'Data saved' : 'Complete your profile'}
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Land Size */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Land Size (Acres)</label>
                  <input
                    type="text"
                    value={farmData.landSize}
                    onChange={(e) => handleInputChange('landSize', e.target.value)}
                    placeholder="Enter land size in acres"
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                  />
                </div>

                {/* Season */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Season</label>
                  <select
                    value={farmData.season}
                    onChange={(e) => handleInputChange('season', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                    required
                  >
                    <option value="">Select season</option>
                    {seasonOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Soil Type */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Soil Type</label>
                  <select
                    value={farmData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                    required
                  >
                    <option value="">Select soil type</option>
                    {soilTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Water Availability */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Water Availability</label>
                  <select
                    value={farmData.waterAvailability}
                    onChange={(e) => handleInputChange('waterAvailability', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                    required
                  >
                    <option value="">Select water availability</option>
                    {waterOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Budget</label>
                  <select
                    value={farmData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                    required
                  >
                    <option value="">Select budget range</option>
                    {budgetOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Goal */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Farming Goal</label>
                  <select
                    value={farmData.goal}
                    onChange={(e) => handleInputChange('goal', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                    required
                  >
                    <option value="">Select your goal</option>
                    {goalOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Preference */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Farming Preference</label>
                  <select
                    value={farmData.preference}
                    onChange={(e) => handleInputChange('preference', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                    required
                  >
                    <option value="">Select preference</option>
                    {preferenceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Rainfall */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Rainfall Level</label>
                  <select
                    value={farmData.rainfall}
                    onChange={(e) => handleInputChange('rainfall', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                    required
                  >
                    <option value="">Select rainfall level</option>
                    {rainfallOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Temperature</label>
                  <select
                    value={farmData.temperature}
                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                    required
                  >
                    <option value="">Select temperature</option>
                    {temperatureOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Farm Location</label>
                  <input
                    type="text"
                    value={farmData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter your farm location"
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                    required
                  />
                </div>

                {/* Preferred Crop */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Crop (Optional)</label>
                  <select
                    value={farmData.preferredCrop}
                    onChange={(e) => handleInputChange('preferredCrop', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 p-3 focus:outline-none focus:ring-2 focus:ring-primary-pale"
                  >
                    <option value="">Select preferred crop</option>
                    {cropOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : dataExists ? 'Update Data' : 'Save Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

