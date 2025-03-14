import { type NextRequest, NextResponse } from "next/server"
import { cookies as nextCookies } from "next/headers"

export async function POST(request: NextRequest) {
    try {
        const cookies = await nextCookies();
        cookies.delete("session_id")
        cookies.delete("user_id")
        return NextResponse.json({ message: "Signed out successfully" })
    } catch (error) {
        console.error("Signout error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}

