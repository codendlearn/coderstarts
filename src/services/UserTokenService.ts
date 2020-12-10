import { CommunicationIdentityClient } from '@azure/communication-administration'

export const getUser = async () => {
  const connectionString =
    'endpoint=https://collab.communication.azure.com/;accesskey=JAUFob2sJjfYfn+S7UIuCyFz0v6IWJJJ51nUIkJg0TO4IiSECgKjIb2KyQeM6sR24SSA05c4OnVW7G8Z1hSSHg=='
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
