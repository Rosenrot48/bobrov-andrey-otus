const { Router } = require('express');

const router = Router();
const path = require('path');

const { querySelect, validateWhere, validateValue } = require(path.resolve(__dirname, '..', 'services', 'db.service'));

const toTimestamp = (value) => {
    if (!value) return value
    const [operator, v] = value.split('.');
    return operator + '.' + 'timestamp\'' + v + '\'';
}

const toLexeme = (value) => {
    if (!value) return value
    const [_, v] = value.split('.');
    return ' @@ plainto_tsquery(\'' + v +'\')';
}

router.get('/query', (req, res) => {
    const {company, limit, offset, fare, tripStart, conj} = req.query;

    const query =
        'select * from trips' +
        validateWhere(
            {
                'lexeme_company': validateValue(toLexeme(company)),
                fare: validateValue(fare),
                'trip_start_timestamp': validateValue(toTimestamp(tripStart))
            }, conj
        ) + ' limit ' + (!!limit ? limit : '20')
          + ' offset ' + (!!offset ? offset : '0');

    querySelect(query).then(result => {
        res.json(result);
    }).catch(error => {
        console.log(error);
        res.status(500).send(error);
    })
});





module.exports = router;

