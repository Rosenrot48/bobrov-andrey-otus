import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import {App} from "./component/application";

//Store import
import { createStore } from "redux";
import weatherApp from "./redux/reducers";
import {addFavorite, removeFavorite, search} from "./redux/components/actions";
import App from "./redux/components/views/app";
const store = createStore(weatherApp);

// State Props App
// ReactDOM.render(<App/>, document.getElementById('root'));

console.log(store.getState());
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
const unsub = store.subscribe(() => console.log(store.getState()));


// store.dispatch(search('moscow'));
// store.dispatch(addFavorite(store.getState().city));
// store.dispatch(addFavorite({name: 'Klin', temp: 5}));
// store.dispatch(addFavorite({name: 'London', temp: 15}));
// store.dispatch(removeFavorite(1));
// store.dispatch(removeFavorite(1));

unsub();

// ReactDOM.render(
    {/*<Provider store={store}>*/}
    {/*    <App/>*/}
    // </Provider>
// );
// ReactDOM.render(
//     <Provider store={store}>
//         <App/>
//     </Provider>
// );
