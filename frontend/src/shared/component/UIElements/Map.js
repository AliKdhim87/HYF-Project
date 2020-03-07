// import React, { useRef, useEffect } from "react";
// import mapboxgl from "mapbox-gl";
// mapboxgl.accessToken =
//   "pk.eyJ1IjoiYWxpa2FkaGltIiwiYSI6ImNqenZ0bDFzdzBhdGozbnBrMDFleDZ3dHQifQ.ak4IhXE5LXp1b3ofQC5l_Q";

// const Map = props => {
//   const mapRef = useRef();

//   const { center, zoom } = props;
//   console.log(mapboxgl);
//   useEffect(() => {
//     const map = new window.mapboxgl.Map({
//       container: mapRef.current,
//       center: center,
//       style: "mapbox://styles/mapbox/streets-v11",
//       zoom: zoom
//     });

//     new window.mapboxgl.Marker({ position: center, map: map });
//   }, [center, zoom]);

//   return (
//     <div
//       ref={mapRef}
//       className={`map ${props.className}`}
//       style={props.style}
//     ></div>
//   );
// };
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";
import "mapbox-gl/dist/mapbox-gl.css";

const Map = props => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  const { center, zoom } = props;

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWxpa2FkaGltIiwiYSI6ImNrNnVqZmY2YTA1bnQzZW9hOGl5c3owd3gifQ.0nam2ATvhX9r9KW4G36mSg";
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: center,
        zoom: zoom
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map, center, zoom]);

  return (
    <div
      className={`map ${props.className}`}
      ref={el => (mapContainer.current = el)}
      style={props.style}
    />
  );
};

export default Map;
