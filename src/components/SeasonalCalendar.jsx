import React, { useState } from 'react'

const SeasonalCalendar = ({ crops, currentSeason, farmData }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]
  
  const seasons = {
    Kharif: { months: [6, 7, 8, 9], color: 'green', icon: '?' },
    Rabi: { months: [10, 11, 0, 1], color: 'blue', icon: '?' },
    Summer: { months: [2, 3, 4, 5], color: 'yellow', icon: '?' },
    'Year-round': { months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], color: 'purple', icon: '?' }
  }
  
  const getCropsForMonth = (monthIndex) => {
    if (!crops || crops.length === 0) return []
    
    return crops.filter(crop => {
      const cropSeason = seasons[crop.season]
      return cropSeason && cropSeason.months.includes(monthIndex)
    }).sort((a, b) => b.suitability - a.suitability)
  }
  
  const getSeasonSuitability = (season) => {
    if (!crops || crops.length === 0) return 0
    
    const seasonCrops = crops.filter(crop => crop.season === season)
    if (seasonCrops.length === 0) return 0
    
    const avgSuitability = seasonCrops.reduce((sum, crop) => sum + crop.suitability, 0) / seasonCrops.length
    return Math.round(avgSuitability)
  }
  
  const getSeasonRecommendation = (season) => {
    const seasonCrops = crops.filter(crop => crop.season === season)
    if (seasonCrops.length === 0) return 'No suitable crops for this season'
    
    const bestCrop = seasonCrops.sort((a, b) => b.suitability - a.suitability)[0]
    return `${bestCrop.name} (${bestCrop.suitability}% suitability)`
  }
  
  const getSeasonColor = (season) => {
    const colors = {
      Kharif: 'bg-green-100 text-green-700 border-green-300',
      Rabi: 'bg-blue-100 text-blue-700 border-blue-300',
      Summer: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'Year-round': 'bg-purple-100 text-purple-700 border-purple-300'
    }
    return colors[season] || 'bg-slate-100 text-slate-700 border-slate-300'
  }
  
  const getSuitabilityColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const currentMonthCrops = getCropsForMonth(selectedMonth)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
      {/* Month Selector */}
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
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }
                `}
              >
                {month}
                {hasCrops && (
                  <span className="absolute -bottom-1 text-xs bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {monthCrops.length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Month Crops */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-slate-900 mb-4">
          {months[selectedMonth]} - Recommended Crops
        </h4>
        {currentMonthCrops.length > 0 ? (
          <div className="space-y-3">
            {currentMonthCrops.map((crop, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">?</span>
                  <div>
                    <div className="font-medium text-slate-900">{crop.name}</div>
                    <div className="text-sm text-slate-600">{crop.duration} days</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getSuitabilityColor(crop.suitability)}`}>
                    {crop.suitability}%
                  </div>
                  <div className="text-xs text-slate-500">suitability</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <span className="text-2xl mb-2 block">?</span>
            <p>No suitable crops for {months[selectedMonth]} based on your farm conditions</p>
            {farmData && (
              <div className="text-xs text-slate-600 mt-2">
                <div>Your farm conditions:</div>
                <div>?? Soil: {farmData.soilType}</div>
                <div>?? Water: {farmData.waterAvailability}</div>
                <div>?? Budget: {farmData.budget}</div>
                <div>?? Goal: {farmData.goal}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Season Overview */}
      <div className="border-t border-slate-200 pt-4">
        <h4 className="text-sm font-bold text-slate-700 mb-3">Season Overview</h4>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(seasons).map(([seasonName, seasonData]) => (
            <div key={seasonName} className={`p-3 rounded-lg border ${getSeasonColor(seasonName)}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{seasonData.icon}</span>
                <span className="font-bold">{seasonName}</span>
              </div>
              <div className="text-xs space-y-1">
                <div>Months: {seasonData.months.map(i => months[i]).join(', ')}</div>
                <div>Suitable Crops: {crops.filter(c => c.season === seasonName).length} options</div>
                <div className="font-medium">Avg Suitability: <span className={getSuitabilityColor(getSeasonSuitability(seasonName))}>{getSeasonSuitability(seasonName)}%</span></div>
                <div className="text-xs text-slate-600 mt-1">Best: {getSeasonRecommendation(seasonName)}</div>
                {farmData && farmData.season === seasonName && (
                  <div className="mt-2 p-1 bg-green-100 rounded text-green-800 text-xs font-medium">
                    ? Current Season
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SeasonalCalendar
