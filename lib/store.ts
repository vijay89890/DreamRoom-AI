import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  subscription: 'free' | 'premium' | 'pro'
}

interface Design {
  id: string
  title: string
  description: string
  thumbnail: string
  status: 'in_progress' | 'completed'
  isPublic: boolean
  roomType: string
  createdAt: string
  updatedAt: string
  designState: any // 3D scene state
}

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  
  // Design state
  designs: Design[]
  currentDesign: Design | null
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setDesigns: (designs: Design[]) => void
  addDesign: (design: Design) => void
  updateDesign: (id: string, updates: Partial<Design>) => void
  deleteDesign: (id: string) => void
  setCurrentDesign: (design: Design | null) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  
  // Utilities
  reset: () => void
}

const initialState = {
  user: null,
  isAuthenticated: false,
  designs: [],
  currentDesign: null,
  isLoading: false,
  error: null,
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setUser: (user) => {
        console.log('Setting user:', user)
        set({ user, isAuthenticated: !!user })
      },
      
      setAuthenticated: (isAuthenticated) => {
        console.log('Setting authenticated:', isAuthenticated)
        set({ isAuthenticated })
      },
      
      setDesigns: (designs) => {
        console.log('Setting designs:', designs.length)
        set({ designs })
      },
      
      addDesign: (design) => {
        console.log('Adding design:', design.id)
        set((state) => ({
          designs: [design, ...state.designs]
        }))
      },
      
      updateDesign: (id, updates) => {
        console.log('Updating design:', id, updates)
        set((state) => ({
          designs: state.designs.map(d => 
            d.id === id ? { ...d, ...updates } : d
          )
        }))
      },
      
      deleteDesign: (id) => {
        console.log('Deleting design:', id)
        set((state) => ({
          designs: state.designs.filter(d => d.id !== id)
        }))
      },
      
      setCurrentDesign: (design) => {
        console.log('Setting current design:', design?.id)
        set({ currentDesign: design })
      },
      
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      reset: () => {
        console.log('Resetting app state')
        set(initialState)
      },
    }),
    {
      name: 'dreamroom-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        designs: state.designs,
      }),
    }
  )
)

// Selectors for better performance
export const useAuth = () => useAppStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  setUser: state.setUser,
  setAuthenticated: state.setAuthenticated,
}))

export const useDesigns = () => useAppStore((state) => ({
  designs: state.designs,
  currentDesign: state.currentDesign,
  setDesigns: state.setDesigns,
  addDesign: state.addDesign,
  updateDesign: state.updateDesign,
  deleteDesign: state.deleteDesign,
  setCurrentDesign: state.setCurrentDesign,
}))

export const useUI = () => useAppStore((state) => ({
  isLoading: state.isLoading,
  error: state.error,
  setLoading: state.setLoading,
  setError: state.setError,
}))