import {
  CallingApplication,
  CommunicationUser,
  isCallingApplication,
  isCommunicationUser,
  isPhoneNumber,
  PhoneNumber,
  UnknownIdentifier,
} from '@azure/communication-common'

export const getId = (
  identifier:
    | CommunicationUser
    | CallingApplication
    | UnknownIdentifier
    | PhoneNumber
): string => {
  if (isCommunicationUser(identifier)) {
    return identifier.communicationUserId
  } else if (isCallingApplication(identifier)) {
    return identifier.callingApplicationId
  } else if (isPhoneNumber(identifier)) {
    return identifier.phoneNumber
  } else {
    return identifier.id
  }
}

export function getUserInitials(name: string): string {
  const bySpace = name.split(' ')
  if (bySpace.length > 1) {
    return bySpace[0][0] + bySpace[1][0]
  } else return name.slice(0, 2).toUpperCase()
}
