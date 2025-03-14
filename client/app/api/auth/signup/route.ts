import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { cookies as nextCookies } from "next/headers"
import { userStore } from "@/lib/user-store"

export async function POST(request: NextRequest) {
    const cookies = await nextCookies();

    try {
        const body = await request.json()
        const { email, password, firstName, lastName, phone } = body

        // Validate input
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
        }

        // Check if user already exists
        if (userStore.emailExists(email)) {
            return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
        }

        // Create new user
        const userId = uuidv4()
        const newUser = {
            id: userId,
            email,
            firstName,
            lastName,
            phone: phone || null,
            address: null,
            createdAt: new Date().toISOString(),
            password, // In a real app, you would hash the password
        }

        // Store user
        userStore.create(newUser)

        // Create session
        const sessionId = uuidv4()
        cookies.set("session_id", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })

        // Store session (in a real app, this would be in a database)
        cookies.set("user_id", userId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })

        // Return user data (excluding password)
        const { password: _, ...userWithoutPassword } = newUser
        return NextResponse.json({ user: userWithoutPassword })
    } catch (error) {
        console.error("Signup error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

