import { useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Autocomplete,
  KmlLayer,
} from "@react-google-maps/api";

const Map = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchLngLat, setSearchLngLat] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const autocompleteRef = useRef(null);
  const [address, setAddress] = useState("");

  // laod script for google map
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: '',
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading....</div>;

  // static lat and lng
  const center = { lat: 25.276987, lng: 55.296249 };

  // handle place change on search
  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    setSelectedPlace(place);
    setSearchLngLat({
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    setCurrentLocation(null);
  };

  // get current location
  const handleGetLocationClick = () => {
    console.log('clickkking');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedPlace(null);
          setSearchLngLat(null);
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  // on map load
  const onMapLoad = (map) => {
    // const controlDiv = document.createElement("div");
    // const controlUI = document.createElement("div");
    // controlUI.innerHTML = "Get Location";
    // controlUI.style.backgroundColor = "white";
    // controlUI.style.color = "black";
    // controlUI.style.border = "2px solid #ccc";
    // controlUI.style.borderRadius = "3px";
    // controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    // controlUI.style.cursor = "pointer";
    // controlUI.style.marginBottom = "22px";
    // controlUI.style.textAlign = "center";
    // controlUI.style.width = "100%";
    // controlUI.style.padding = "8px 0";
   // controlDiv.appendChild(controlUI);

    // const centerControl = new window.google.maps.ControlPosition(
    //   window.google.maps.ControlPosition.TOP_CENTER,
    //   0,
    //   10
    // );

    // map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(
    //   controlDiv
    // );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width:'100%',
        gap: "20px",
      }}
    >
      {/* search component  */}
      <Autocomplete
        onLoad={(autocomplete) => {
          console.log("Autocomplete loaded:", autocomplete);
          autocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={handlePlaceChanged}
        options={{ fields: ["address_components", "geometry", "name"] }}
      >
        <input type="text" placeholder="Search for a location" />
      </Autocomplete>

      {/* map component  */}
      <GoogleMap
        zoom={ 10}
        center={ center}
        mapContainerClassName="map"
        mapContainerStyle={{ width: "80%", height: "600px", margin: "auto" }}
        onLoad={onMapLoad}
      >
        {selectedPlace && <Marker position={searchLngLat} />}
        {currentLocation && <Marker position={currentLocation} />}

        <KmlLayer
          url="https://prop-ai-user-data.s3.me-central-1.amazonaws.com/Community.kml"
          options={{ preserveViewport: true }}
          //onClick={ (data) => console.log(data,'test shitttt')}
        />
      </GoogleMap>
    </div>
  );
};

export default Map;