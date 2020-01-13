import {fetchCityData, removeFavorite} from "../actions";
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
            dispatch(fetchCityData(favoriteCity.name))
        },
        onRemoveClick: id => {
            dispatch(removeFavorite(id))
        }
    }
};

const VisibleFavoriteCities = connect(mapStateToProps, mapDispatchToProps)(FavoriteCities);

export default VisibleFavoriteCities;
