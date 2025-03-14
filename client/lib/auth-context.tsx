"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    address?: {
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    createdAt: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (userData: SignUpData) => Promise<void>
    signOut: () => void
    updateProfile: (userData: Partial<User>) => Promise<void>
}

export interface SignUpData {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await fetch("/api/auth/me",{method: "GET"})
                if (response.ok) {
                    const data = await response.json()
                    setUser(data.user)
                }
            } catch (error) {
                console.error("Failed to fetch user:", error)
            } finally {
                setIsLoading(false)
            }
        }

        checkAuthStatus()
    }, [])

    const signIn = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Failed to sign in")
            }

            const data = await response.json()
            setUser(data.user)
            router.push("/")
        } catch (error) {
            console.error("Sign in error:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const signUp = async (userData: SignUpData) => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Failed to sign up")
            }

            const data = await response.json()
            setUser(data.user)
            router.push("/")
        } catch (error) {
            console.error("Sign up error:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const signOut = async () => {
        try {
            await fetch("/api/auth/signout", {
                method: "POST",
            })
            setUser(null)
            router.push("/signin")
        } catch (error) {
            console.error("Sign out error:", error)
        }
    }

    const updateProfile = async (userData: Partial<User>) => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/auth/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || "Failed to update profile")
            }

            const data = await response.json()
            setUser(data.user)
        } catch (error) {
            console.error("Update profile error:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthContext.Provider
          value= {{
          user,
            isLoading,
            isAuthenticated: !!user,
                signIn,
                signUp,
                signOut,
                updateProfile,
      } 
}
    >
    { children }
    </AuthContext.Provider>
  )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

