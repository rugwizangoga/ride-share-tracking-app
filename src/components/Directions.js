import React, { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const Directions = ({ driverPosition }) => {
    const map = useMap();
    const routesLibraries = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [eta, setEta] = useState('Calculating ETA...');

    useEffect(() => {
        if (!routesLibraries || !map) return;
        const directionsServiceInstance = new routesLibraries.DirectionsService();
        const directionsRendererInstance = new routesLibraries.DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: { strokeColor: "blue", strokeWeight: 8 }
        });
        setDirectionsService(directionsServiceInstance);
        setDirectionsRenderer(directionsRendererInstance);
    }, [routesLibraries, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer || !driverPosition) return;

        const routeRequest = {
            origin: driverPosition,
            destination: { lat: -1.9365670876910166, lng: 30.13020167024439 },
            waypoints: [
                { location: { lat: -1.9355377074007851, lng: 30.060163829002217 } },
                { location: { lat: -1.9358808342336546, lng: 30.08024820994666 } },
                { location: { lat: -1.9489196023037583, lng: 30.092607828989397 } },
                { location: { lat: -1.9592132952818164, lng: 30.106684061788073 } },
                { location: { lat: -1.9487480402200394, lng: 30.126596781356923 } }
            ],
            travelMode: 'DRIVING'
        };

        const updateDirections = () => {
            directionsService.route(routeRequest, (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                    const duration = response.routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0);
                    setEta(new Date(Date.now() + duration * 1000).toLocaleTimeString());
                } else {
                    console.error('Directions request failed due to ' + status);
                    setEta('Failed to calculate ETA');
                }
            });
        };

        updateDirections();
        const intervalId = setInterval(updateDirections, 30000); // Update directions and ETA every 30 seconds

        return () => clearInterval(intervalId);
    }, [directionsService, directionsRenderer, driverPosition]);

    return <div className='eta'>
        <h3>Nyabugogo - Kimironko</h3>
        <p>next stop: {eta}</p>
        <div className="route-container">
        <p>Distance: {eta}</p>
        <p>Time: {eta}</p>
        </div>
    </div>;
}

export default Directions;
