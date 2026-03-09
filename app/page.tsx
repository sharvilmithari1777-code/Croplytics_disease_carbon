'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Leaf, Scan, TrendingUp, Calculator, ArrowRight, Shield, Zap, Globe } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <nav className="relative z-10 max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-gradient">Croplytics</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              <span className="text-gradient">AI-Powered</span>
              <br />
              Crop Disease Detection
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              Protect your crops with instant disease identification, yield forecasting, 
              and carbon footprint analysis. Built for modern sustainable farming.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/signup" 
                className="group flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/login" 
                className="px-8 py-4 glass-card rounded-xl text-lg font-semibold hover:bg-secondary/50 transition-colors"
              >
                View Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for <span className="text-gradient">Smart Farming</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of tools helps farmers make data-driven decisions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Scan,
                title: 'Disease Detection',
                description: 'Upload crop images and get instant AI-powered disease identification with treatment recommendations.',
                color: 'text-emerald-400'
              },
              {
                icon: TrendingUp,
                title: 'Yield Forecasting',
                description: 'Predict crop yields based on location, crop type, season, and area with machine learning models.',
                color: 'text-blue-400'
              },
              {
                icon: Calculator,
                title: 'Carbon Calculator',
                description: 'Calculate and track your farm\'s carbon footprint with detailed sustainability metrics.',
                color: 'text-amber-400'
              },
              {
                icon: Shield,
                title: 'Treatment Guides',
                description: 'Get detailed treatment protocols and prevention strategies for identified diseases.',
                color: 'text-rose-400'
              },
              {
                icon: Zap,
                title: 'Real-time Analysis',
                description: 'Fast and accurate results powered by state-of-the-art machine learning algorithms.',
                color: 'text-violet-400'
              },
              {
                icon: Globe,
                title: 'Multi-crop Support',
                description: 'Support for various crops including wheat, rice, cotton, maize, and more.',
                color: 'text-cyan-400'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { value: '10K+', label: 'Farmers Helped' },
                { value: '50+', label: 'Crop Diseases' },
                { value: '95%', label: 'Accuracy Rate' },
                { value: '24/7', label: 'Available' }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of farmers using AI to protect their crops and increase yields.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-semibold">Croplytics</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Made with care for sustainable agriculture
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
