//for this to WORK you MUST start a live server with node.js, in cli, in the folder of website
var app = this;
var offpistes = null;
var map;
mapboxgl.accessToken = 'pk.eyJ1IjoibHVwZWFzZXJiYW4iLCJhIjoiY2owaGNsMjZyMDJ5eDJxcDVleWE2a3BjdCJ9.fMYQbhKexTYmOygHsUSUEw'

$(document).ready(function () {
  setupUI()
  loadData()
  loadMap()

})

//mapbox map
function loadMap () {
    map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/lupeaserban/cj8m3ik2g6j3r2spkjail3rz5',
    center: [6.866455078125, 45.90195515801997],
    zoom: 12,
    bearing: 27,
    pitch: 25
  });
}

function setupUI () {
  var sortButton = document.getElementById('sortButton');
  sortButton.addEventListener("click", function () {
    app.offpistes = app.offpistes.sort(function (x,y) { return x.ski_difficulty - y.ski_difficulty })
    render()
  })
}

function loadData () {
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

function render () {
  var output = '';
  for(var i = 0;i < offpistes.length;i++){
    if(offpistes[i].the_geom !== null){
      output += '<li class="names">' + offpistes[i].name + '</li>';
      output += '<li class="dif" type="none">' + 'Difficulty: ' + offpistes[i].ski_difficulty + '</li>';
      output += '<li class="desc" type="none">' + offpistes[i].short_description + '</li>';
    }
}
  document.getElementById('list').innerHTML = output;
}

//geojson.features[0].geometry.coordinates.push([x, y]);
function getCoords () {
    var count = 0;
    var coordinate =[];
    for (var i = 0; i < offpistes.length; i++) {
      if (offpistes[i].the_geom !== null) {
        for (var j = 0; j < offpistes[i].the_geom.coordinates.length; j++) {
          for (var k = 0; k < offpistes[i].the_geom.coordinates[j].length; k++) {
            count += 1;
            coordinate = [offpistes[i].the_geom.coordinates[j][k][0], offpistes[i].the_geom.coordinates[j][k][1]];
            console.log(coordinate, count)
            }
          }
        }
      }
  };

  map.on('load', function() {
    map.addLayer({
      "id": "route",
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [-122.48369693756104, 37.83381888486939],
              [-122.48348236083984, 37.83317489144141],
              [-122.48339653015138, 37.83270036637107],
              [-122.48356819152832, 37.832056363179625],
              [-122.48404026031496, 37.83114119107971],
              [-122.48404026031496, 37.83049717427869],
              [-122.48348236083984, 37.829920943955045],
              [-122.48356819152832, 37.82954808664175],
              [-122.48507022857666, 37.82944639795659],
              [-122.48610019683838, 37.82880236636284],
              [-122.48695850372314, 37.82931081282506],
              [-122.48700141906738, 37.83080223556934],
              [-122.48751640319824, 37.83168351665737],
              [-122.48803138732912, 37.832158048267786],
              [-122.48888969421387, 37.83297152392784],
              [-122.48987674713133, 37.83263257682617],
              [-122.49043464660643, 37.832937629287755],
              [-122.49125003814696, 37.832429207817725],
              [-122.49163627624512, 37.832564787218985],
              [-122.49223709106445, 37.83337825839438],
              [-122.49378204345702, 37.83368330777276]
            ]
          }
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#888",
        "line-width": 8
      }
    });
  });
