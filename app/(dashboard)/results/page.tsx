'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  CheckCircle2, 
  Pill, 
  Shield, 
  ArrowLeft,
  Scan,
  Download,
  Share2
} from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function ResultsPage() {
  const router = useRouter()
  const diseaseResult = useAppStore((state) => state.diseaseResult)

  useEffect(() => {
    if (!diseaseResult) {
      router.push('/detect')
    }
  }, [diseaseResult, router])

  if (!diseaseResult) return null

  const isHealthy = diseaseResult.disease.toLowerCase().includes('healthy')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        href="/detect"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Detection
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          {diseaseResult.imageUrl && (
            <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden bg-secondary shrink-0">
              <img
                src={diseaseResult.imageUrl}
                alt="Analyzed crop"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Result Summary */}
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isHealthy ? 'bg-primary/20' : 'bg-amber-500/20'
              }`}>
                {isHealthy ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-500" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  {diseaseResult.disease}
                </h1>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isHealthy 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {isHealthy ? 'Healthy' : 'Disease Detected'}
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {diseaseResult.confidence}% confidence
                  </span>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">
              {diseaseResult.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-4">
              <button className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg hover:bg-secondary/50 transition-colors text-sm">
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg hover:bg-secondary/50 transition-colors text-sm">
                <Share2 className="w-4 h-4" />
                Share Results
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confidence Meter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-semibold mb-4">Analysis Confidence</h3>
        <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${diseaseResult.confidence}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full rounded-full ${
              diseaseResult.confidence >= 90 
                ? 'bg-primary' 
                : diseaseResult.confidence >= 70 
                  ? 'bg-amber-500' 
                  : 'bg-destructive'
            }`}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>0%</span>
          <span className="font-medium text-foreground">{diseaseResult.confidence}%</span>
          <span>100%</span>
        </div>
      </motion.div>

      {/* Treatment Section */}
      {!isHealthy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Pill className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg">Recommended Treatment</h3>
          </div>
          <ul className="space-y-3">
            {diseaseResult.treatment.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs text-blue-400 font-medium">{index + 1}</span>
                </div>
                <span className="text-muted-foreground">{item}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Prevention Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">Prevention Tips</h3>
        </div>
        <ul className="space-y-3">
          {diseaseResult.prevention.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-muted-foreground">{item}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Scan Again */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center"
      >
        <Link
          href="/detect"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          <Scan className="w-5 h-5" />
          Scan Another Crop
        </Link>
      </motion.div>
    </div>
  )
}
