import {
  Button,
  Divider,
  Grid,
  Input,
  Loading,
  Modal,
  Spacer,
  Text,
  Textarea,
} from "@nextui-org/react"
import React, { FormEvent, useState } from "react"

import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import paymentMutation from "../../mutations/stripe"
import { useMutation } from "blitz"

const stripePromise = loadStripe(
  "pk_test_51Gw3jiEnwVW1SW8rR9VYXHPlv1tWEgIjN4mmhfNuFCxmgJAzneWbogpRPKClwx7DNs07t0leALf7HLkshykGHjvs00LXsl7q3Q"
)

interface Props {
  total: number
  handleClose?: () => void
  isOpen?: boolean
  onSuccess?: (data: {
    address: string
    serviceDateTime: string
    timeSlot: string
    paymentMethod: string
    paymentId: string
  }) => void
}

export const BookingForm = ({ total, handleClose, onSuccess }: Props) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processPayment, { isLoading }] = useMutation(paymentMutation)

  const [date, setDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    return tomorrow.toISOString().split("T")[0] || ""
  })
  const [selectedSlot, setSelectedSlot] = useState("09:00 AM - 11:00 AM")
  const [address, setAddress] = useState("Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103")
  const [paymentMethod, setPaymentMethod] = useState<"PAY_AFTER_SERVICE" | "ONLINE">("PAY_AFTER_SERVICE")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const timeSlots = [
    { label: "09:00 AM - 11:00 AM", period: "Morning" },
    { label: "01:00 PM - 03:00 PM", period: "Afternoon" },
    { label: "05:00 PM - 07:00 PM", period: "Evening" },
  ]

  const handleBookingSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!address || !date || !selectedSlot) return

    if (paymentMethod === "PAY_AFTER_SERVICE") {
      setIsSubmitting(true)
      onSuccess &&
        onSuccess({
          address,
          serviceDateTime: `${date}T09:00:00`,
          timeSlot: selectedSlot,
          paymentMethod: "PAY_AFTER_SERVICE",
          paymentId: "CASH_ON_DELIVERY",
        })
      setIsSubmitting(false)
      handleClose && handleClose()
      return
    }

    // Stripe Online Payment
    if (!stripe || !elements) return
    const cardElement = elements.getElement(CardElement)
    if (!cardElement) return

    setIsSubmitting(true)
    const { token } = await stripe.createToken(cardElement)
    if (token) {
      await processPayment(
        { total, token: token.id },
        {
          onSuccess(data) {
            onSuccess &&
              onSuccess({
                address,
                serviceDateTime: `${date}T09:00:00`,
                timeSlot: selectedSlot,
                paymentMethod: "ONLINE",
                paymentId: data?.id || "",
              })
            setIsSubmitting(false)
            handleClose && handleClose()
          },
          onError() {
            setIsSubmitting(false)
          },
        }
      )
    } else {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Modal.Header css={{ pb: 0 }}>
        <div style={{ textAlign: "left", width: "100%" }}>
          <Text h3 css={{ m: 0 }}>
            Schedule & Book Service
          </Text>
          <Text css={{ color: "$accents7", fontSize: "$xs" }}>
            Urban Company Verified • 30-Day Re-work Guarantee
          </Text>
        </div>
      </Modal.Header>
      <Modal.Body css={{ py: "$6" }}>
        <form onSubmit={handleBookingSubmit}>
          {/* Service Date */}
          <Text b css={{ fontSize: "$sm", mb: "$2", display: "block" }}>
            1. Select Service Date
          </Text>
          <Input
            type="date"
            fullWidth
            bordered
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Spacer y={1} />

          {/* Time Slot Selection */}
          <Text b css={{ fontSize: "$sm", mb: "$2", display: "block" }}>
            2. Choose Time Window
          </Text>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {timeSlots.map((slot) => (
              <Button
                key={slot.label}
                type="button"
                size="sm"
                auto
                bordered={selectedSlot !== slot.label}
                color={selectedSlot === slot.label ? "primary" : "default"}
                onClick={() => setSelectedSlot(slot.label)}
              >
                {slot.label}
              </Button>
            ))}
          </div>

          <Spacer y={1} />

          {/* Service Address */}
          <Text b css={{ fontSize: "$sm", mb: "$2", display: "block" }}>
            3. Doorstep Service Address
          </Text>
          <Textarea
            fullWidth
            bordered
            rows={2}
            value={address}
            placeholder="House/Flat No, Apartment, Street, Landmark, City & Pincode"
            onChange={(e) => setAddress(e.target.value)}
          />

          <Spacer y={1} />

          {/* Payment Method Toggle */}
          <Text b css={{ fontSize: "$sm", mb: "$2", display: "block" }}>
            4. Payment Option
          </Text>
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <Button
              type="button"
              size="sm"
              bordered={paymentMethod !== "PAY_AFTER_SERVICE"}
              color={paymentMethod === "PAY_AFTER_SERVICE" ? "success" : "default"}
              onClick={() => setPaymentMethod("PAY_AFTER_SERVICE")}
            >
              💵 Pay After Service (Recommended)
            </Button>
            <Button
              type="button"
              size="sm"
              bordered={paymentMethod !== "ONLINE"}
              color={paymentMethod === "ONLINE" ? "success" : "default"}
              onClick={() => setPaymentMethod("ONLINE")}
            >
              💳 Pay Online (Card)
            </Button>
          </div>

          {paymentMethod === "ONLINE" && (
            <div style={{ padding: "12px", border: "1px solid #444", borderRadius: "8px", marginBottom: "12px" }}>
              <Text css={{ fontSize: "$xs", color: "$accents6", mb: "$2" }}>
                Enter test card credentials:
              </Text>
              <CardElement
                options={{
                  hidePostalCode: true,
                  style: {
                    base: { color: "#fff" },
                  },
                }}
              />
            </div>
          )}

          {/* Summary */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid #333" }}>
            <div>
              <Text css={{ color: "$accents7", fontSize: "$xs" }}>Total Payable</Text>
              <Text b css={{ fontSize: "$xl" }}>₹{total}</Text>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <Button auto flat color="error" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                auto
                color="primary"
                type="submit"
                disabled={isSubmitting || isLoading || !address || !date}
              >
                {isSubmitting || isLoading ? (
                  <Loading color="currentColor" size="sm" />
                ) : (
                  `Confirm Booking (₹${total})`
                )}
              </Button>
            </div>
          </div>
        </form>
      </Modal.Body>
    </>
  )
}

export const PaymentModal = ({ total, handleClose, isOpen, onSuccess }: Props) => {
  return (
    <Modal open={isOpen} onClose={handleClose} width="520px">
      <Elements stripe={stripePromise}>
        <BookingForm total={total} handleClose={handleClose} onSuccess={onSuccess} />
      </Elements>
    </Modal>
  )
}
