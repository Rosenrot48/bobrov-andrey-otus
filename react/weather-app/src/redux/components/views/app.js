import React from 'react';
import SearchForm from "../containers/search";
import City from './city';
import FavoriteCities from "./favoriteCities";
import VisibleCity from "../containers/visibleCity";
import VisibleFavoriteCities from "../containers/visibleFavoriteCities";

const App = () => (
    <div>
        <SearchForm/>
        <VisibleCity/>
        <VisibleFavoriteCities/>
    </div>
);

export default App;
