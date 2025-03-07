"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { cancelOrder } from "@/lib/api"

interface CancelOrderModalProps {
  orderId: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const CANCELLATION_REASONS = [
  { id: "changed_mind", label: "Changed my mind" },
  { id: "found_better_price", label: "Found a better price elsewhere" },
  { id: "mistake", label: "Ordered by mistake" },
  { id: "delivery_too_long", label: "Delivery time too long" },
  { id: "other", label: "Other reason" },
]

export default function CancelOrderModal({ orderId, isOpen, onClose, onSuccess }: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("")
  const [otherReason, setOtherReason] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    // Validate input
    if (!selectedReason) {
      setError("Please select a reason for cancellation")
      return
    }

    if (selectedReason === "other" && !otherReason.trim()) {
      setError("Please provide a reason for cancellation")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const reasonText =
        selectedReason === "other"
          ? otherReason
          : CANCELLATION_REASONS.find((r) => r.id === selectedReason)?.label || selectedReason

      const response = await cancelOrder(orderId, { reason: reasonText })

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to cancel order")
      }

      setSelectedReason("")
      setOtherReason("")
      onSuccess()
    } catch (err: any) {
      console.error("Error cancelling order:", err)
      setError(err.message || "An error occurred while cancelling the order")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedReason("")
      setOtherReason("")
      setError(null)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Please provide a reason for cancelling this order. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for cancellation</label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {CANCELLATION_REASONS.map((reason) => (
                  <SelectItem key={reason.id} value={reason.id}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedReason === "other" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Please specify</label>
              <Textarea
                placeholder="Enter your reason for cancellation"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {error && <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">{error}</div>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingSpinner size="small" />
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              "Confirm Cancellation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

