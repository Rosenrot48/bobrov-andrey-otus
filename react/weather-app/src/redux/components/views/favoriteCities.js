import React from 'react';


const FavoriteCities = ({favoriteCities, onFavoriteClick, onRemoveClick}) => {
    if (favoriteCities.length === 0) {
        return null;
    }
        return (
            <div>
                <h2>Мои любимые города</h2>
                <ul>
                    {favoriteCities.map((favoriteCity, index) => {
                        return (
                            <FavoriteCity key={index} favoriteCity={favoriteCity} index={index}
                                          onFavoriteClick={onFavoriteClick} onRemoveClick={onRemoveClick}/>
                        )
                    })}
                </ul>
            </div>
        );
};


const FavoriteCity = ({favoriteCity, onFavoriteClick, onRemoveClick, index}) => {
    if (favoriteCity) {
        return (
            <div>
            <li>
                <span
                    onClick={() => onFavoriteClick(favoriteCity)}>Город: {favoriteCity.name}, погода: {favoriteCity.temp} ºC</span>
                <button onClick={() => onRemoveClick(index)}>Удалить из <br />избранного </button>
                <br />
            </li>
            </div>
        )
    }
};

export default FavoriteCities;
