import type { User } from "./auth-context"
import { v4 as uuidv4 } from "uuid"

// In-memory user store for demo purposes
// In a real app, this would be a database
interface StoredUser extends Omit<User, "address"> {
    password: string
    address: User["address"] | null
}

class UserStore {
    private users: Map<string, StoredUser> = new Map()

    constructor() {
        this.users.set("demo-user-id", {
            id: uuidv4(),
            email: "user@example.com",
            password: "password123",
            firstName: "John",
            lastName: "Doe",
            phone: "555-123-4567",
            address: {
                street: "123 Main St",
                city: "Anytown",
                state: "CA",
                zipCode: "12345",
                country: "USA",
            },
            createdAt: new Date().toISOString(),
        })
    }

    findByEmail(email: string): StoredUser | undefined {
        return Array.from(this.users.values()).find((user) => user.email === email)
    }

    findById(id: string): StoredUser | undefined {
        return this.users.get(id)
    }

    create(user: StoredUser): void {
        this.users.set(user.id, user)
    }

    update(id: string, data: Partial<StoredUser>): StoredUser | undefined {
        const user = this.users.get(id)
        if (!user) return undefined

        const updatedUser = { ...user, ...data }
        this.users.set(id, updatedUser)
        return updatedUser
    }

    delete(id: string): boolean {
        return this.users.delete(id)
    }

    emailExists(email: string): boolean {
        return Array.from(this.users.values()).some((user) => user.email === email)
    }
}

export const userStore = new UserStore()

