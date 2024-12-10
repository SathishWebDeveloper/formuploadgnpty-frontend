import React,{useContext, useEffect} from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import axios from "axios"
import { Context } from "../../routes/routes"
import mapImage from "../../assets/map.png"


const containerStyle = {
  width: '800px',
  height: '800px',
}

// Array of marker locations with image URLs
// const locations = [
//   { lat: -3.745, lng: -38.523, icon: map },
//   { lat: -3.747, lng: -38.525, icon: map },
//   { lat: -3.749, lng: -38.527, icon: map },
// ]

const defaultCenter = {
  lat: 0, // Default latitude
  lng: 0, // Default longitude
};

function ViewPage() {
  const propData = useContext(Context);
  const authkey = localStorage.getItem("accessToken") || "";
  const token = propData?.accessToken || authkey;

  const [map, setMap] = React.useState(null);
  const [locations, setLocations] = React.useState(null);
  const [center, setCenter] = React.useState(defaultCenter);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_API_KEY,
  });

  const getLocations = async () => {
    console.log("test", token); // Logging for debugging

    const url = "http://localhost:8000/api/generatefiles/locationlist";
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token for authentication
        },
      });
      console.log("res9999999", response);
      setLocations(response.data.data);

      // Update center to the first location if available
      if (response.data.data.length > 0) {
        setCenter({
          lat: response.data.data[0].lat,
          lng: response.data.data[0].lng,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  const onLoad = React.useCallback((map) => {
    if (locations && locations.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });

      // Apply padding to the bounds
      map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
    }
    setMap(map);
  }, [locations]);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10} // Set a reasonable default zoom level
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {locations &&
        locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            icon={{
              url: mapImage,
              scaledSize: new window.google.maps.Size(30, 30), // Resize the image
            }}
          />
        ))}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(ViewPage);



// reduce zoom level

// To reduce the initial zoom level and avoid excessive zoom-in during the map load, you can adjust how the map bounds are set when it first loads. The fitBounds method is resizing the map view to fit all the markers, which might cause unintended zoom behavior if the markers are too close together.

// Options to Solve the Issue:
// Set a Default Zoom Level:

// Instead of relying on fitBounds, you can specify a zoom level directly when the map loads.
// Adjust LatLngBounds for Padding:

// Add padding to the LatLngBounds to prevent the map from zooming in too closely.
// Here’s the updated code to handle this:

// Updated Code
// javascript
// Copy code
// import React, { useContext, useEffect } from "react";
// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
// import axios from "axios";

// const containerStyle = {
//   width: "400px",
//   height: "400px",
// };

// const defaultCenter = {
//   lat: 0, // Default latitude
//   lng: 0, // Default longitude
// };

// function ViewPage() {
//   const propData = useContext(Context);
//   const authkey = localStorage.getItem("accessToken") || "";
//   const token = propData?.accessToken || authkey;

//   const [map, setMap] = React.useState(null);
//   const [locations, setLocations] = React.useState(null);
//   const [center, setCenter] = React.useState(defaultCenter);

//   const { isLoaded } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: import.meta.env.VITE_API_KEY,
//   });

//   const getLocations = async () => {
//     console.log("test", token); // Logging for debugging

//     const url = "http://localhost:8000/api/generatefiles/locationlist";
//     try {
//       const response = await axios.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`, // Attach the token for authentication
//         },
//       });
//       console.log("res9999999", response);
//       setLocations(response.data.data);

//       // Update center to the first location if available
//       if (response.data.data.length > 0) {
//         setCenter({
//           lat: response.data.data[0].lat,
//           lng: response.data.data[0].lng,
//         });
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     getLocations();
//   }, []);

//   const onLoad = React.useCallback((map) => {
//     if (locations && locations.length > 0) {
//       const bounds = new window.google.maps.LatLngBounds();
//       locations.forEach((location) => {
//         bounds.extend({ lat: location.lat, lng: location.lng });
//       });

//       // Apply padding to the bounds
//       map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
//     }
//     setMap(map);
//   }, [locations]);

//   const onUnmount = React.useCallback(() => {
//     setMap(null);
//   }, []);

//   return isLoaded ? (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={center}
//       zoom={10} // Set a reasonable default zoom level
//       onLoad={onLoad}
//       onUnmount={onUnmount}
//     >
//       {locations &&
//         locations.map((location, index) => (
//           <Marker
//             key={index}
//             position={{ lat: location.lat, lng: location.lng }}
//             icon={{
//               url: mapImage,
//               scaledSize: new window.google.maps.Size(30, 30), // Resize the image
//             }}
//           />
//         ))}
//     </GoogleMap>
//   ) : (
//     <></>
//   );
// }

// export default React.memo(ViewPage);
// Key Changes
// Set a Default zoom:

// Added a zoom={10} property to the GoogleMap component to avoid excessive zoom-in.
// Adjust Bounds with Padding:

// Modified the fitBounds method to include padding, ensuring the map doesn't zoom in too much when fitting the markers.
// javascript
// Copy code
// map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
// Dynamic Center:

// Use the first location from the API response to set the initial map center, ensuring the map starts focused on a relevant area.
// Fallback Zoom Behavior:

// If no markers are available, the map defaults to a specified zoom level without relying on fitBounds.
// Result
// The map will now start with a reasonable zoom level and fit markers with padding to prevent excessive zoom-in.