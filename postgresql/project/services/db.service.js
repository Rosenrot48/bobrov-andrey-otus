const pgp = require('pg-promise')();

let db;

const validateValue = (param) => {
    if (!param || !param.includes('.')) {
        return param;
    }
    const [operator, value] = param.split('.');
    if (operator === 'equals') {
        return ' = ' + value;
    } else if (operator === 'contains') {
        return ' like \'%' + value + '%\'';
    } else if (operator === 'moreThan') {
        return ' > ' + value;
    } else if (operator === 'lessThan') {
        return ' < ' + value;
    } else if (operator === 'moreOrEqualThan') {
        return ' >= ' + value;
    } else if (operator === 'lessOrEqualThan') {
        return ' <= ' + value;
    } else {
        return value ? ' is not null ' : ' is null ';
    }
}

const initDb = (dbUrl) => {
    console.log(Date.now().toString(), 'DB url: ', dbUrl)
    db = pgp(dbUrl);
}

const querySelect = (query) => {

    console.log(Date.now().toString(), 'Query:', query);

    return db.any(query);
}

const validateWhere = (conditions, conjuction) => {
    const keys = conditions ? Object.keys(conditions).filter(key => !!conditions[key]) : [];

    if (!keys.length) {
        return '';
    }

    const conj = (a, b) => a + ' and ' + b;

    const disj = (a, b) => a + ' or ' + b;

    return ' where ' + keys.map(key => `${key} ${conditions[key]}`).reduce(conjuction ? conj : disj);

}

const validateConditions = (conditions) => {
    if (conditions) {
        Object.keys(conditions).forEach(key => conditions[key] = validateValue(conditions[key]));
    }
    return conditions;
}

module.exports = {
    initDb,
    querySelect,
    validateWhere,
    validateConditions,
    validateValue
}
