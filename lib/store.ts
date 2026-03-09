import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  username: string
  email: string
  phone: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'croplytics-auth',
    }
  )
)

interface DiseaseResult {
  disease: string
  confidence: number
  description: string
  treatment: string[]
  prevention: string[]
  imageUrl?: string
}

interface AppState {
  diseaseResult: DiseaseResult | null
  setDiseaseResult: (result: DiseaseResult | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  diseaseResult: null,
  setDiseaseResult: (result) => set({ diseaseResult: result }),
}))
