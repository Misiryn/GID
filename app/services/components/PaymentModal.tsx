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
  onSuccess?: (data: { address: string; serviceDateTime: string; paymentId: string }) => void
}

export const StripeForm = ({ total, handleClose, isOpen, onSuccess }: Props) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processPayment, { isLoading }] = useMutation(paymentMutation)

  const [dateTime, setDateTime] = useState("")
  const [address, setAddress] = useState("")

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      return
    }

    // Use your card Element with other Stripe.js APIs
    const { error, token } = await stripe.createToken(cardElement)
    if (token) {
      await processPayment(
        { total, token: token.id },
        {
          onSuccess(data, variables, context) {
            onSuccess &&
              onSuccess({ address, serviceDateTime: dateTime, paymentId: data?.id || "" })
            handleClose && handleClose()
          },
        }
      )
    }
  }
  return (
    <>
      <Modal.Header>
        <Text>Complete Payment</Text>
      </Modal.Header>
      <Modal.Body>
        <Input
          type="datetime-local"
          name="serviceDateTime"
          label="Service Date Time"
          placeholder="Service Date Time"
          bordered
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
        />
        <Textarea
          bordered
          name="address"
          label="Address"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Text margin="$8 0">Total : {total}</Text>

        <form onSubmit={handleSubmit}>
          <div style={{ ...(!(address && dateTime) && { pointerEvents: "none", opacity: 0.5 }) }}>
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    color: "#fff",
                  },
                  complete: { backgroundColor: "#32325d", padding: "2rem" },
                },
              }}
            />
          </div>
          <Spacer y={1} />
          <Divider />
          <Spacer y={1} />
          <Grid.Container gap={1}>
            <Grid>
              <Button
                auto
                flat
                color="error"
                type="button"
                disabled={isLoading}
                onClick={handleClose}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                auto
                type="submit"
                disabled={isLoading}
                style={{ ...(!(address && dateTime) && { pointerEvents: "none", opacity: 0.5 }) }}
              >
                {isLoading ? <Loading color="currentColor" size="sm" /> : `Pay Now ₹ ${total}`}
              </Button>
            </Grid>
          </Grid.Container>
        </form>
      </Modal.Body>
    </>
  )
}

export const PaymentModal = ({ total, handleClose, isOpen, onSuccess }: Props) => {
  return (
    <Modal open={isOpen} onClose={handleClose} preventClose>
      <Elements stripe={stripePromise}>
        <StripeForm total={total} handleClose={handleClose} onSuccess={onSuccess} />
      </Elements>
    </Modal>
  )
}
