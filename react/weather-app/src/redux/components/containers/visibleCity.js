import {connect} from "react-redux";
import City from "../views/city";
import {addFavorite} from "../actions";


const mapStateToProps = state => {
    return {
        city: state.city
    }
};
const mapDispatchToProps = (dispatch, state) => {
    return {
         onCityClick: city => {
            dispatch(addFavorite(city))
        }
    }
};

const VisibleCity = connect(mapStateToProps, mapDispatchToProps)(City);
export default VisibleCity;
