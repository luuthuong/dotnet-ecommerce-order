import { type NextRequest, NextResponse } from "next/server"
import type { Product } from "@/lib/types"
import { dataStore } from "@/lib/data-store"

// Use the shared data store
const products = dataStore.products

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const sortBy = searchParams.get("sortBy")

    // Filter products
    let filteredProducts = [...products]
    if (category && category !== "all") {
      // This is a simplified example - in a real app, products would have categories
      // For demo purposes, let's map colors to categories
      const categoryMap: Record<string, string[]> = {
        clothing: ["red", "green", "gray"],
        accessories: ["blue", "orange", "yellow"],
        equipment: ["black", "pink", "brown", "purple"],
      }

      filteredProducts = filteredProducts.filter((product) =>
        product.colors.some((color) => categoryMap[category]?.includes(color)),
      )
    }

    // Sort products
    if (sortBy) {
      filteredProducts.sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "rating":
            return b.rating - a.rating
          case "newest":
          default:
            // For demo purposes, we'll use the product ID as a proxy for "newness"
            return Number.parseInt(b.id) - Number.parseInt(a.id)
        }
      })
    }

    return NextResponse.json(
      {
        isSuccess: true,
        message: null,
        data: filteredProducts,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to fetch products",
        data: null,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.price) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Name and price are required",
          data: null,
        },
        { status: 400 },
      )
    }

    // Create new product
    const newProduct: Product = {
      id: (products.length + 1).toString(),
      name: body.name,
      description: body.description || "",
      price: body.price,
      image: body.image || "/placeholder.svg?height=300&width=300",
      colors: body.colors || ["black"],
      sizes: body.sizes || undefined,
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      inStock: body.inStock !== undefined ? body.inStock : true,
    }

    products.push(newProduct)

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to create product",
        data: null,
      },
      { status: 500 },
    )
  }
}

