const appid = `29fb7d33a8b9b2f9a88f032dc6583362`;

export function  getCityWeather(cityName){
   return  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appid}`)
        .then(response => response.json())
}
