const city = document.getElementById('city')
const search = document.querySelector('.search-btn')
const select = document.querySelector('.select')
const content = document.querySelector('.wrapper')
const datalist = document.getElementById('cities')

let nameOfCity;
let nameOfState;
let nameOfCountry;

const urlListCity = (value) => `http://api.openweathermap.org/geo/1.0/direct?q=${value || 'Kyiv, UA'}&limit=5&appid=a120d227b105aa9b6888ff0b3fbc86a5`
const urlCity = (value) => `http://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=1&appid=a120d227b105aa9b6888ff0b3fbc86a5`
const urlWeather = (lat,lon) => `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=a120d227b105aa9b6888ff0b3fbc86a5`

search.addEventListener('click', () => infoOfCity())
city.addEventListener('input', () => {
    fetch(urlListCity(city.value))
    .then(response => response.json())
    .then(json => {
        datalist.innerHTML = listOfCity(json)
    })
    .catch(error => console.log(error.message))
})

const infoOfCity = () => {
    fetch(urlCity(city.value))
    .then(response => response.json())
    .then(json => {
        console.log(json)
        nameOfCity = json[0].name
        nameOfState = json[0].state ?? json[0].name
        nameOfCountry = json[0].country
        select.innerHTML = `Selected: ${nameOfCity}, ${nameOfState}, ${nameOfCountry}`
        infoOfWeather(json[0].lat,json[0].lon)
    })
    .catch(() => select.innerHTML = "Invalid name of city" )
}

const infoOfWeather = (lat,lon) => {
    fetch(urlWeather(lat,lon))
        .then(response => response.json())
        .then(json => content.innerHTML = createTemplate(json))
        .catch(error => content.innerHTML = error.message)}

const getDay = (json,i) => {
    const days = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    const dt = json.daily[i].dt + "000"
    const day = new Date(+dt).getDay()
    return days[day]
}

const getOtherWeather = (json) => {
    let template = ''
    for(i=0;i < 5;i++){
        template += `
            <div class="other">
                <h3 class="day">${getDay(json,i)}</h3>
                <img src="http://openweathermap.org/img/wn/${json.daily[i].weather[0].icon}@2x.png" alt="">
                <p class="weather">${json.daily[i].weather[0].main}</p>
                <div class="min-max">
                    <span class="min">${Math.round(json.daily[i].temp.min)}&degС</span>
                    <span class="max">${Math.round(json.daily[i].temp.max)}&degС</span>
                </div>
            </div>`
    }
    return template
}

const listOfCity = json => {
    let template = ''
    for(i=0;i < json.length ;i++){
        template += `
            <option value="${json[i].name}, ${json[i].state ?? json[i].name},  ${json[i].country}">
            `
    }
    return template
}

const createTemplate = json => {
    return template = `
    <div class="content">
        <div class="header">
            <div class="main-tmp">
                <h1 class="current-tmp">${Math.round(json.current.temp)}&degС</h1>
                <p class="feel-tmp">Feels like <span id="feelTmp">${Math.round(json.current.feels_like)}&degС</span></p>
            </div>
            <div class="weathers">
                <p class="weather">${json.current.weather[0].main}</p>
                <p class="weatherOfCity">${nameOfCity}, ${nameOfState}, ${nameOfCountry}</p>
            </div>
            <img src="http://openweathermap.org/img/wn/${json.current.weather[0].icon}@2x.png" alt="">
        </div> 
        ${getOtherWeather(json)}
    </div> `
}