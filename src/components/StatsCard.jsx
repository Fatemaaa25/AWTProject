import React from 'react'

const StatsCard = ({ title, value, subtitle, icon, color = 'primary', trend = 0 }) => {
  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary text-white',
      success: 'bg-green-500 text-white',
      warning: 'bg-yellow-500 text-white',
      danger: 'bg-red-500 text-white'
    }
    return colors[color] || colors.primary
  }

  const getTrendIcon = (trend) => {
    if (trend > 0) return '??'
    if (trend < 0) return '??'
    return '??'
  }

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-slate-500'
  }

  const iconColor = getColorClasses(color)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${iconColor} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(trend)}`}>
            <span>{getTrendIcon(trend)}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>
    </div>
  )
}

export default StatsCard
