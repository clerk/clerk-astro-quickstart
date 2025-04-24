import { verifyWebhook } from '@clerk/astro/webhooks'
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  try {
    const evt = await verifyWebhook(request, {
      signingSecret: import.meta.env.CLERK_WEBHOOK_SIGNING_SECRET,
    })

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type
    console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
    console.log('Webhook payload:', evt.data)

    return new Response('Webhook received', { status: 200 })
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}
