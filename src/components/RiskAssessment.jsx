import React from 'react'

const RiskAssessment = ({ risks, overallRisk }) => {
  const getRiskColor = (level) => {
    const colors = {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[level] || colors.medium
  }

  const getRiskIcon = (level) => {
    const icons = {
      low: '?',
      medium: '??',
      high: '??'
    }
    return icons[level] || icons.medium
  }

  const getOverallRiskColor = (level) => {
    const colors = {
      low: 'text-green-600 bg-green-50',
      medium: 'text-yellow-600 bg-yellow-50',
      high: 'text-red-600 bg-red-50'
    }
    return colors[level] || colors.medium
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">?</span>
        <h2 className="text-lg font-display font-bold text-dark">Risk Assessment</h2>
      </div>

      {/* Overall Risk Score */}
      <div className={`p-3 rounded-lg border ${getOverallRiskColor(overallRisk.level)} mb-4`}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-base font-bold">Overall Risk</h4>
          <span className="text-xl">{getRiskIcon(overallRisk.level)}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-2xl font-bold mb-1">{overallRisk.score}/100</div>
            <div className="text-xs font-medium uppercase">{overallRisk.level} Risk</div>
          </div>
          <div className="flex-1">
            <div className="text-xs leading-relaxed">{overallRisk.recommendation}</div>
          </div>
        </div>
      </div>

      {/* Individual Risk Factors */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-slate-900 mb-3">Risk Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {risks.map((risk, index) => (
            <div key={index} className={`p-3 rounded-lg border ${getRiskColor(risk.level)}`}>
              <div className="flex items-start gap-2">
                <span className="text-lg mt-1">{getRiskIcon(risk.level)}</span>
                <div className="flex-1">
                  <h5 className="font-semibold mb-1 text-sm">{risk.factor}</h5>
                  <p className="text-xs mb-1">{risk.description}</p>
                  <div className="text-xs font-medium">
                    <span className="opacity-75">Mitigation:</span> {risk.mitigation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RiskAssessment
