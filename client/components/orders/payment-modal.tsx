"use client"

import { useState } from "react"
import { CreditCard } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { payOrder } from "@/lib/api"
import { generateGUID } from "@/lib/utils"

interface PaymentModalProps {
  orderId: string
  orderTotal: number
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PAYMENT_METHODS = [
  { id: "credit_card", label: "Credit Card" },
  { id: "paypal", label: "PayPal" },
  { id: "bank_transfer", label: "Bank Transfer" },
]

export default function PaymentModal({ orderId, orderTotal, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [cardNumber, setCardNumber] = useState<string>("")
  const [cardName, setCardName] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [cvv, setCvv] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    // Validate input
    if (!paymentMethod) {
      setError("Please select a payment method")
      return
    }

    if (paymentMethod === "credit_card") {
      if (!cardNumber.trim()) {
        setError("Please enter your card number")
        return
      }
      if (!cardName.trim()) {
        setError("Please enter the name on your card")
        return
      }
      if (!expiryDate.trim()) {
        setError("Please enter the expiry date")
        return
      }
      if (!cvv.trim()) {
        setError("Please enter the CVV")
        return
      }
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const transactionId = generateGUID();

      const response = await payOrder(orderId, {
        amount: orderTotal,
        paymentMethod: PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label || paymentMethod,
        transactionId: transactionId,
      })

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to process payment")
      }

      resetForm()
      onSuccess()
    } catch (err: any) {
      console.error("Error processing payment:", err)
      setError(err.message || "An error occurred while processing your payment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setPaymentMethod("")
    setCardNumber("")
    setCardName("")
    setExpiryDate("")
    setCvv("")
    setError(null)
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>Complete your payment for order #{orderId.substring(0, 8)}.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center p-4 bg-muted rounded-md">
            <span className="font-medium">Order Total:</span>
            <span className="text-lg font-bold">${orderTotal.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "credit_card" && (
            <div className="space-y-4 border p-4 rounded-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Card Number</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Name on Card</label>
                <Input placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry Date</label>
                  <Input placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CVV</label>
                  <Input
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    type="password"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="p-4 border rounded-md text-center">
              <p className="text-sm text-muted-foreground mb-2">
                You will be redirected to PayPal to complete your payment.
              </p>
            </div>
          )}

          {paymentMethod === "bank_transfer" && (
            <div className="p-4 border rounded-md">
              <p className="text-sm text-muted-foreground mb-2">
                Please use the following details to make your bank transfer:
              </p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Account Name:</span> E-Commerce Inc.
                </p>
                <p>
                  <span className="font-medium">Account Number:</span> 1234567890
                </p>
                <p>
                  <span className="font-medium">Sort Code:</span> 12-34-56
                </p>
                <p>
                  <span className="font-medium">Reference:</span> ORD-{orderId.substring(0, 8)}
                </p>
              </div>
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
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Pay ${orderTotal.toFixed(2)}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

