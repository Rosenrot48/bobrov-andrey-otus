import React from 'react';
import cityStyle from './cityStyle.css';
import {FavoriteCities} from './favorites';

export class City extends React.Component {
    constructor(props){
        super(props);
        this.addToFavorites = this.addToFavorites.bind(this);
    }
    // static getDerivedStateFromProps() {

    // }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.city !== undefined && this.props.city !== nextProps.city;
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.city !== this.props.city) {
            this.getData();
        }
    }
    addToFavorites() {
        this.favoritesArray.push(this.props.name);
        console.log(this.props.name);
        console.log(this.favoritesArray);
    }
    render() {
        if (this.props.name === undefined || null) {
            return null;
        } else {
        //                <div style={{position: 'absolute', top: '50%', left: '50%', backgroundColor: 'bisque'}}>
            return (
                <div style={{float: 'right'}}>
                <CityName className={cityStyle.cityName} cityName={this.props.name}/>
                <Temperature temp={this.props.temp}/>
                <Wind wind={this.props.wind}/>
                <Pressure pressure={this.props.pressure}/>
                <Humidity humidity={this.props.humidity}/>
            {/*<AddButton favorite={this.props.name} />*/}
                <FavoriteCities favoriteCities={this.props.favoriteCities}/>
                    {/*<button onClick={this.addToFavorites}>Добавить в избранное</button>*/}
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
// export class AddButton extends React.Component{
//     favoritesArray = [];
//     constructor(props) {
//         super(props);
//         this.state = {favoriteCities: []};
//         this.showFavorites = this.showFavorites.bind(this);
//     }
//     shouldComponentUpdate(nextProps, nextState, nextContext) {
//         return (this.props.favoriteCities !== nextProps.favoriteCities);
//     }
//
//     componentDidUpdate(prevProps, prevState, snapshot) {
//         if (prevProps.favorite !== this.props.favorite) {
//             const arr =  this.state.favoriteCities;
//             console.log(arr);
//             arr.push(this.props.favorite);
//             this.setState({favoriteCities: arr});
//         }
//     }
//
//     showFavorites() {
//         this.favoritesArray.push(this.props.favorite);
//         console.log(this.state.favoriteCities);
//         // this.setState({favoriteCity: this.props.favorite});
//         // console.log(this.state);
//     }
//     render() {
//         return(
//             <button onClick={this.showFavorites}>Добавить в избранное </button>
//                 )
//         }
// }
