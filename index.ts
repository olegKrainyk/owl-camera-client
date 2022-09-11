/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import axios from 'axios';

function initMap() {
    const myLatlng = { lat: 25.90738, lng: -80.1385};

    const map = new google.maps.Map(document.getElementById("map")!, {
        zoom: 18,
        center: myLatlng,
    });

    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatlng,
    });
    const elevator = new google.maps.ElevationService();
    infoWindow.open(map);

    // Configure the click listener.
    map.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.
        infoWindow.close();

        // Create a new InfoWindow.
        infoWindow = new google.maps.InfoWindow({
            position: mapsMouseEvent.latLng,
        });
        infoWindow.setContent(
            // JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
            "Your marker is set!"
        );
        let lat = mapsMouseEvent.latLng.toJSON()['lat'];
        let long = mapsMouseEvent.latLng.toJSON()['lng'];
        let alt = 0
        console.log(lat,long)
        infoWindow.open(map);

        displayLocationElevation(mapsMouseEvent.latLng, elevator, infoWindow);

        function displayLocationElevation(
            location: google.maps.LatLng,
            elevator: google.maps.ElevationService,
            infowindow: google.maps.InfoWindow
        ){
            elevator
            .getElevationForLocations({
                locations: [location],
            })
            .then(({ results }) => {
                // Retrieve the first result
                if (results[0]) {
                    alt = results[0].elevation;
                    console.log(alt);
                } else {
                    console.log("No altitude found")
                }



                let data = mapsMouseEvent.latLng.toJSON();
                data['alt'] = alt;
                console.log(data)




                axios.post('http://audax:8080', data)
                    .then(response => console.log("success") )
                    .catch(error => {
                        console.error('There was an error!', error);
                    });


                //
                // let xhr = new XMLHttpRequest();
                // xhr.open("POST", "https://audax:8080");
                //
                // xhr.setRequestHeader("Accept", "application/json");
                // xhr.setRequestHeader("Content-Type", "application/json");
                //
                // xhr.onload = () => console.log(xhr.responseText);
                //
                // xhr.send(data);
            })
            .catch((e) =>
                infowindow.setContent("Elevation service failed due to: " + e)
            );
        }



    });
}

declare global {
    interface Window {
        initMap: () => void;
    }
}
window.initMap = initMap;
export {};
