import React, { useState, useEffect } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import Marker from './Marker';
import Directions from './Directions';

const MapComponent = () => {
  const initialPosition = { lat: -1.9496286, lng: 30.1263200284355 };
  const [driverPosition, setDriverPosition] = useState(initialPosition);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setDriverPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location: ', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div style={{ height: '78vh' }}>
      <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultZoom={11.8}
          defaultCenter={initialPosition}
          fullscreenControl={false}
          mapTypeControl={false}
          streetViewControl={false}
          zoomControl={false}
        >
          <Marker position={driverPosition} name="Driver" />
          <Marker position={{ lat: -1.9355377074007851, lng: 30.060163829002217 }} name="Stop A" />
          <Marker position={{ lat: -1.9358808342336546, lng: 30.08024820994666 }} name="Stop B" />
          <Marker position={{ lat: -1.9489196023037583, lng: 30.092607828989397 }} name="Stop C" />
          <Marker position={{ lat: -1.9592132952818164, lng: 30.106684061788073 }} name="Stop D" />
          <Marker position={{ lat: -1.9487480402200394, lng: 30.126596781356923 }} name="Stop E" />
          <Marker position={{ lat: -1.939826787816454, lng: 30.0445426438232 }} name="Nyabugogo" />
          <Marker position={{ lat: -1.9365670876910166, lng: 30.13020167024439 }} name="Kimironko" />
          <Directions driverPosition={driverPosition} />
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapComponent;
