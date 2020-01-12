import React from 'react';

//{name, temp, wind, pressure,humidity}
const City = ({city, onCityClick}) => {
    if (!city) {
        return null;
    }
    return(
    <div>
        <br />
        <CityName name={city.name}/>
        <Temperature temp={city.temp}/>
        <Wind wind={city.wind}/>
        <Pressure pressure={city.pressure}/>
        <Humidity humidity={city.humidity}/>
        <AddButton name={city.name} onClick={() => onCityClick({name: city.name, temp: city.temp})}/>
    </div>
    )
};

const CityName = ({name}) => {
    if (!name) {
        return null;
    } else {
        return (
            <div>
                <h1>Погода в городе: {name}</h1>
            </div>
        )
    }
};

const Wind = ({wind}) => {
    if (!wind) {
        return null;
    } else {
        return (
            <div>
                <h4>Скорость ветра: {wind} м/с</h4>
            </div>
        )
    }
};

const Temperature = ({temp}) => {
    // if (!temp) {
    //     return null;
    // } else {
        return (
            <div>
                <h4>Температура {temp} ºC</h4>
            </div>
        )
    // }
};

const Humidity = ({humidity}) => {
    if (!humidity) {
        return null;
    } else {
        return (
            <div>
                <h4>Влажность: {humidity} %</h4>
            </div>
        )
    }
};
const Pressure = ({pressure}) => {
    if (!pressure) {
        return null;
    } else {
        return(
        <div>
            <h4>Давление: {pressure} мм рт.ст.</h4>
        </div>
        )
    }
};
const AddButton = ({name, onClick}) => {
    if (!name) {
        return;
    }
    return(
        <div>
            <button onClick={onClick}>Добавить в избранное</button>
        </div>
    )
};

export default City;
