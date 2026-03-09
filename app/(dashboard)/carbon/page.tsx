'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Calculator, 
  Loader2, 
  Leaf,
  Droplets,
  Fuel,
  Zap,
  TreePine,
  ArrowDown,
  ArrowUp
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts'

interface CarbonResult {
  totalEmissions: number
  breakdown: { name: string; value: number; color: string }[]
  carbonCredits: number
  comparison: { label: string; value: number }[]
  recommendations: { title: string; savings: number }[]
}

export default function CarbonPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<CarbonResult | null>(null)
  const [formData, setFormData] = useState({
    farmSize: '',
    cropType: '',
    irrigationType: '',
    fertilizerUsage: '',
    fuelConsumption: '',
    electricityUsage: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const farmSize = parseFloat(formData.farmSize) || 1
    const baseEmissions = farmSize * 2.5

    setResult({
      totalEmissions: parseFloat(baseEmissions.toFixed(2)),
      breakdown: [
        { name: 'Fertilizers', value: baseEmissions * 0.35, color: '#10b981' },
        { name: 'Fuel', value: baseEmissions * 0.25, color: '#3b82f6' },
        { name: 'Electricity', value: baseEmissions * 0.20, color: '#f59e0b' },
        { name: 'Irrigation', value: baseEmissions * 0.15, color: '#8b5cf6' },
        { name: 'Other', value: baseEmissions * 0.05, color: '#6b7280' }
      ],
      carbonCredits: parseFloat((farmSize * 0.8).toFixed(2)),
      comparison: [
        { label: 'Your Farm', value: baseEmissions },
        { label: 'Regional Avg', value: baseEmissions * 1.3 },
        { label: 'National Avg', value: baseEmissions * 1.5 }
      ],
      recommendations: [
        { title: 'Switch to drip irrigation', savings: baseEmissions * 0.15 },
        { title: 'Use organic fertilizers', savings: baseEmissions * 0.20 },
        { title: 'Install solar pumps', savings: baseEmissions * 0.18 },
        { title: 'Implement crop rotation', savings: baseEmissions * 0.10 }
      ]
    })
    
    setIsLoading(false)
  }

  const resetForm = () => {
    setResult(null)
    setFormData({
      farmSize: '',
      cropType: '',
      irrigationType: '',
      fertilizerUsage: '',
      fuelConsumption: '',
      electricityUsage: ''
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="text-gradient">Carbon Calculator</span>
        </h1>
        <p className="text-muted-foreground">
          Calculate your farm's carbon footprint and discover ways to reduce emissions.
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Farm Size (hectares)</label>
                  <input
                    type="number"
                    value={formData.farmSize}
                    onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    placeholder="e.g., 10"
                    min="0.1"
                    step="0.1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary Crop</label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    required
                  >
                    <option value="">Select crop</option>
                    <option value="wheat">Wheat</option>
                    <option value="rice">Rice</option>
                    <option value="maize">Maize</option>
                    <option value="cotton">Cotton</option>
                    <option value="sugarcane">Sugarcane</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Irrigation Type</label>
                  <select
                    value={formData.irrigationType}
                    onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    required
                  >
                    <option value="">Select type</option>
                    <option value="flood">Flood Irrigation</option>
                    <option value="drip">Drip Irrigation</option>
                    <option value="sprinkler">Sprinkler System</option>
                    <option value="rainfed">Rain-fed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fertilizer Usage (kg/year)</label>
                  <input
                    type="number"
                    value={formData.fertilizerUsage}
                    onChange={(e) => setFormData({ ...formData, fertilizerUsage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    placeholder="e.g., 500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fuel Consumption (liters/month)</label>
                  <input
                    type="number"
                    value={formData.fuelConsumption}
                    onChange={(e) => setFormData({ ...formData, fuelConsumption: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    placeholder="e.g., 100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Electricity Usage (kWh/month)</label>
                  <input
                    type="number"
                    value={formData.electricityUsage}
                    onChange={(e) => setFormData({ ...formData, electricityUsage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary transition-colors"
                    placeholder="e.g., 200"
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
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="w-5 h-5" />
                    Calculate Carbon Footprint
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
            {/* Main Stats */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                    <ArrowUp className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="text-sm text-muted-foreground">Total Carbon Emissions</div>
                </div>
                <div className="text-4xl font-bold text-destructive">
                  {result.totalEmissions} <span className="text-xl">tonnes CO2/year</span>
                </div>
              </div>
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <TreePine className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">Potential Carbon Credits</div>
                </div>
                <div className="text-4xl font-bold text-primary">
                  {result.carbonCredits} <span className="text-xl">credits</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Emissions Breakdown</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={result.breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {result.breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => `${value.toFixed(2)} tonnes`}
                        contentStyle={{ 
                          background: 'hsl(160, 25%, 8%)', 
                          border: '1px solid hsl(160, 20%, 18%)',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {result.breakdown.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Regional Comparison</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.comparison} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis type="category" dataKey="label" width={100} tick={{ fill: '#94a3b8' }} />
                      <Tooltip 
                        formatter={(value: number) => `${value.toFixed(2)} tonnes`}
                        contentStyle={{ 
                          background: 'hsl(160, 25%, 8%)', 
                          border: '1px solid hsl(160, 20%, 18%)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Your farm emits {((result.comparison[1].value - result.totalEmissions) / result.comparison[1].value * 100).toFixed(0)}% less than the regional average
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Ways to Reduce Your Carbon Footprint
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.recommendations.map((rec, index) => (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl bg-secondary/50 flex items-center justify-between"
                  >
                    <span>{rec.title}</span>
                    <span className="text-primary font-medium flex items-center gap-1">
                      <ArrowDown className="w-4 h-4" />
                      {rec.savings.toFixed(2)}t
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={resetForm}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Calculate Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
