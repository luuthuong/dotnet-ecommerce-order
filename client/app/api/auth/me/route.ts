import { type NextRequest, NextResponse } from "next/server"
import { cookies as nextCookies } from "next/headers"
import { userStore } from "@/lib/user-store"

export async function GET(request: NextRequest) {
    const cookies = await nextCookies()
    try {
        // Get user ID from session
        const userId = cookies.get("user_id")?.value

        if (!userId) {
            return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
        }

        // Get user from database
        const user = userStore.findById(userId)

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        // Return user data (excluding password)
        const { password, ...userWithoutPassword } = user
        return NextResponse.json({ user: userWithoutPassword })
    } catch (error) {
        console.error("Get user error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

