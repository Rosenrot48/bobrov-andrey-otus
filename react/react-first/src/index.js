import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import App from "./App";
import travel from './travel.jpeg'


const TravelCompanyLink = () => <a href="http://localhost:3000">Travel Company</a>;

function timer() {
    const scheduler = (
        <div className="scheduler" style={{ backgroundImage:`url(${travel})`}}>
            <h1>Travel scheduler</h1>
            <ul>
                <li>6 a.m. - Munich</li>
                <li>9 a.m. - Paris</li>
                <li>2 p.m. - Rome</li>
                <li>10 p.m. - Tokyo</li>
            </ul>

            <h2>Time now: {new Date().toLocaleTimeString()}</h2>
            <TravelCompanyLink/>
            <App/>
        </div>
    );
    ReactDOM.render(scheduler, document.getElementById('root'));
}
// const timer = () => {
//     ReactDOM.render(scheduler, document.getElementById('root'));
// }
setInterval(timer, 1000);

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
