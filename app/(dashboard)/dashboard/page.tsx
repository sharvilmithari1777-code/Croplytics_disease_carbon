'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Scan, 
  TrendingUp, 
  Calculator, 
  ShoppingBag,
  Leaf,
  BarChart3,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { useAuthStore } from '@/lib/store'

const quickActions = [
  {
    href: '/detect',
    icon: Scan,
    title: 'Detect Disease',
    description: 'Upload crop images for instant AI analysis',
    color: 'from-emerald-500/20 to-emerald-600/5'
  },
  {
    href: '/yield',
    icon: TrendingUp,
    title: 'Yield Forecast',
    description: 'Predict crop yields with ML models',
    color: 'from-blue-500/20 to-blue-600/5'
  },
  {
    href: '/carbon',
    icon: Calculator,
    title: 'Carbon Calculator',
    description: 'Calculate your farm\'s carbon footprint',
    color: 'from-amber-500/20 to-amber-600/5'
  },
  {
    href: '/market',
    icon: ShoppingBag,
    title: 'Marketplace',
    description: 'Browse farming supplements and tools',
    color: 'from-rose-500/20 to-rose-600/5'
  }
]

const stats = [
  { label: 'Scans Completed', value: '12', icon: Scan, change: '+3 this week' },
  { label: 'Diseases Detected', value: '4', icon: Leaf, change: 'Early blight detected' },
  { label: 'Yield Forecasts', value: '8', icon: BarChart3, change: 'Wheat, Rice, Maize' },
  { label: 'Carbon Saved', value: '2.4t', icon: Calculator, change: 'CO2 equivalent' }
]

const recentActivity = [
  { action: 'Disease scan completed', crop: 'Tomato', result: 'Late Blight detected', time: '2 hours ago', status: 'warning' },
  { action: 'Yield forecast', crop: 'Wheat', result: '4.2 tonnes/hectare', time: '5 hours ago', status: 'success' },
  { action: 'Disease scan completed', crop: 'Potato', result: 'Healthy', time: '1 day ago', status: 'success' },
  { action: 'Carbon calculation', crop: 'Rice farm', result: '1.2t CO2 saved', time: '2 days ago', status: 'success' }
]

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome back, <span className="text-gradient">{user?.username || 'Farmer'}</span>
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your farm analytics and quick access to all features.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-xs text-primary mt-2">{stat.change}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                href={action.href}
                className="block glass-card rounded-xl p-5 hover:border-primary/30 transition-all group h-full"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="divide-y divide-border">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.status === 'success' ? 'bg-primary/20' : 'bg-amber-500/20'
                }`}>
                  {activity.status === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.crop} - {activity.result}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground hidden sm:block">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
