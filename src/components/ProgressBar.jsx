import React from 'react'

const ProgressBar = ({ percentage, color = 'primary', size = 'medium', showLabel = true }) => {
  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500'
    }
    return colors[color] || colors.primary
  }

  const getSizeClasses = (size) => {
    const sizes = {
      small: 'h-2',
      medium: 'h-3',
      large: 'h-4'
    }
    return sizes[size] || sizes.medium
  }

  const progressColor = getColorClasses(color)
  const progressSize = getSizeClasses(size)

  return (
    <div className="w-full">
      <div className={`w-full bg-slate-200 rounded-full ${progressSize}`}>
        <div
          className={`${progressColor} ${progressSize} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-sm text-slate-600 mt-1 text-center">
          {percentage}%
        </div>
      )}
    </div>
  )
}

export default ProgressBar
