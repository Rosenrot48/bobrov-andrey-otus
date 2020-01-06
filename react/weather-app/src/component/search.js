import React from 'react';
import {getCityWeather} from '../service/openweathermap';
import {City} from "./city";
import {FavoriteCities} from "./favorites";
const appTitle =
    <div>
    <h1>Погода</h1>
    </div>;

export class SearchForm extends React.Component{
    favoriteCities = [];
    constructor(props) {
        super(props);
        this.state = {key: null};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddFavorite = this.handleAddFavorite.bind(this);
        this.input = React.createRef();
    }
    handleAddFavorite(event){
        const favorite = {
            name: this.state.name,
            temp: this.state.temp
        };
            this.favoriteCities.push(favorite);
            console.log(this.favoriteCities);
            this.setState(
                { favoriteCities: this.favoriteCities }
            );
        event.preventDefault();
    }
    handleSubmit(event) {
        if (this.input.current.value.trim() === '') {
            console.log('Поле для ввода пустое. Введите значение!');
        } else {
            if (this.state.request === this.input.current.value) {
                console.log('Этот запрос уже обработан и выведен на экран');
            } else {
                getCityWeather(this.input.current.value)
                    .then(response => {
                        console.log(response);
                        if (response.cod === "404") {
                            console.log("Такой город не найден");
                        } else {
                            this.setState({
                                request: this.input.current.value,
                                temp: Math.round(response.main.temp - 273.15),
                                name: response.name,
                                key: response.name,
                                wind: response.wind.speed,
                                pressure: response.main.pressure,
                                humidity: response.main.humidity
                            });
                            console.log(this.state);
                        }
                    });
            }
        }
        event.preventDefault();
    }

    render() {
        //                    <input type="text" ref={this.input}/>
        return(
            <div>
                <div>
                {appTitle}
                <form>
                <label>Укажите город:&nbsp; </label>
                    <input ref={this.input} type="text"/>
                <button onClick={this.handleSubmit}>
                    Найти
                </button>
                    <button onClick={this.handleAddFavorite}>
                        Добавить в избранное
                    </button>
            </form>

                <City key={this.state.key} name={this.state.name} temp={this.state.temp} wind={this.state.wind}
                pressure={this.state.pressure} humidity={this.state.humidity} />
                </div>
                <div style={{float: 'left'}}>
                    <FavoriteCities favoriteCities={this.state.favoriteCities} />
                </div>
            </div>
        )
    }
}
