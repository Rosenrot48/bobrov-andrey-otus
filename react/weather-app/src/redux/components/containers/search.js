import React from 'react';
// import PropTypes from 'prop-types';
import {search} from "../actions";
import {connect} from 'react-redux';

//<form>
//                 <label>Укажите город:&nbsp; </label>
//                     <input ref={this.input} type="text"/>
//                 <button onClick={this.handleSubmit}>
//                     Найти
//                 </button>
//                     <button onClick={this.handleAddFavorite}>
//                         Добавить в избранное
//                     </button>
//             </form>

{/*<form>*/}
{/*    <label>Укажите город: </label>*/}
{/*        <input ref={input} type="text" />*/}
// {/*</form>
let SearchForm = ({dispatch}) => {
    let input;

    return (
        <div>
            <form onSubmit={ e=> {
                e.preventDefault();
                if (!input.value.trim()) {
                    return;
                }
                dispatch(search(input.value));
                input.value = '';
            }}>
                <input ref={node => {
                    input = node
                }} />
                <button type="submit"> Найти </button>
            </form>
        </div>
    )
};
SearchForm = connect()(SearchForm);

export default SearchForm;
