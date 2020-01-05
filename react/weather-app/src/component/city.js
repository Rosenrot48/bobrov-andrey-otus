import React from 'react';
import cityStyle from './cityStyle.css';

export class City extends React.Component {
    favoritesArray = [];
    constructor(props){
        super(props);
        const city = this.props.city;
        this.addToFavorites = this.addToFavorites.bind(this);
        console.log(city);
    }
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
        return(
            <div className={cityStyle.style}>
                <CityName cityName={this.props.name} />
                <Temperature temp={this.props.temp} />
                <Wind wind={this.props.wind} />
                <Pressure pressure={this.props.pressure} />
                <Humidity humidity={this.props.humidity} />
                <AddButton favorite={this.props.name} />
                {/*<button onClick={this.addToFavorites}>Добавить в избранное</button>*/}
            </div>
        )
    }
}
export class Wind extends React.Component {
    // temp = <h3> </h3>;
    constructor(props) {
        super(props);
    }
    render() {
        return(
        <div>
            <h4>Скорость ветра: {this.props.wind} м/с</h4>
        </div>
        )
    }

}

export class Humidity extends React.Component{
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <h4>Влажность: {this.props.humidity}</h4>
        )
    }
}

export class Temperature extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log(this.temp);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.temp !== this.props.temp) {
            this.setState({temp : 'Температура ' + this.props.temp + 'ºC'});
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return (this.props.temp !== nextProps.temp && nextProps.temp !== undefined);
    }

    render() {
            return (
                <div>
                <h3>Температура {this.props.temp} ºC</h3>
                </div>
            )
    }
}
export class CityName extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div>
            <h1>Погода в городе: {this.props.cityName}</h1>
            </div>
        )
    }
}
export class Pressure extends React.Component{
    constructor(props){
        super(props);
    }

    render() {
        return(
            <div>
                <h4>Давление: {this.props.pressure} мм рт.ст</h4>
            </div>
        )
    }
}
export class AddButton extends React.Component{
    constructor(props) {
        super(props);
        this.showFavorites = this.showFavorites.bind(this);
    }
    showFavorites() {
        console.log(this.props.favorite);
    }
    render() {
        return(
            <button onClick={this.showFavorites}>Добавить в избранное </button>
                )
        }
}
