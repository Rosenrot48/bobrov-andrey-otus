import React from 'react';
import {FavoriteCities} from './favorites';

export class City extends React.Component {
    constructor(props){
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.city !== undefined && this.props.city !== nextProps.city;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.city !== this.props.city) {
            this.getData();
        }
    }
    render() {
        if (this.props.name === undefined || null) {
            return null;
        } else {
            return (
                <div style={{float: 'right'}}>
                <CityName cityName={this.props.name}/>
                <Temperature temp={this.props.temp}/>
                <Wind wind={this.props.wind}/>
                <Pressure pressure={this.props.pressure}/>
                <Humidity humidity={this.props.humidity}/>
                <FavoriteCities favoriteCities={this.props.favoriteCities}/>
            </div>
            )
        }
    }
}
export class Wind extends React.Component {
    render() {
        if (this.props.wind === undefined || null) {
            return null;
        } else {
            return (
                <div>
                    <h4>Скорость ветра: {this.props.wind} м/с</h4>
                </div>
            )
        }
    }
}

export class Humidity extends React.Component{
    render() {
        if (this.props.humidity === undefined || null) {
            return null;
        } else
            return(
                <h4>Влажность: {this.props.humidity}%</h4>
            )
    }
}

export class Temperature extends React.Component {
    render() {
        if (this.props.temp === undefined || null) {
            return null;
        } else {
            return (
                <div>
                    <h3>Температура {this.props.temp} ºC</h3>
                </div>
            )
        }
    }
}
export class CityName extends React.Component {
    render() {
        if (this.props.cityName === undefined || null) {
            return null;
        } else {
            return (
                <div>
                    <h1>Погода в городе: {this.props.cityName}</h1>
                </div>
            )
        }
    }
}
export class Pressure extends React.Component{
    render() {
        if (this.props.pressure === undefined || null) {
            return null;
        } else {
            return (
                <div>
                    <h4>Давление: {this.props.pressure} мм рт.ст</h4>
                </div>
            )
        }
    }
}
