import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

const Marker = ({ position, name }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const marker = new window.google.maps.Marker({
      position,
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,  // Bigger scale for visibility
        fillColor: name === "Driver" ? '#FF0000' : '#FFFFFF',  // Red for driver, white for stops
        fillOpacity: 1,
        strokeWeight: 0,
        strokeColor: '#000000'  // Black border for all
      },
      label: {
        text: name,
        color: '#000000',  // Black color for text
        fontSize: '12px',  // Larger font for visibility
        fontWeight: 'bold'
      }
    });

    return () => marker.setMap(null);
  }, [map, position, name]);  // Dependency on position and name to update marker

  return null;
};

export default Marker;
