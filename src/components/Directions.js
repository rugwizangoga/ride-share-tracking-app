/* global google */

import React, { useState, useEffect } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

const waypoints = [
        { name: "Nyabugogo", location: { lat: -1.939826787816454, lng: 30.0445426438232 } }, // Origin
        { name: "Stop A", location: { lat: -1.9355377074007851, lng: 30.060163829002217 } },
        { name: "Stop B", location: { lat: -1.9358808342336546, lng: 30.08024820994666 } },
        { name: "Stop C", location: { lat: -1.9489196023037583, lng: 30.092607828989397 } },
        { name: "Stop D", location: { lat: -1.9592132952818164, lng: 30.106684061788073 } },
        { name: "Stop E", location: { lat: -1.9487480402200394, lng: 30.126596781356923 } },
        { name: "Kimironko", location: { lat: -1.9365670876910166, lng: 30.13020167024439 } } // Destination
    ];

const Directions = ({ driverPosition }) => {
    const map = useMap();
    const routesLibraries = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState(null);
    const [directionsRenderer, setDirectionsRenderer] = useState(null);
    const [distance, setDistance] = useState('Calculating distance...');
    const [time, setTime] = useState('Calculating time...');
    const [nextStop, setNextStop] = useState('Determining next stop...');

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
            origin: waypoints[0].location,
            destination: waypoints[waypoints.length - 1].location,
            waypoints: waypoints.slice(1, waypoints.length - 1).map(waypoint => ({ location: waypoint.location, stopover: true })),
            travelMode: 'DRIVING'
        };

        const updateDirections = () => {
            directionsService.route(routeRequest, (response, status) => {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                    const route = response.routes[0];
                    const totalDistance = route.legs.reduce((total, leg) => total + leg.distance.value, 0);
                    const durationInSeconds = route.legs.reduce((total, leg) => total + leg.duration.value, 0);
                    setDistance(`${(totalDistance / 1000).toFixed(2)} km`);

                    const durationInMinutes = durationInSeconds / 60;
                    if (durationInMinutes < 60) {
                        setTime(`${Math.round(durationInMinutes)} minutes`); // Display in minutes if less than an hour
                    } else {
                        const durationInHours = durationInMinutes / 60;
                        setTime(`${durationInHours.toFixed(2)} hours`); // Display in hours if one hour or more
                    }

                    // Determine the next stop based on the progression through waypoints
                    let nextWaypointIndex = 0; // Default to the start if no closer waypoint is found
                    const driverLatLng = new google.maps.LatLng(driverPosition.lat, driverPosition.lng);
                    let minDistance = Number.MAX_VALUE;
                    route.legs.forEach((leg, index) => {
                        const legStartLatLng = new google.maps.LatLng(leg.start_location.lat(), leg.start_location.lng());
                        const distance = google.maps.geometry.spherical.computeDistanceBetween(driverLatLng, legStartLatLng);
                        if (distance < minDistance) {
                            minDistance = distance;
                            nextWaypointIndex = index + 1; // +1 because the first leg starts from origin
                        }
                    });

                    setNextStop(waypoints[nextWaypointIndex].name);
                } else {
                    console.error('Directions request failed due to ' + status);
                    setTime('Failed to calculate time');
                    setNextStop('Unable to determine next stop');
                }
            });
        };

        updateDirections();
        const intervalId = setInterval(updateDirections, 30000); // Update directions, ETA, distance, and time every 30 seconds

        return () => clearInterval(intervalId);
    }, [directionsService, directionsRenderer, driverPosition]);

    return (
        <div className='eta'>
            <h3>Nyabugogo - Kimironko</h3>
            <p>Next stop: {nextStop}</p>
            <div className="route-container">
                <p>Distance: {distance}</p>
                <p>Time: {time}</p>
            </div>
        </div>
    );
}

export default Directions;
