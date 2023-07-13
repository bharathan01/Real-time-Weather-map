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

let API_KEY = 'PRIVATE_KEY'
/* Get the value from serach box */
searchBtn.addEventListener('click', () =>{
    if(city.value == ''){
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
        document.getElementById('time').innerHTML = `${format}:${minut}` 
    } 
    else{
        document.getElementById('time').innerHTML = `0${hour}:${minut}` 
    }
    
    document.getElementById('date').innerHTML = `${week}, ${day} ${month} ${year}`
}, 1000);

function getData(){
    let weatherDataPromis = fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${API_KEY}&units=metric`)
    weatherDataPromis.then((value) =>{
        return value.json()
    }).then((actualValue) =>{
        console.log(actualValue.main.temp)
        temperature.innerHTML = `${actualValue.main.temp}<span>&deg;C</span>`
        climet.innerHTML = `${actualValue.weather[0].main}`

        let sunRiseTime = unixTimeConvert(actualValue.sys.sunrise)
        let sunSetTime = unixTimeConvert(actualValue.sys.sunset)
        sunRise.innerHTML = `sun rise :${sunRiseTime}am`
        sunSet.innerHTML = `sun set :${sunSetTime}pm`
    })
}

//geting the current location
function currentLocation(){
    const successCallback = (position) => {
        console.log(position);
      };
      
      const errorCallback = (error) => {
        console.log(error);
      };
      
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}


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
