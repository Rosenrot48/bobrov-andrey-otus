import {ADD_FAVORITE, REMOVE_FAVORITE, FETCH_DATA} from "./components/actions";
import {combineReducers} from "redux";
function fetch(state = null, action) {
    switch (action.type) {
        case FETCH_DATA.FETCH_REQUEST:
            return state;
            // return Object.assign({}, action.isFetched, action.city);
            // console.log('hello');
            // return Object.assign({}, state, {
            //     isFetched: true,
            //     state
                // city: null
            // });
        case FETCH_DATA.FETCH_RESPONSE:
            return Object.assign({},
                {
                    isFetched: false,
                }, action.city);

        case FETCH_DATA.FETCH_ERROR:
            return Object.assign({},
                {isFetched: false},
                action.notFound);
            // return action.city;
        default:
            return state;
    }
}

function favorites(state = [], action) {
    switch (action.type) {
        case ADD_FAVORITE:
            return [
                ...state,
                action.city
            ];
        case REMOVE_FAVORITE:
            if (action.index < state.length) {
                return [
                    ...state.filter((item, index) => index !== action.index)
                ];
            } else {
                console.log('Объект не найден в массиве избранных городов, проверьте входные данные');
            }
        default:
            return state
    }
}
const weatherApp = combineReducers({
    city: fetch,
    favoriteCities: favorites
});

export default weatherApp;

