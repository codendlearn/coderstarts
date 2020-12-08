import { CommunicationIdentityClient } from '@azure/communication-administration'

export const getUser = async () => {
  const connectionString =
    'endpoint=https://collab.communication.azure.com/;accesskey=t1+/KGvOym8MN7UlznHpvBN518M+EYEDDHWEczHSqBPTlpvIaiaJnxI1sA/gSMXpctw+kDC3oHdi6amy3eM4VQ=='
  const identityClient = new CommunicationIdentityClient(connectionString)
  let identityResponse = await identityClient.createUser()
  console.log(
    `\nCreated an identity with ID: ${identityResponse.communicationUserId}`
  )
  let tokenResponse = await identityClient.issueToken(identityResponse, [
    'voip',
  ])
  const { token, expiresOn } = tokenResponse
  console.log(
    `\nIssued an access token with 'voip' scope that expires at ${expiresOn}:`
  )
  console.log(token)
  return tokenResponse
}
