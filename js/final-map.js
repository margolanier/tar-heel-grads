
var geocoder;
var map;
var addresses = [];
var person = [];
var info = [];
var contact = [];


function initialize() {
  var public_spreadsheet_url = 'https://docs.google.com/spreadsheet/pub?key=0AuSm4qaFIJGKdEY3NXhsbXE1ci1FaXRZb0pfRWJLQ2c&output=html';
  $(document).ready( function() {
    Tabletop.init( { key: '0AuSm4qaFIJGKdEY3NXhsbXE1ci1FaXRZb0pfRWJLQ2c',
                     callback: code_addresses,
                     wanted: [ 'Responses' ],
                     debug: true } )
  })

}


function code_addresses(data, tabletop) {
 
geocoder = new google.maps.Geocoder();
  var mapOptions = {
    zoom: 5,
    center: new google.maps.LatLng(35.903928, -79.046243),
    styles: [{"stylers":[{"saturation":-100},{"gamma":1}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.place_of_worship","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"water","stylers":[{"visibility":"on"},{"saturation":50},{"gamma":0},{"hue":"#56a0d3"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#333333"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"weight":0.5},{"color":"#333333"}]},{"featureType":"transit.station","elementType":"labels.icon","stylers":[{"gamma":1},{"saturation":70}]}]
  }
  
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
 

  $.each( tabletop.sheets("Responses").all(), function(i, entry) {
    addresses.push(entry.citystate);
    person.push(entry.name);
    info.push(entry.companyorschool);
    contact.push(entry.contact);
  })


  for(var i=0; i < addresses.length; i++) {
      console.log('inside "code_addresses" for loop')
      codeAddress(addresses[i], person[i], info[i], contact[i]);
  }
}

function codeAddress(address, person, info, contact) {
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);

      var contentString = '<div id="iw-container">' +
        '<div class="iw-title">' + person + '</div>' +
        '<div class="iw-content"><p><i class="fa fw fa-briefcase"></i>' + info +
        '<br><i class="fa fw fa-map-marker"></i>' + address +
        '<br><i class="fa fw fa-paper-plane"></i>' + contact +
        '</p></div>' +
        '</div>';

      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
          icon: 'http://margolanier.com/tarheelgrads/img/marker.png'
      });
      console.log(results[0].formatted_address);

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);



