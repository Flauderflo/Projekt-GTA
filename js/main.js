let map;
let appState = {
  markers: null,
  latLng: null,
  radius: null,
  heading: null,
};

/**
 * Draws the markers on the map.
 */
function drawMarkers() {
  if (map && appState.markers && appState.latLng && appState.radius) {
    appState.markers.clearLayers();
    let circle = L.circle(appState.latLng, {
      radius: appState.radius,
    });
    appState.markers.addLayer(circle);

    // Draw a line representing current heading
  }
}

/**
 * Function to be called whenever a new position is available.
 * @param position The new position.
 */
function geoSuccess(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  appState.latLng = L.latLng(lat, lng);
  appState.radius = position.coords.accuracy / 2;
  drawMarkers();

  if (map) {
    map.setView(appState.latLng);
  }
}

/**
 * Function to be called if there is an error raised by the Geolocation API.
 * @param error Describing the error in more detail.
 */
function geoError(error) {
  let errMsg = $("#error-messages");
  errMsg.text(
    errMsg.text() +
      "Fehler beim Abfragen der Position (" +
      error.code +
      "): " +
      error.message +
      " "
  );
  errMsg.show();
}

let geoOptions = {
  enableHighAccuracy: true,
  maximumAge: 15000, // The maximum age of a cached location (15 seconds).
  timeout: 12000, // A maximum of 12 seconds before timeout.
};

/**
 * The onload function is called when the HTML has finished loading.
 */
function onload() {
  let errMsg = $("#error-messages");

  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
  } else {
    errMsg.text(
      errMsg.text() + "Geolocation is leider auf diesem Gerät nicht verfügbar. "
    );
    errMsg.show();
  }

  if (window.DeviceOrientationEvent) {
    window.addEventListener(
      "deviceorientation",
      function (eventData) {
        appState.heading = eventData.alpha * (Math.PI / 180);
        drawMarkers();
      },
      false
    );
  } else {
    errMsg.text(
      errMsg.text() + "DeviceOrientation ist leider nicht verfügbar. "
    );
    errMsg.show();
  }

  map = L.map("map").setView([47.37675, 8.540721], 16);
  appState.markers = L.layerGroup();
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.addLayer(appState.markers);
  fetch("data/velovorzugsrouten.json")
    .then((response) => response.json())
    .then((data) => {
      L.geoJSON(data).addTo(map);
    })
    .catch((error) => {
      console.error("Fehler beim Laden der GeoJSON-Datei:", error);
    });
}

function tracking() {
  track_cords = [];
  if ("geolocation" in navigator) {
    new_track = navigator.geolocation.watchPosition(
      gettingCords,
      geoError,
      geoOptions
    );
  } else {
    errMsg.text(
      errMsg.text() + "Geolocation is leider auf diesem Gerät nicht verfügbar. "
    );
    errMsg.show();
  }
  console.log("fertig GPS Aufzeichung");
  // Mechanismus um die Bewertungen aus dem HTML einzufliessen zu lassen.
  let track = {
    cords: track_cords,
    rating: {
      sicherheit: 0,
      ampel: false,
    },
  };
  // export to db
}

function stop_tracking() {
  navigator.geolocation.clearWatch(new_track);
}

function gettingCords(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;
  num_cords = [lat, lng];
  track_cords.push(num_cords);
}
