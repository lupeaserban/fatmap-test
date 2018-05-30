var offpistes = null;
var map;
mapboxgl.accessToken = 'pk.eyJ1IjoibHVwZWFzZXJiYW4iLCJhIjoiY2owaGNsMjZyMDJ5eDJxcDVleWE2a3BjdCJ9.fMYQbhKexTYmOygHsUSUEw'

document.addEventListener("DOMContentLoaded", function() {
  setupUI()
  loadData()
  loadMap()
})

//mapbox map
function loadMap() {
  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lupeaserban/cjgyq84te00062rnvjs8ws4ao',
    center: [
      6.866455078125, 45.90195515801997
    ],
    zoom: 10,
    bearing: 27,
    pitch: 25
  });
  map.on('load', function() {
    getCoords()
    addBtnListeners();
  });
}

function render() {
  var output = '';
  for (var i = 0; i < offpistes.length; i++) {
    output += `<button id="button${i}">`
    output += '<li class="names">' + offpistes[i].name + '</li>';
    output += '<li class="dif" type="none">' + 'Difficulty: ' + offpistes[i].ski_difficulty + '</li>';
    output += '<li class="desc" type="none">' + offpistes[i].short_description + '</li>';
    output += '</button>'
  }
  document.getElementById('list').innerHTML = output;
}

function setupUI() {
  var sortButton = document.getElementById('sortButton');
  sortButton.addEventListener("click", function() {
    offpistes = offpistes.sort(function(x, y) {
      return x.ski_difficulty - y.ski_difficulty
    })
    render()
    addBtnListeners()
  })
}

function loadData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function(response) {
    if (this.readyState == 4 && this.status == 200) {
      offpistes = JSON.parse(xhttp.responseText);
      offpistes = offpistes.filter(function(obj) {
        return obj.the_geom !== null;
      });
      offpistes = offpistes.sort(function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        // names must be equal
        return 0;
      });
      render()
      getCoords()
    }
  }
  xhttp.open("GET", "offpistes.json", true);
  xhttp.send();
}

function slope(count) {
  map.setPaintProperty("offpistes_" + count, 'line-color', '#1074d7');
  return function() {
    var slope = {};
    slope = map.getSource("offpistes_" + count);
    map.flyTo({
      zoom: 13,
      center: [
        slope._data.geometry.coordinates[0][0],
        slope._data.geometry.coordinates[0][1]
      ]
    });
    map.setPaintProperty(slope.id, 'line-color', '#ec1616');
  }
}

function addBtnListeners() {
  for (var i = 0; i < offpistes.length; i++) {
    var btn = document.getElementById("button" + i);
    btn.addEventListener('click', slope(i));
  }
}

function getCoords() {
  // wait for both map and data before drawing lines
  if (!(map && map.loaded() && offpistes)) {
    return;
  }
  for (var i = 0; i < offpistes.length; i++) {
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
        "line-color": "#1074d7",
        "line-width": 4
      }
    });
  }
}
