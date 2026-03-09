'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  MapPin, 
  Loader2, 
  BarChart3,
  Droplets,
  Sun,
  Wind,
  Thermometer
} from 'lucide-react'

const crops = [
  'Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 
  'Groundnut', 'Soybean', 'Potato', 'Onion', 'Tomato'
]

const seasons = ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)']

const states = [
  'Andhra Pradesh', 'Bihar', 'Gujarat', 'Haryana', 'Karnataka',
  'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan', 'Tamil Nadu',
  'Uttar Pradesh', 'West Bengal'
]

interface ForecastResult {
  predictedYield: number
  unit: string
  confidence: number
  factors: {
    name: string
    impact: 'positive' | 'negative' | 'neutral'
    value: string
  }[]
  tips: string[]
}

export default function YieldPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ForecastResult | null>(null)
  const [formData, setFormData] = useState({
    crop: '',
    state: '',
    district: '',
    season: '',
    area: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate mock result
    const baseYield = Math.random() * 3 + 2
    setResult({
      predictedYield: parseFloat(baseYield.toFixed(2)),
      unit: 'tonnes/hectare',
      confidence: Math.floor(Math.random() * 15) + 80,
      factors: [
        { name: 'Soil Quality', impact: 'positive', value: 'Good' },
        { name: 'Rainfall', impact: Math.random() > 0.5 ? 'positive' : 'negative', value: Math.random() > 0.5 ? 'Adequate' : 'Below Average' },
        { name: 'Temperature', impact: 'neutral', value: 'Optimal' },
        { name: 'Historical Yield', impact: 'positive', value: 'Above Average' }
      ],
      tips: [
        'Consider using nitrogen-rich fertilizers for better results',
        'Implement drip irrigation to optimize water usage',
        'Monitor for pest infestations during peak growth period',
        'Harvest during optimal moisture content for better quality'
      ]
    })
    
    setIsLoading(false)
  }

  const resetForm = () => {
    setResult(null)
    setFormData({ crop: '', state: '', district: '', season: '', area: '' })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="text-gradient">Yield Forecast</span>
        </h1>
        <p className="text-muted-foreground">
          Predict your crop yield using machine learning based on location, crop type, and season.
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-2xl p-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Crop Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Crop</label>
                <select
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                  required
                >
                  <option value="">Choose a crop</option>
                  {crops.map((crop) => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    required
                  >
                    <option value="">Select state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    placeholder="Enter district name"
                    required
                  />
                </div>
              </div>

              {/* Season and Area */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Season</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    required
                  >
                    <option value="">Select season</option>
                    {seasons.map((season) => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Area (hectares)</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    placeholder="e.g., 5"
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Calculating Forecast...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-5 h-5" />
                    Get Yield Forecast
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Main Result Card */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Predicted Yield for {formData.crop}</div>
                  <div className="text-4xl md:text-5xl font-bold text-gradient">
                    {result.predictedYield} <span className="text-2xl">{result.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="font-medium">{result.confidence}% Confidence</span>
                </div>
              </div>

              {/* Location Info */}
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{formData.district}, {formData.state} | {formData.season} | {formData.area} hectares</span>
              </div>

              {/* Total Expected Yield */}
              <div className="mt-4 p-4 rounded-xl bg-secondary/50">
                <div className="text-sm text-muted-foreground mb-1">Total Expected Yield</div>
                <div className="text-2xl font-bold">
                  {(result.predictedYield * parseFloat(formData.area)).toFixed(2)} tonnes
                </div>
              </div>
            </div>

            {/* Factors Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {result.factors.map((factor, index) => {
                const icons = [Droplets, Sun, Thermometer, Wind]
                const Icon = icons[index % icons.length]
                return (
                  <motion.div
                    key={factor.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      factor.impact === 'positive' 
                        ? 'bg-primary/20 text-primary' 
                        : factor.impact === 'negative'
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-secondary text-muted-foreground'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">{factor.name}</div>
                      <div className="text-sm text-muted-foreground">{factor.value}</div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Tips */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-semibold mb-4">Recommendations for Better Yield</h3>
              <ul className="space-y-3">
                {result.tips.map((tip, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs text-primary font-medium">{index + 1}</span>
                    </div>
                    <span className="text-muted-foreground">{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                Calculate New Forecast
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
