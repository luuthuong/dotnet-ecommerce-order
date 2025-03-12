"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { formatCurrency, generateGUID, generateRandomAddress } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { CreateOrderRequest, OrderItemRequest, AddressRequest } from "@/lib/types"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { createOrder } from "@/lib/api"
import CheckoutResultModal from "@/components/checkout/checkout-result-modal"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [checkoutComplete, setCheckoutComplete] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  const randomAddress = generateRandomAddress();

  const [formData, setFormData] = useState<{
    customerName: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }>({
    customerName: '',
    ...randomAddress
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)
    setCheckoutError(null)

    try {
      const orderItems: OrderItemRequest[] = items.map((item) => ({
        productId: item.productId,
        productName: item.name,
        unitPrice: {
          amount: item.price,
          currency: "USD",
        },
        quantity: item.quantity,
      }))

      const address: AddressRequest = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      }

      const orderRequest: CreateOrderRequest = {
        customerName: formData.customerName,
        address,
        orderItems,
      }

      const response = await createOrder(orderRequest);

      setOrderId(response.data)
      clearCart()
      setCheckoutSuccess(true)
      setCheckoutComplete(true)

    } catch (error) {
      console.error("Error creating order:", error)
      setFormError("There was an error processing your order. Please try again.")
      setCheckoutError(error as string || "There was an error processing your order. Please try again.")
      setCheckoutSuccess(false)
      setCheckoutComplete(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    setCheckoutComplete(false)

    if (checkoutSuccess) {
      router.push("/")
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                    Customer Name
                  </label>
                  <Input
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium mb-1">
                    Street Address
                  </label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">
                      State/Province
                    </label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                      ZIP/Postal Code
                    </label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium mb-1">
                      Country
                    </label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="USA"
                      required
                    />
                  </div>
                </div>
              </CardContent>

              <CardHeader className="pt-0">
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} x {formatCurrency(item.price)}
                          {item.color && ` - ${item.color}`}
                          {item.size && ` - Size ${item.size}`}
                        </div>
                      </div>
                      <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>

              {formError && (
                <CardContent>
                  <div className="bg-red-50 text-red-500 p-3 rounded-md">{formError}</div>
                </CardContent>
              )}

              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/cart")} disabled={isSubmitting}>
                  Back to Cart
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <CheckoutResultModal
        isOpen={checkoutComplete}
        onClose={handleCloseModal}
        success={checkoutSuccess}
        orderId={orderId || undefined}
        errorMessage={checkoutError || undefined}
      />
    </div>
  )
}

