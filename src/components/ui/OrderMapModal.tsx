import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

interface OrderMapModalProps {
  isOpen: boolean
  onClose: () => void
  pickupLocation: string
  deliveryLocation: string
  storeName: string
  customerName: string
}

export function OrderMapModal({
  isOpen,
  onClose,
  pickupLocation,
  deliveryLocation,
  storeName,
  customerName,
}: OrderMapModalProps) {
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(
    null,
  )
  const [deliveryCoords, setDeliveryCoords] = useState<[number, number] | null>(
    null,
  )
  const [route, setRoute] = useState<[number, number][]>([])
  const [distance, setDistance] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Replace with your OpenRouteService API key
  const ORS_API_KEY =
    import.meta.env.VITE_OPENROUTE_API_KEY 
    if (!ORS_API_KEY) {
        console.error('OpenRouteService API key is not set')
        return null
    }
  useEffect(() => {
    if (!isOpen) return

    const geocode = async (address: string) => {
      const parsedAddress = address.replace('kenya', '').trim()
      try {
        // Using OpenRouteService Geocoding instead of Nominatim
        const response = await fetch(
          `https://api.openrouteservice.org/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(parsedAddress)}&boundary.country=KEN`,
        )
        const data = await response.json()
        if (data?.features?.length > 0) {
          const [lon, lat] = data.features[0].geometry.coordinates
          return [lat, lon] as [number, number]
        }
        return null
      } catch (err) {
        console.error('Geocoding error:', err)
        return null
      }
    }

    const fetchRoute = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const pickup = await geocode(pickupLocation)
        const delivery = await geocode(deliveryLocation)

        if (!pickup || !delivery) {
          throw new Error(
            'Could not find coordinates for one or both locations',
          )
        }

        setPickupCoords(pickup)
        setDeliveryCoords(delivery)

        // Get directions from OpenRouteService
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coordinates: [
                [pickup[1], pickup[0]], // ORS uses [lon, lat] format
                [delivery[1], delivery[0]],
              ],
              instructions: false,
            }),
          },
        )

        const routeData = await response.json()

        if (routeData?.routes?.length > 0) {
          const routeGeometry = routeData.routes[0].geometry
          // Decode polyline to get coordinates
          const decodedRoute = decodePolyline(routeGeometry)
          setRoute(decodedRoute)

          // Set distance (in meters) and duration (in seconds)
          setDistance(routeData.routes[0].summary.distance)
          setDuration(routeData.routes[0].summary.duration)
        } else {
          // Fallback to straight line if no route found
          setRoute([pickup, delivery])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map data')
        console.error('Route fetching error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoute()
  }, [isOpen, pickupLocation, deliveryLocation])

  // Helper function to decode OpenRouteService polyline
  const decodePolyline = (encoded: string): [number, number][] => {
    const points = []
    let index = 0
    const len = encoded.length
    let lat = 0
    let lng = 0

    while (index < len) {
      let b
      let shift = 0
      let result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lat += dlat

      shift = 0
      result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lng += dlng

      points.push([lat * 1e-5, lng * 1e-5] as [number, number])
    }

    return points
  }

  const formatDistance = (meters: number | null): string => {
    if (!meters) return 'N/A'
    return meters > 1000
      ? `${(meters / 1000).toFixed(1)} km`
      : `${Math.round(meters)} m`
  }

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return 'N/A'
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.round((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  if (!isOpen) return null

  const calculateCenter = (): LatLngExpression => {
    if (pickupCoords && deliveryCoords) {
      return [
        (pickupCoords[0] + deliveryCoords[0]) / 2,
        (pickupCoords[1] + deliveryCoords[1]) / 2,
      ] as LatLngExpression
    }
    return [0, 0] as LatLngExpression // Default center
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Delivery Route: {storeName} to {customerName}
            </h3>

            {isLoading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : error ? (
              <div className="h-96 flex items-center justify-center text-red-500">
                {error}
                <button
                  onClick={onClose}
                  className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between mb-4 bg-orange-50 p-3 rounded-md">
                  <div>
                    <span className="font-medium">Distance:</span>{' '}
                    {formatDistance(distance)}
                  </div>
                  <div>
                    <span className="font-medium">Estimated Duration:</span>{' '}
                    {formatDuration(duration)}
                  </div>
                </div>

                <div className="h-96 relative">
                  <MapContainer
                    center={calculateCenter()}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {pickupCoords && (
                      <Marker position={pickupCoords}>
                        <Popup>
                          <div className="font-bold">Pickup Location</div>
                          <div>{storeName}</div>
                          <div className="text-sm text-gray-500">
                            {pickupLocation}
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {deliveryCoords && (
                      <Marker position={deliveryCoords}>
                        <Popup>
                          <div className="font-bold">Delivery Location</div>
                          <div>{customerName}</div>
                          <div className="text-sm text-gray-500">
                            {deliveryLocation}
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {route.length > 0 && (
                      <Polyline
                        positions={route}
                        pathOptions={{
                          color: '#FF6B35',
                          weight: 5,
                          opacity: 0.7,
                          dashArray: '5, 5',
                        }}
                      />
                    )}
                  </MapContainer>
                </div>
              </>
            )}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-orange-600 text-base font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
