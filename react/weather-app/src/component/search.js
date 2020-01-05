import React from 'react';
import {getCityWeather} from '../service/openweathermap';
import {Clock} from '../component/clock';
import {City} from "./city";
const appTitle = <h1>Погода</h1>;

export class SearchForm extends React.Component{

    constructor(props) {
        super(props);
        this.state = {temp: null};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.input = React.createRef();
    }
    handleSubmit(event) {
            getCityWeather(this.input.current.value)
                .then(response => {
                    //TODO key, name, temperature, wind
                    this.setState({
                        temp: Math.round(response.main.temp - 273.15),
                        name: response.name,
                        key: response.name,
                        wind: response.wind.speed,
                        pressure: response.main.pressure,
                        humidity: response.main.humidity

                    });
                });
        event.preventDefault();
    }

    render() {
        return(
            <div>
                {appTitle}
                <Clock />
                <form onSubmit={this.handleSubmit}>
                <label>Укажите город:&nbsp;
                    <input type="text" ref={this.input}/>
                </label>
                <button onClick={this.handleSubmit}>
                    Найти
                </button>
            </form>
                <City key={this.state.key} name={this.state.name} temp={this.state.temp} wind={this.state.wind}
                pressure={this.state.pressure} />
            </div>
        )
    }
}
setInterval(SearchForm.render, 1000);
