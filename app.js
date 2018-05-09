//for this to WORK you MUST start a live server with node.js, in cli, in the folder of website
var app = this;
var offpistes = null;
var map;
mapboxgl.accessToken = 'pk.eyJ1IjoibHVwZWFzZXJiYW4iLCJhIjoiY2owaGNsMjZyMDJ5eDJxcDVleWE2a3BjdCJ9.fMYQbhKexTYmOygHsUSUEw'

$(document).ready(function() {
  setupUI()
  loadData()
  loadMap()
})

//mapbox map
function loadMap() {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lupeaserban/cjgyq84te00062rnvjs8ws4ao',
    //maxBounds: [[6.7037200927734375, 45.79290335020632],[7.1088409423828125,46.03749263453821]],   [SW, NE]
    center: [ 6.866455078125, 45.90195515801997 ],
    zoom: 9,
    bearing: 27,
    pitch: 25
  });
  map.on('load', function() {
    getCoords()
    addBtnListeners();
  });
}

function setupUI() {
  var sortButton = document.getElementById('sortButton');
  sortButton.addEventListener("click", function() {
    app.offpistes = app.offpistes.sort(function(x, y) {
      return x.ski_difficulty - y.ski_difficulty
    })
    render()
  })
}

function loadData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(response) {
    if (this.readyState == 4 && this.status == 200) {
      offpistes = JSON.parse(xhttp.responseText);
      render()
      getCoords()
    }
  }
  xhttp.open("GET", "offpistes.json", true);
  xhttp.send();
}

function addBtnListeners() {
  for (var i = 0; i < offpistes.length; i++) {
    if (offpistes[i].the_geom !== null) {
      var btn = document.getElementById("button" + i);
      btn.addEventListener('click', function(e) {
        var iClicked = parseInt(e.currentTarget.id.substr(6)) // TODO: i in for loop always goes to 102
        var slope = {};
        slope = map.getSource("offpistes_" + iClicked);
        map.flyTo({
          zoom: 12,
          center: [
            slope._data.geometry.coordinates[0][0],
            slope._data.geometry.coordinates[0][1]
          ]
        });
        map.setPaintProperty('offpistes_' + iClicked, 'line-color', '#faafee');
      });
    }
  }
}

function render() {
  var output = '';
  for (var i = 0; i < offpistes.length; i++) {
    if (offpistes[i].the_geom !== null) {
      output += `<button id="button${i}">`
      output += '<li class="names">' + offpistes[i].name + '</li>';
      output += '<li class="dif" type="none">' + 'Difficulty: ' + offpistes[i].ski_difficulty + '</li>';
      output += '<li class="desc" type="none">' + offpistes[i].short_description + '</li>';
      output += '</button>'
    }
  }
  document.getElementById('list').innerHTML = output;

}

function getCoords() {
  // wait for both map and data before drawing lines
  if (!(map && map.loaded() && offpistes)) {
    return;
  }
  for (var i = 0; i < offpistes.length; i++) {
    if (offpistes[i].the_geom !== null) {
      var coordinates = [];
      for (var j = 0; j < offpistes[i].the_geom.coordinates.length; j++) {
        for (var k = 0; k < offpistes[i].the_geom.coordinates[j].length; k++) {
          coordinates.push([
            offpistes[i].the_geom.coordinates[j][k][0],
            offpistes[i].the_geom.coordinates[j][k][1]
          ]);
        }
      }
      map.addLayer({
        "id": "offpistes_" + i,
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "properties": {},
            "geometry": {
              "type": "LineString",
              "coordinates": coordinates
            }
          }
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#678",
          "line-width": 4
        }
      });
    }
  }
}
