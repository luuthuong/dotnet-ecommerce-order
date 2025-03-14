import { type NextRequest, NextResponse } from "next/server"
import { cookies as nextCookies } from "next/headers"
import { userStore } from "@/lib/user-store"

export async function PUT(request: NextRequest) {
    const cookies = await nextCookies();
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

        // Update user data
        const body = await request.json()
        const updatedUser = userStore.update(userId, body)

        if (!updatedUser) {
            return NextResponse.json({ message: "Failed to update user" }, { status: 500 })
        }

        // Return updated user data (excluding password)
        const { password, ...userWithoutPassword } = updatedUser
        return NextResponse.json({ user: userWithoutPassword })
    } catch (error) {
        console.error("Update profile error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

