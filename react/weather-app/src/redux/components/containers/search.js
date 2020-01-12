import React from 'react';
// import PropTypes from 'prop-types';
import {fetchCityData} from "../actions";
import {connect} from 'react-redux';
import {Clock} from "../views/clock";

let SearchForm = ({dispatch}) => {
    let input;

    return (
        <div>
            <h1> Погода </h1>
            <form onSubmit={ e=> {
                e.preventDefault();
                if (!input.value.trim()) {
                    return;
                }
                dispatch(fetchCityData(input.value));
                input.value = null;
            }}>
                <input ref={node => {
                    input = node
                }} placeholder="Укажите город для поиска..." />
                <button type="submit"> Найти </button>
            </form>
            <Clock/>
        </div>
    )
};
SearchForm = connect()(SearchForm);

export default SearchForm;
