import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
    <div className="aspect-square overflow-hidden">
      <Image
        src={product.image || "/placeholder.svg?height=300&width=300"}
        alt={product.name}
        width={300}
        height={300}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
      />
    </div>

    <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white">
      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
    </button>

    <div className="p-4">
      <h3 className="font-medium text-lg">{product.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>

      <div className="mt-2 flex items-center gap-1">
        {product.colors.map((color, index) => (
          <div key={index} className="w-4 h-4 rounded-full border" style={{ backgroundColor: color }} />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="font-semibold">${product.price.toFixed(2)}</span>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span className="text-sm">
            {product.rating} ({product.reviewCount})
          </span>
        </div>
      </div>
    </div>

    <Link href={`/products/${product.id}`} className="absolute inset-0">
      <span className="sr-only">View {product.name}</span>
    </Link>
  </div>
  )
}

