
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'

interface LocalUser {
  id: string
  email: string
}

interface AuthContextType {
  user: LocalUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LocalUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Local authentication - check for admin credentials
    if (email === 'hehe@me.pk' && password === 'skibidi.me') {
      const localUser = { id: '1', email }
      setUser(localUser)
      localStorage.setItem('currentUser', JSON.stringify(localUser))
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in as admin."
      })
    } else {
      toast({
        title: "Sign In Failed", 
        description: "Invalid email or password",
        variant: "destructive"
      })
      throw new Error('Invalid credentials')
    }
  }

  const signOut = async () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out."
    })
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
