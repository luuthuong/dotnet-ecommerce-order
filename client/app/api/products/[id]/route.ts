import { type NextRequest, NextResponse } from "next/server"
import { dataStore, findProductById } from "@/lib/data-store"
import { PromiseParams } from "@/lib/types"

// Use the shared data store
const products = dataStore.products

export async function GET(request: NextRequest, { params }: PromiseParams<{ id: string }>) {
  try {
    const { id } = await params;
    const product = findProductById(id)

    if (!product) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Product not found",
          data: null,
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        isSuccess: true,
        message: null,
        data: product,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to fetch product",
        data: null,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: PromiseParams<{ id: string }>) {
  try {
    const { id } = await params;
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Product not found",
          data: null,
        },
        { status: 404 },
      )
    }

    const body = await request.json()
    const updatedProduct = {
      ...products[productIndex],
      ...body,
      id: id, // Ensure ID doesn't change
    }

    products[productIndex] = updatedProduct

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Product updated successfully",
        data: updatedProduct,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to update product",
        data: null,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: PromiseParams<{ id: string }>) {
  try {
    const productIndex = products.findIndex((p) => p.id === id)

    if (productIndex === -1) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Product not found",
          data: null,
        },
        { status: 404 },
      )
    }

    const deletedProduct = products[productIndex]
    dataStore.products = products.filter((p) => p.id !== id)

    return NextResponse.json(
      {
        isSuccess: true,
        message: "Product deleted successfully",
        data: deletedProduct,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Failed to delete product",
        data: null,
      },
      { status: 500 },
    )
  }
}

