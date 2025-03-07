"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { OrderDto } from "@/lib/types"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { getOrderById, setShippingAddress } from "@/lib/api"

interface UpdateOrderModalProps {
  orderId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function UpdateOrderModal({ orderId, isOpen, onClose, onSuccess }: UpdateOrderModalProps) {
  const [order, setOrder] = useState<OrderDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for shipping address fields
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  // Fetch order details when modal opens
  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails()
    }
  }, [isOpen, orderId])

  const fetchOrderDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getOrderById(orderId)

      if (!response.isSuccess || !response.data) {
        throw new Error(response.message || "Failed to fetch order details")
      }

      setOrder(response.data)

      const {shippingAddress} = response.data;

      setAddressForm(
        {
          street: shippingAddress.street ?? '',
          city: shippingAddress.city ?? '',
          country: shippingAddress.country ?? '',
          state: shippingAddress.state ?? '',
          zipCode: shippingAddress.zipCode ?? ''
        }
      )
    } catch (err: any) {
      console.error("Error fetching order details:", err)
      setError(err.message || "An error occurred while fetching order details")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddressForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      if (!addressForm.street.trim()) {
        setError("Street address is required")
        return
      }

      if (!addressForm.city.trim()) {
        setError("City is required")
        return
      }

      if (!addressForm.state.trim()) {
        setError("State/Province is required")
        return
      }

      if (!addressForm.zipCode.trim()) {
        setError("ZIP/Postal code is required")
        return
      }

      if (!addressForm.country.trim()) {
        setError("Country is required")
        return
      }

      if (JSON.stringify(addressForm) === JSON.stringify(order?.shippingAddress)) {
        setError("No changes were made to the shipping address")
        return
      }

      setIsSubmitting(true)
      setError(null)

      const response = await setShippingAddress(orderId, {
        city: addressForm.city,
        country: addressForm.country,
        state: addressForm.state,
        street: addressForm.street,
        zipCode: addressForm.zipCode
      })

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to update shipping address")
      }

      onSuccess()
    } catch (err: any) {
      console.error("Error updating shipping address:", err)
      setError(err.message || "An error occurred while updating the shipping address")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Shipping Address</DialogTitle>
          <DialogDescription>Update the shipping address for order #{orderId.substring(0, 8)}.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : error && !order ? (
          <div className="py-4 text-red-500">{error}</div>
        ) : order ? (
          <div className="py-4 space-y-4">
            <div>
              <label htmlFor="street" className="block text-sm font-medium mb-1">
                Street Address
              </label>
              <Input
                id="street"
                name="street"
                value={addressForm.street}
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
                  value={addressForm.city}
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
                  value={addressForm.state}
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
                  value={addressForm.zipCode}
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
                  value={addressForm.country}
                  onChange={handleInputChange}
                  placeholder="USA"
                  required
                />
              </div>
            </div>

            {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">{error}</div>}
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || isSubmitting || !order}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Saving...</span>
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

