import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import {App} from "./component/application";

//Store import
import {applyMiddleware, createStore} from "redux";
import weatherApp from "./redux/reducers";
// import {addFavorite, fetchCityData, removeFavorite, search} from "./redux/components/actions";
import thunk from 'redux-thunk';
import App from "./redux/components/views/app";
const store = createStore(weatherApp, applyMiddleware(thunk));

// State Props App
// ReactDOM.render(<App/>, document.getElementById('root'));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
const unsub = store.subscribe(() => console.log(store.getState()));


unsub();

