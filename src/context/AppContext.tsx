import React, { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  isAuthenticated: boolean
}

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  notifications: string[]
  addNotification: (message: string) => void
  removeNotification: (index: number) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('contosoUser')
    return savedUser ? JSON.parse(savedUser) : {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      isAuthenticated: true
    }
  })
  
  const [notifications, setNotifications] = useState<string[]>([])

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser)
    if (newUser) {
      localStorage.setItem('contosoUser', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('contosoUser')
    }
  }

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message])
  }

  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  const value = {
    user,
    setUser: handleSetUser,
    notifications,
    addNotification,
    removeNotification,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
