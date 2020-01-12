import React from 'react';


const FavoriteCities = ({favoriteCities, onFavoriteClick, onRemoveClick}) => {
    return(
        <ul>
            {favoriteCities.map((favoriteCity, index) => {
                return(
                    <FavoriteCity key={index} favoriteCity={favoriteCity} index={index} onFavoriteClick={onFavoriteClick} onRemoveClick={onRemoveClick} />
                )
            })}
        </ul>
    );
};


const FavoriteCity = ({favoriteCity, onFavoriteClick, onRemoveClick, index}) => {
    if (favoriteCity) {
        return (
            <li>
                <span
                    onClick={onFavoriteClick(favoriteCity)}>Город: {favoriteCity.name}, погода: {favoriteCity.temp} ºC</span>
                <button onClick={onRemoveClick(index)}>Удалить из избранного</button>
            </li>
        )
    }
};

export default FavoriteCities;
