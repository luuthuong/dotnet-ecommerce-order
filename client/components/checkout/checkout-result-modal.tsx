"use client"

import Link from "next/link"
import { CheckCircle, XCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"

interface CheckoutResultModalProps {
	isOpen: boolean
	onClose: () => void
	success: boolean
	orderId?: string
	errorMessage?: string
}

export default function CheckoutResultModal({
	isOpen,
	onClose,
	success,
	orderId,
	errorMessage,
}: CheckoutResultModalProps) {
	const displayOrderId = orderId || Math.random().toString(36).substring(2, 10).toUpperCase()
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<div className="flex justify-center mb-4">
						{success ? (
							<CheckCircle className="w-16 h-16 text-green-500" />
						) : (
							<XCircle className="w-16 h-16 text-red-500" />
						)}
					</div>
					<DialogTitle className="text-center">{success ? "Order Successful!" : "Checkout Failed"}</DialogTitle>
					<DialogDescription className="text-center">
						{success
							? "Thank you for your order. We've received your payment and will process your order shortly."
							: "There was a problem processing your order. Please try again."}
					</DialogDescription>
				</DialogHeader>

				{success ? (
					<div className="bg-muted p-4 rounded-md mb-4">
						<div className="flex items-center justify-center gap-2 mb-2">
							<Package className="w-5 h-5" />
							<span className="font-medium">Order #{displayOrderId}</span>
						</div>
						<p className="text-sm text-muted-foreground text-center">You will receive an email confirmation shortly.</p>
					</div>
				) : (
					<div className="bg-red-50 p-4 rounded-md mb-4 text-red-600">
						<p className="text-sm">{errorMessage || "An unexpected error occurred during checkout."}</p>
					</div>
				)}

				<DialogFooter className="flex-col items-center gap-2 sm:flex-col">
					{success ? (
						<>
							<Link href={`/orders/${orderId}`} className="w-full">
								<Button className="w-full" onClick={onClose}>
									View Your Order
								</Button>
							</Link>
							<Link href="/" className="w-full !ml-0">
								<Button className="w-full" variant={'link'} onClick={onClose}>
									Continue Shopping
								</Button>
							</Link>
						</>
					) : (
						<>
							<Button className="w-full" onClick={onClose}>
								Try Again
							</Button>
							<Link href="/" className="w-full">
								<Button className="w-full" onClick={onClose}>
									Continue Shopping
								</Button>
							</Link>
						</>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

