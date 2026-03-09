'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  X,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { diseaseDatabase, getRandomDisease } from '@/lib/diseases'

export default function DetectPage() {
  const router = useRouter()
  const setDiseaseResult = useAppStore((state) => state.setDiseaseResult)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)

  const analysisSteps = [
    'Uploading image...',
    'Preprocessing image...',
    'Running AI model...',
    'Analyzing results...',
    'Generating report...'
  ]

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setPreview(null)
  }

  const analyzeImage = async () => {
    setIsAnalyzing(true)
    
    // Simulate analysis steps
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i)
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    // Get a random disease for demo
    const diseaseKey = getRandomDisease()
    const disease = diseaseDatabase[diseaseKey]
    
    setDiseaseResult({
      disease: disease.name,
      confidence: Math.floor(Math.random() * 15) + 85,
      description: disease.description,
      treatment: disease.treatment,
      prevention: disease.prevention,
      imageUrl: preview || undefined
    })

    router.push('/results')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="text-gradient">Disease Detection</span>
        </h1>
        <p className="text-muted-foreground">
          Upload a clear image of your crop leaf or plant to detect potential diseases.
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-xl p-4 flex items-start gap-3"
      >
        <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
        <div className="text-sm text-muted-foreground">
          For best results, ensure the image is well-lit, in focus, and shows the affected 
          area clearly. Our AI can detect over 50 different crop diseases across various plants.
        </div>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-2xl p-6"
      >
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <label
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                  relative flex flex-col items-center justify-center p-12 
                  border-2 border-dashed rounded-xl cursor-pointer
                  transition-all duration-300
                  ${isDragging 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50 hover:bg-secondary/30'
                  }
                `}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className={`
                  w-20 h-20 rounded-full flex items-center justify-center mb-4
                  transition-colors duration-300
                  ${isDragging ? 'bg-primary/20' : 'bg-secondary'}
                `}>
                  <Upload className={`w-10 h-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {isDragging ? 'Drop your image here' : 'Upload Crop Image'}
                </h3>
                <p className="text-muted-foreground text-sm text-center">
                  Drag and drop or click to browse
                  <br />
                  <span className="text-xs">Supports JPG, PNG, WebP (max 10MB)</span>
                </p>
              </label>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Image Preview */}
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden bg-secondary aspect-video flex items-center justify-center">
                  <img
                    src={preview}
                    alt="Crop preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                {!isAnalyzing && (
                  <button
                    onClick={clearImage}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-destructive/20 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Analysis Progress */}
              {isAnalyzing ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <span className="font-medium">{analysisSteps[analysisStep]}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }}
                      className="h-full bg-primary rounded-full"
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex gap-2">
                    {analysisSteps.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i <= analysisStep ? 'bg-primary' : 'bg-secondary'
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={analyzeImage}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Scan className="w-5 h-5" />
                    Analyze Image
                  </button>
                  <button
                    onClick={clearImage}
                    className="flex items-center justify-center gap-2 px-6 py-3 glass-card rounded-xl font-semibold hover:bg-secondary/50 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Choose Different Image
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Supported Crops */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-xl p-6"
      >
        <h3 className="font-semibold mb-4">Supported Crops</h3>
        <div className="flex flex-wrap gap-2">
          {['Apple', 'Tomato', 'Potato', 'Corn', 'Grape', 'Pepper', 'Strawberry', 'Cherry', 'Peach', 'Wheat', 'Rice', 'Cotton'].map((crop) => (
            <span
              key={crop}
              className="px-3 py-1.5 rounded-full bg-secondary text-sm text-muted-foreground"
            >
              {crop}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
