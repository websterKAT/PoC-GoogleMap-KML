import React, { useState, useEffect, useRef } from 'react';
import { Loader } from "@googlemaps/js-api-loader"

const NewMap = () => {
  const mapRef = useRef(null);
  const dataLayerRef = useRef(null);
  let map = null;

  const loader = new Loader({
    apiKey: ""
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  const onScriptLoad = () => {
    console.log("scripted loaded");
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 50.5, lng: 4 },
      zoom: 8,
      gestureHandling: 'greedy',
      disableDefaultUI: true,
    });
    controlUI.style.backgroundColor = "white";

    mapRef.current = map;
    setMapLoaded(true);
    //dataHandler('https://storage.googleapis.com/mapsdevsite/json/google.json');
  };



  const dataHandler = async (getJson) => {
    if (!mapLoaded) {
        console.log('inside not loadd');
    };

    // Remove the current layer if there is one
    if (dataLayerRef.current) {
      mapRef.current.data.remove(dataLayerRef.current);
    }

    // Fetch JSON file
    fetch('https://prop-ai-user-data.s3.me-central-1.amazonaws.com/community.json', {
        method: "GET"
    })
        .then(response => response.json())
        .then(data => {
            const newData = data.features.filter((obj) => obj.geometry.coordinates && obj.geometry.coordinates[0].length != 1)
            console.log(newData,'daaa0', data);
            data.features = newData;
            const dataLayer = mapRef.current.data.addGeoJson(data)
            dataLayerRef.current = dataLayer;
            mapRef.current.data.setStyle({ strokeWeight: 0.5, fillOpacity: 0.1 });
        });
  
      mapRef.current.data.addListener('mouseover', (event) => {
      mapRef.current.data.revertStyle();
      // Add a style when you hover over a specific polygon
      mapRef.current.data.overrideStyle(event.feature, { strokeWeight: 1, fillOpacity: 0.5 });
      // In the console log, you can see all the data you can return
      console.log(event.feature);
    });

    // mapRef.current.data.addListener('mouseout', () => {
    //   // Revert the style to how it was when you hover out
    //   mapRef.current.data.revertStyle();
    // });
  };

  useEffect(() => {
    loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary("maps");
        
        map = new google.maps.Map(document.getElementById("newMap") , {
            zoom: 10,
            center: { lat: 25.276987, lng: 55.296249 },
          });
        mapRef.current = map;
        // map.data.loadGeoJson(
        //     "https://storage.googleapis.com/mapsdevsite/json/google.json"
        //   );
          // NOTE: This uses cross-domain XHR, and may not work on older browsers.
         dataHandler(
            "https://storage.googleapis.com/mapsdevsite/json/google.json"
          );
        setMapLoaded(true);
      });
    
  }, []); // Empty dependency array to run only once on mount

  return (
    <div className='mapContainer'>
          <div id='newMap' />
          <style jsx>{`
            div {
                width:95%;
                height:95%;
                position:fixed;
              }
      `}</style>
    </div>
   
  );
};

export default NewMap;