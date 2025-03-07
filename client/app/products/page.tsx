"use client"

import { useState, useEffect } from "react"
import ProductGrid from "@/components/products/product-grid"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getProducts } from "@/lib/api-client"
import type { Product } from "@/lib/types"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function Home() {
  const [category, setCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const categoryParam = category !== "all" ? category : undefined
        const response = await getProducts(categoryParam, sortBy)
        setProducts(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, sortBy])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1>Products</h1>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="py-12">
          <LoadingSpinner size="large" />
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}

