import  React from 'react';
import {getCityWeather} from "../service/openweathermap";
import {City} from "./city";

export class FavoriteCities extends React.Component {
    constructor(props) {
        super(props);
        this.showFavorites = this.showFavorites.bind(this);
        this.state = {
            favoriteCitiesArray: ['Moscow', 'Rome', 'Minsk', 'Paris']
        }
    }
    showFavorites = (name) => {
        console.log(name);
        getCityWeather(name)
            .then(response => {
                // console.log(response.json());
            })
    }

    render() {
        const items = this.state.favoriteCitiesArray.map((value, index) =>
        {
            return <button onClick={this.showFavorites(value)} key={index}>{value}</button>

            // return <City cityName={value} />
            // return <li onClick={this.showFavorites(value)} key={index}>{value}</li>
        });
        return(
            <div>
                    {items}
                    {/*{this.state.favoriteCitiesArray.map((value, index) =>*/}
                    {/*{*/}
                    {/*    return <li onClick={this.showFavorites(value)} key={index}>{value}</li>*/}
                    {/*})}*/}
                    {/*<li onClick={getCityWeather('Moscow')}>Moscow</li>*/}
                    {/*<li onClick={getCityWeather('Rome')}>Rome</li>*/}
                    {/*<li onClick={getCityWeather('Minsk')}>Minsk</li>*/}
                    {/*<li onClick={getCityWeather('Paris')}>Paris</li>*/}
            </div>
        )
    }
}
