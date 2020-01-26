import  React from 'react';

export class FavoriteCities extends React.Component {
    constructor(props) {
        super(props);
        this.renderCities = this.renderCities.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
    }
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevProps.favoriteCities !== this.props.favoriteCities) {
    //
    //     }
    // }

    renderCities() {
        const citiesItem = [];
        for (let i=0; i < this.props.favoriteCities.length; i++) {
            citiesItem.push(
                <div key={i}>
                    <li>Город: {this.props.favoriteCities[i].name}, погода: {this.props.favoriteCities[i].temp} ºC </li>
                    <br />
                </div>
            );
        }
        return citiesItem;
    }


    render() {
        if ((this.props.favoriteCities !== undefined || null) && this.props.favoriteCities.length !== 0) {
            return (
                    <div>
                        <h2>Мои избранные города</h2>
                        {this.renderCities()}
                    </div>
                )
        } else {
            return null;
        }
    }
}
