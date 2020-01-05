import React from 'react';
import ReactDOM from 'react-dom';
import {SearchForm} from "./search";
import {City} from './city';
import {FavoriteCities} from './favorites';

// ReactDOM.render(<SearchForm/>, document.getElementById('root'));
export class App extends React.Component{
    render() {
        return(
            <div>
        <SearchForm />
        {/*<City cityName="Moscow" />*/}
        {/*<FavoriteCities />*/}
            </div>
        )
    }
}
