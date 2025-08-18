import type { TLocation } from "@/types/location.types"
import { getToken, handleApiResponse } from "./user"
import { url } from "./utils"

export const createLocation = async (locationData: TLocation) => {
  const token = getToken()
  const res = await fetch(`${url}/location`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(locationData),
  })
  await handleApiResponse(res)
  return res.json()
}

//get user location
export const getUserLocations = async () => {
  const token = getToken()
  const res = await fetch(`${url}/location`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  await handleApiResponse(res)
  return res.json()
}
