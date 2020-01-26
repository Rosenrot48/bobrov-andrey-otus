import React from 'react';
import SearchForm from "../containers/search";
// import City from './city';
// import FavoriteCities from "./favoriteCities";
import VisibleCity from "../containers/visibleCity";
import VisibleFavoriteCities from "../containers/visibleFavoriteCities";

const App = () => (
    <div>
        <div style={{marginLeft: '10px'}}>
        <SearchForm/>
        </div>
        <div style={{float: 'left', marginLeft: '10px'}}>
        <VisibleCity/>
        </div>
        <div style={{float: 'right', marginRight: '10px'}}>
        <VisibleFavoriteCities/>
        </div>
    </div>
);

export default App;
