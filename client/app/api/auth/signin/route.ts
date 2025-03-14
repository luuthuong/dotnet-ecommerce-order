import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { cookies as nextCookies } from "next/headers"
import { userStore } from "@/lib/user-store"

export async function POST(request: NextRequest) {
    const cookies = await nextCookies()

    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
        }

        const user = userStore.findByEmail(email)

        if (!user || user.password !== password) {
            return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
        }

        console.log("User signed in:", user)

        const sessionId = uuidv4()
        cookies.set("session_id", sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })

        cookies.set("user_id", user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        })
        const { password: _, ...userWithoutPassword } = user
        return NextResponse.json({ user: userWithoutPassword })
    } catch (error) {
        console.error("Signin error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

