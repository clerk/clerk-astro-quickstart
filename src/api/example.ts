import { clerkClient } from '@clerk/astro/server'

export async function GET(context) {
  // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
  // Accessing the `Auth` object differs depending on the SDK you're using
  // https://clerk.com/docs/references/backend/types/auth-object#how-to-access-the-auth-object
  const { isAuthenticated, userId } = context.locals.auth()

  // Protect the route from unauthenticated users
  if (!isAuthenticated) {
    return new Response('Unauthorized', { status: 401 })
  }

  const provider = 'notion'

  // Use the Backend SDK to get the user's OAuth access token
  const clerkResponse = await clerkClient(context).users.getUserOauthAccessToken(userId, provider)

  const accessToken = clerkResponse[0].token || ''

  if (!accessToken) {
    return new Response('Access token not found', { status: 401 })
  }

  // Fetch the user data from the Notion API
  // This endpoint fetches a list of users
  // https://developers.notion.com/reference/get-users
  const notionUrl = 'https://api.notion.com/v1/users'

  const notionResponse = await fetch(notionUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Notion-Version': '2022-06-28',
    },
  })

  // Handle the response from the Notion API
  const notionData = await notionResponse.json()

  return new Response(JSON.stringify({ notionData }))
}
