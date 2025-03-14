'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Minus, Plus, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import { getProductById } from "@/lib/api-client"
import type { Product } from "@/lib/types"
import LoadingSpinner from "@/components/ui/loading-spinner"

type ProductPageClientProps = {
  id: string;
}

export default function ProductPageClient({ id: productId }: ProductPageClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true)
        const response = await getProductById(productId)
        setProduct(response.data)

        if (response.data.colors?.length > 0) {
          setSelectedColor(response.data.colors[0])
        }
        
        if (response?.data?.sizes?.length) {
          setSelectedSize(response.data.sizes[0])
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity, selectedColor, selectedSize)
      router.push("/cart")
    }
  }

  if (loading) {
    return (
      <div className="py-12">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">{error || "Product not found"}</p>
        <Link href="/" className="hover:underline hover:!text-black">
          <Button className="mt-4">Back to Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="aspect-square relative overflow-hidden rounded-lg border h-full">
        <Image
          src={product.image || "/placeholder.svg?height=600&width=600"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <Link href="/" className="text-sm text-muted-foreground hover:underline hover:text-black">
              ← Back to products
            </Link>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-yellow-500">★</span>
              <span>
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold">${product.price.toFixed(2)}</h2>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {product.sizes && (
            <div>
              <h3 className="text-lg font-medium mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize == size ? "secondary" : "default"}
                    onClick={() => {
                      console.log('select size', size)
                      setSelectedSize(size)
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? "border" : "border-muted"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button variant="default" size="icon" onClick={decrementQuantity}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-16 text-center">{quantity}</span>
              <Button variant="default" size="icon" onClick={incrementQuantity}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full" size="lg" variant={'default'} onClick={handleAddToCart}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}