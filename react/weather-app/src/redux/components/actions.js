
export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';
export const SEARCH = 'SEARCH';

export const SET_FETCH_INFO = 'SET_FETCH_INFO';
export const FETCH_DATA = {
 FETCH_REQUEST: 'FETCH_REQUEST',
 FETCH_RESPONSE:'FETCH_RESPONSE',
 FETCH_ERROR: 'FETCH_ERROR'
};

export function requestCityData() {
    return {
        type: FETCH_DATA.FETCH_REQUEST
    }
}
export function responseCityData(city) {
    return {
        type: FETCH_DATA.FETCH_RESPONSE,
        city
    }
}
export function errorResponseCityData(notFound) {
    return {
        type: FETCH_DATA.FETCH_ERROR,
        notFound
    }
}
const appid = `29fb7d33a8b9b2f9a88f032dc6583362`;

export function fetchCityData(cityName) {
    return dispatch => {
        dispatch(requestCityData());
        return fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${appid}`)
            .then(response => response.json())
            .then(response => {
                if (response.cod !== '404') {
                    const city = {
                        temp: Math.round(response.main.temp - 273.15),
                        name: response.name,
                        key: response.name,
                        wind: response.wind.speed,
                        pressure: response.main.pressure,
                        humidity: response.main.humidity
                    };
                    dispatch(responseCityData(city));
                } else {
                    dispatch(errorResponseCityData({
                        name: cityName,
                        notFound: 'Город не найден'
                    }));
                }
            })
    }
}

export function addFavorite(city) {
    return {type: ADD_FAVORITE, city}
}

export function removeFavorite(index) {
    return {type: REMOVE_FAVORITE, index}
}
