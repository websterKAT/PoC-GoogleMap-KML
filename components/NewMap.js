import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from "@googlemaps/js-api-loader"
import Form from 'react-bootstrap/Form';

const NewMap = () => {
  const mapRef = useRef(null);
  const dataLayerRef = useRef(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [geoData, setGeoData] = useState(null);
  let map = null;

  const loader = new Loader({
    apiKey: ""
  });

  const [mapLoaded, setMapLoaded] = useState(false);

  const dataHandler = async (getJson) => {
    if (!mapLoaded) return;

    // Remove the current layer if there is one
    if (dataLayerRef.current) {
      mapRef.current.data.remove(dataLayerRef.current);
    }

    // Fetch JSON file
    fetch(getJson, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        // filtering null values
        const newData = data.features.filter((obj) => obj.geometry.coordinates && obj.geometry.coordinates[0].length != 1)
        data.features = newData;
        setGeoData(data);
        const dataLayer = mapRef.current.data.addGeoJson(data)
        dataLayerRef.current = dataLayer;
        mapRef.current.data.setStyle({ strokeWeight: 0.5, fillOpacity: 0.1 });
        
        mapRef.current.data.addListener('mouseover', (event) => {
          mapRef.current.data.revertStyle();
          mapRef.current.data.overrideStyle(event.feature, { strokeWeight: 1, fillOpacity: 0.5 });
      });
  
      mapRef.current.data.addListener("mouseout", (event) => {
        mapRef.current.data.revertStyle();
      });
        mapRef.current.data.addListener('click', (event) => {
          const featureProperties = event.feature.getProperty('description');
    
          const infoWindow = new window.google.maps.InfoWindow({
            content: featureProperties,
            position: event.latLng
          });
    
          infoWindow.open(mapRef.current);
        });
    });
  };

  const onSelectChange = (eventValue) => {

    setSelectedRegion(eventValue);
    mapRef.current.data.setStyle((feature) =>
     {
        let color = 'grey';
        let opacity = 0.1;
        let strokeweight = 0.5;
        if(feature.getProperty('OBJECTID') == eventValue){
          color = 'green';
          opacity = 0.7;
          strokeweight = 2;
        }
        return {
          fillColor: color,
          strokeColor: color,
          strokeWeight: strokeweight,
          fillOpacity:opacity
        }
     });
  };

  useEffect(() => {
    loader.load().then(async () => {
        
        map = new google.maps.Map(document.getElementById("newMap") , {
            zoom: 10,
            center: { lat: 25.276987, lng: 55.296249 },
          });
        mapRef.current = map;
         dataHandler(
            'https://prop-ai-user-data.s3.me-central-1.amazonaws.com/community.json'
          );
        setMapLoaded(true);
      });
    
  }, [mapLoaded]);

  return (
    <div className='mapContainer'>
          <Form.Select
          aria-label="Default select example"
          onChange={e =>onSelectChange(e.target.value)}>
          { geoData && geoData.features.map((e, key) => {
            return <option key={key} value={e.properties.OBJECTID}>{e.properties.CNAME_E}</option>;
          })}
          </Form.Select>
          
          <div id='newMap' />
          <style jsx>{`
            div {
                margin-top:20px;
                width:95%;
                height:95%;
                position:fixed;
              }
      `}</style>
    </div>
   
  );
};

export default NewMap;