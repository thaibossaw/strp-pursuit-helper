import { MapOptions } from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import useMapContext from './useMapContext'

interface LeafletMapContainerProps extends MapOptions {
  children: JSX.Element | JSX.Element[]
}

export const LeafletMapContainer = ({ children, ...props }: LeafletMapContainerProps) => {
  const { setMap, setLeafletLib } = useMapContext()

  useEffect(() => {
    if (!setLeafletLib) return
    import('leaflet').then(leaflet => {
      setLeafletLib(leaflet)
    })
  }, [setLeafletLib])

  return (
    <MapContainer
      zoom={0}
      preferCanvas={true}
      ref={e => setMap && setMap(e || undefined)}
      className="absolute h-full w-full text-white outline-0"
      {...props}
    >
      <TileLayer
      maxNativeZoom={5}
      minNativeZoom={0}
      noWrap={true}
        url="mapStyles/styleSatelite/{z}/{x}/{y}.jpg"
      />
      {children}
    </MapContainer>
  )
}
