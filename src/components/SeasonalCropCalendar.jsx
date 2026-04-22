import React, { useState, useEffect } from 'react'
import { getSeasonalCropCalendar } from '../services/api.js'

const SeasonalCropCalendar = ({ location, lat, lon }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [cropData, setCropData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const seasons = {
    Kharif: { months: [6, 7, 8, 9], color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-800' },
    Rabi: { months: [10, 11, 0, 1], color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-800' },
    Summer: { months: [2, 3, 4, 5], color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-800' },
    'Year-round': { months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-800' }
  }

  const getCurrentSeason = () => {
    const currentMonth = new Date().getMonth()
    for (const [seasonName, seasonData] of Object.entries(seasons)) {
      if (seasonData.months.includes(currentMonth)) {
        return seasonName
      }
    }
    return 'Kharif'
  }

  const fetchSeasonalCropData = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getSeasonalCropCalendar(location)
      
      if (response.success && response.data) {
        setCropData(response.data)
      } else {
        throw new Error(response.error || 'Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching seasonal crop data:', err)
      setError('Failed to load crop data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (location) {
      fetchSeasonalCropData()
    }
  }, [location])

  const getCropsForMonth = (monthIndex) => {
    if (!cropData) return []
    
    const crops = []
    for (const [seasonName, seasonData] of Object.entries(seasons)) {
      if (seasonData.months.includes(monthIndex)) {
        const seasonCrops = cropData.seasons[seasonName]?.crops || []
        crops.push(...seasonCrops)
      }
    }
    return crops
  }

  const getSuitabilityColor = (score) => {
    return score >= 80 ? 'text-green-600' : 'text-orange-500'
  }

  const getSeasonStats = (seasonName) => {
    const seasonCrops = cropData?.seasons[seasonName]?.crops || []
    if (seasonCrops.length === 0) {
      return { count: 0, avgSuitability: 0, bestCrop: 'None' }
    }
    
    const avgSuitability = Math.round(
      seasonCrops.reduce((sum, crop) => sum + crop.suitability, 0) / seasonCrops.length
    )
    const bestCrop = seasonCrops.reduce((best, crop) => 
      crop.suitability > best.suitability ? crop : best
    , seasonCrops[0])
    
    return { count: seasonCrops.length, avgSuitability, bestCrop: bestCrop.name }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="flex space-x-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-200 rounded flex-1"></div>
            ))}
          </div>
          <div className="h-40 bg-slate-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
        <div className="text-center py-8">
          <span className="text-4xl mb-4 block">?</span>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    )
  }

  const currentSeason = getCurrentSeason()
  const currentMonthCrops = getCropsForMonth(selectedMonth)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      {/* Month Selector Strip */}
      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {months.map((month, index) => {
            const monthCrops = getCropsForMonth(index)
            const hasCrops = monthCrops.length > 0
            const isSelected = index === selectedMonth
            
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(index)}
                className={`
                  relative flex flex-col items-center px-3 py-2 rounded-lg font-medium text-sm transition-all
                  ${isSelected 
                    ? 'bg-green-600 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }
                `}
              >
                {month}
                {hasCrops && (
                  <span className="absolute -bottom-1 text-xs bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {monthCrops.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Month Panel */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 mb-4">
          {months[selectedMonth]} - Recommended Crops
        </h3>
        {currentMonthCrops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentMonthCrops.map((crop, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{crop.emoji}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{crop.name}</h4>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div>Duration: {crop.duration} days</div>
                      <div>Yield: {crop.yield} tons/ha</div>
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${getSuitabilityColor(crop.suitability)}`}>
                    {crop.suitability}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <span className="text-3xl mb-2 block">??</span>
            <p>No recommended crops for {months[selectedMonth]}</p>
          </div>
        )}
      </div>

      {/* Season Overview Grid */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4">Season Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(seasons).map(([seasonName, seasonData]) => {
            const stats = getSeasonStats(seasonName)
            const isCurrentSeason = seasonName === currentSeason
            const seasonStyle = seasonData
            
            return (
              <div 
                key={seasonName}
                className={`
                  ${seasonStyle.bgColor} ${seasonStyle.borderColor} border rounded-xl p-4 relative
                  ${isCurrentSeason ? 'ring-2 ring-green-400 ring-offset-2' : ''}
                `}
              >
                {isCurrentSeason && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Current Season
                  </div>
                )}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-lg font-bold ${seasonStyle.textColor}`}>{seasonName}</span>
                </div>
                <div className="text-sm space-y-1">
                  <div className="text-slate-600">
                    Months: {seasonData.months.map(i => months[i]).join(', ')}
                  </div>
                  <div className="text-slate-700">
                    <span className="font-medium">Suitable Crops:</span> {stats.count}
                  </div>
                  <div className="text-slate-700">
                    <span className="font-medium">Avg Suitability:</span> 
                    <span className={`ml-1 ${getSuitabilityColor(stats.avgSuitability)}`}>
                      {stats.avgSuitability}%
                    </span>
                  </div>
                  <div className="text-slate-700">
                    <span className="font-medium">Best Crop:</span> {stats.bestCrop}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SeasonalCropCalendar
