const btn = document.getElementById("open_menu");
const aside = document.querySelector(".aside")
const menu = document.querySelectorAll(".menu_text")
const map = document.getElementById('map')
const dash =document.querySelector('.dash_bord')
const google_map = document.querySelector(".google_map")
const home = document.getElementById('home')
const city = document.getElementById('search')
const searchBtn = document.getElementById('search_btn')
const temperature = document.getElementById('temperature')
const climet = document.getElementById('climet')
const sunSet = document.getElementById('sun_set')
const sunRise = document.getElementById('sun_rise')
const weatherLocation = document.getElementById('weather_location')
const weatherLat = document.getElementById('weather_lat')
const weatherLon = document.getElementById('weather_lon')
const weatherImg = document.querySelector(".weather_img")

let API_KEY = 'Private key from open weather map'

// get the current location and weather using google map "need the api key to access"
function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -33.8688, lng: 151.2195 },
      zoom: 13,
    });
    const input = document.getElementById("pac-input");
    // Specify just the place data fields that you need.
    const autocomplete = new google.maps.places.Autocomplete(input, {
      fields: ["place_id", "geometry", "formatted_address", "name"],
    });
  
    autocomplete.bindTo("bounds", map);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById("infowindow-content");
  
    infowindow.setContent(infowindowContent);
  
    const marker = new google.maps.Marker({ map: map });
  
    marker.addListener("click", () => {
      infowindow.open(map, marker);
    });
    autocomplete.addListener("place_changed", () => {
      infowindow.close();
  
      const place = autocomplete.getPlace();
  
      if (!place.geometry || !place.geometry.location) {
        return;
      }
  
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
  
      // Set the position of the marker using the place ID and location.
      // @ts-ignore This should be in @typings/googlemaps.
      marker.setPlace({
        placeId: place.place_id,
        location: place.geometry.location,
      });
      marker.setVisible(true);
      infowindowContent.children.namedItem("place-name").textContent = place.name;
      infowindowContent.children.namedItem("place-id").textContent =
        place.place_id;
      infowindowContent.children.namedItem("place-address").textContent =
        place.formatted_address;
      infowindow.open(map, marker);
    });
  }
  
  window.initMap = initMap;


/* Get the value from serach box */
searchBtn.addEventListener('click', () =>{
    if(city.value == ''){
        currentLocation()
    }
    else{
        getData()
    }
})


btn.addEventListener('click', () =>{
    if(aside.classList.contains('add')){
        aside.classList.remove('add')
        aside.classList.add('less')
        menu.forEach(item =>{
            item.style.display = 'none'
            item.classList.remove('menu_display') 
        })
    }
    else{
        aside.classList.remove('less')
        aside.classList.add('add')
        menu.forEach(item =>{
            item.style.display = 'block'
            item.classList.add('menu_display')  
        })
    }
    
})
home.addEventListener('click' ,()=>{
    google_map.style.display = "none"
    dash.style.display = 'block'
})
map.addEventListener('click' ,() =>{
    dash.style.display = 'none'
    google_map.style.display = "flex"
})
const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
setInterval(() => {

    const date = new Date()
    const hour = date.getHours()
    const minut = date.getMinutes()
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const week = weekday[date.getDay()]
    if(hour>12){
        var format = hour%12
        document.getElementById('time').innerHTML = `${format}:${minut} <span>PM</span>` 
    } 
    else{
        document.getElementById('time').innerHTML = `0${hour}:${minut} <span>AM</span>` 
    }
    
    document.getElementById('date').innerHTML = `${week}, ${day} ${month} ${year}`
}, 1000);

function getData(){
    let weatherDataPromis = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${API_KEY}&units=metric`)
    weatherDataPromis.then((value) =>{
        return value.json()
    }).then((actualValue) =>{
        temperature.innerHTML = `${actualValue.main.temp}<span>&deg;C</span>`
        climet.innerHTML = `${actualValue.weather[0].main}`
        let sunRiseTime = unixTimeConvert(actualValue.sys.sunrise)
        let sunSetTime = unixTimeConvert(actualValue.sys.sunset)
        sunRise.innerHTML = `sun rise :${sunRiseTime}am`
        sunSet.innerHTML = `sun set :${sunSetTime}pm`
        weatherLocation.innerHTML = `${actualValue.name}`
        weatherLon.innerHTML = `longitude:${actualValue.coord.lon}`
        weatherLat.innerHTML = `latitude:${actualValue.coord.lat}`
        weatherImg.src = `https://openweathermap.org/img/wn/${actualValue.weather[0].icon}.png`
        document.getElementById('max_temp').innerHTML = `${actualValue.main.temp_max} <span>&deg;C </span>`
        document.getElementById('min_temp').innerHTML = `${actualValue.main.temp_min} <span> &deg;C</span>`
        document.getElementById('pressure_value').innerHTML = `${actualValue.main.pressure} <span> hPa</span>`
        document.getElementById('humidity_value').innerHTML = `${actualValue.main.humidity} <span>%rh<span>`
        document.getElementById('wind_value').innerHTML = `${actualValue.wind.speed} <span>m/s<span>`
    })
}

//geting the current location
function currentLocation(){
    const successCallback = (position) => {
        var latitude = position.coords.latitude
        var longitude = position.coords.longitude;
        let getWeatheByLocation = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)

        getWeatheByLocation.then((weatheData) =>{
            return weatheData.json()
        }).then((currentWeather) =>{
            temperature.innerHTML = `${currentWeather.main.temp}<span>&deg;C</span>`
            climet.innerHTML = `${currentWeather.weather[0].main}`
            let sunRiseTime = unixTimeConvert(currentWeather.sys.sunrise)
            let sunSetTime = unixTimeConvert(currentWeather.sys.sunset)
            sunRise.innerHTML = `sun rise :${sunRiseTime}am`
            sunSet.innerHTML = `sun set :${sunSetTime}pm`
            weatherLocation.innerHTML = `${currentWeather.name}`
            weatherLat.innerHTML = `latitude:${currentWeather.coord.lat}`
            weatherLon.innerHTML = `longitude:${currentWeather.coord.lon}`
            weatherImg.src = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`
            document.getElementById('max_temp').innerHTML = `${currentWeather.main.temp_max} <span>&deg;C </span> `
            document.getElementById('min_temp').innerHTML = `${currentWeather.main.temp_min}&nbsp &nbsp <span> &deg;C</span>`
            document.getElementById('pressure_value').innerHTML = `${currentWeather.main.pressure} <span> hPa</span>`
            document.getElementById('humidity_value').innerHTML = `${currentWeather.main.humidity} <span>%rh<span>`
            document.getElementById('wind_value').innerHTML = `${currentWeather.wind.speed} <span>m/s<span>`

            document.getElementById('location').innerHTML = `${currentWeather.name}`
            document.getElementById('lat&lat').innerHTML = `latitude&altitude-${currentWeather.coord.lat}, ${currentWeather.coord.lon}`
            document.getElementById('current_temp').innerHTML = `Temperature -${currentWeather.main.temp}<span>&deg;C</span>`
            document.getElementById('current_press').innerHTML = `Pressure -${currentWeather.main.pressure} <span> hPa</span>`
            document.getElementById('current_hum').innerHTML = `Humidity -${currentWeather.main.humidity} <span>%rh<span>`
            document.getElementById('current_wind').innerHTML = `Wind -${currentWeather.wind.speed} <span>m/s<span>`
            
        })
      };
      
      const errorCallback = (error) => {
        window.alert("Current location not getting...")
      };
      
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}
currentLocation()

document.getElementById('current_location').addEventListener('click' ,() =>{
    currentLocation()
})

function unixTimeConvert(unixtime)
{
let unixTimestamp = unixtime;
 
// Convert to milliseconds and
// then create a new Date object
let dateObj = new Date(unixTimestamp * 1000);
let utcString = dateObj.toUTCString();

let time = utcString.slice(-11, -4);

return time
}
