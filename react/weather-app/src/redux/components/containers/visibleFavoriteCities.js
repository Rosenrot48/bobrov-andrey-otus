import React from 'react';
import {removeFavorite, search} from "../actions";
import {connect} from "react-redux";
import FavoriteCities from "../views/favoriteCities";



// const getVisibleFavoriteCities = ({favoriteCities, })
const mapStateToProps = state => {
    return {
        favoriteCities: state.favoriteCities
    }
};

const mapDispatchToProps = dispatch => {
    return{
        onFavoriteClick: favoriteCity => {
            dispatch(search(favoriteCity.name))
        },
        onRemoveClick: id => {
            console.log(id);
            dispatch(removeFavorite(id))
        }
    }
};

const VisibleFavoriteCities = connect(mapStateToProps, mapDispatchToProps)(FavoriteCities);

export default VisibleFavoriteCities;
