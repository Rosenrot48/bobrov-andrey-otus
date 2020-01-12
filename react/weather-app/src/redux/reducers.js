import {
    ADD_FAVORITE,
    REMOVE_FAVORITE,
    SEARCH
} from "./components/actions";
import {combineReducers} from "redux";


// export const buttons = (state = null, action) => {
//     switch (action.type) {
//         /* В случае, когда кнопка является кнопкой добавления в избранное,
//         * то мы возьмем state и action, и вернём обратно объект с добавленным объектом город */
//         case ADD_FAVORITE:
//             return Object.assign({}, state, {
//                 favoriteCities: [
//                     ...state.favoriteCities,
//                     action.city
//                 ]
//             });
//             // return state + action.favorites;
//         // case REMOVE_FAVORITE:
//         //     return
//         default:
//             return state;
//     }
// };

// const initialState = {
//
// };
// TODO - разобраться с redux-thunk и делать тут запросы в API, получать данные и добавлять в state.city данные
function search(state = null, action) {
    switch (action.type) {
        case SEARCH:
            const city = {
                name: 'Moscow',
                temp: -4,
                wind: '4 мс'
            };
            if (action.text === city.name.toLowerCase()) {
                console.log(city);
                return city;
            }
        default:
            return state;
    }
}

function favorites(state = [], action) {
    switch (action.type) {
        case ADD_FAVORITE:
            console.log(action);
            return [
                ...state,
                action.city
            ];
        case REMOVE_FAVORITE:
            console.log(state);
            if (action.index < state.length) {
                const nextState = state;
                console.log(nextState);
                nextState.splice(action.index, 1);
                console.log(nextState);
                return nextState;
            } else {
                console.log('Объект не найден в массиве избранных городов, проверьте входные данные');
            }
            // const st =  state.map((city, index) => {
            //     if (index === action.index) {
            //         const nextState = state;
            //         nextState.splice(index, 1);
            //         console.log(nextState);
            //         return nextState;
            //         // return  state.splice(index, 1);
            //     } else {
            //         console.log('Объект не найден в массиве избранных городов, проверьте входные данные');
            //         return state;
            //     }
            // });
            // console.log(st);
            // return st;
        // case SEARCH:
            
        default:
            return state
    }

}

// function weatherApp(state = [], action) {
//     switch (action.type) {
//         case ADD_FAVORITE:
//             return Object.assign({}, state, {
//                 favoriteCities: favorites(state.favoriteCities, action)
//             });
//         case REMOVE_FAVORITE:
//             return Object.assign({}, state, {
//                 favoriteCities: favorites(state.favoriteCities, action)
//             });
//         default:
//             return state
//     }
// }
// function weatherApp(state = {}, action) {
//     return {
//         city: search(state.city, action),
//         favoriteCities: favorites(state.favoriteCities, action)
//     }
// }

const weatherApp = combineReducers({
    city: search,
    favoriteCities: favorites
});

export default weatherApp;

