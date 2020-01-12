export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';
export const SEARCH = 'SEARCH';


export function search(text) {
    console.log(text);
    return {type: SEARCH, text}
}

export function addFavorite(city) {
    return {type: ADD_FAVORITE, city}
}

export function removeFavorite(index) {
    return {type: REMOVE_FAVORITE, index}
}
