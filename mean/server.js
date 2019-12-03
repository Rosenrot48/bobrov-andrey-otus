const express = require('express');
const app = express();

const persons = [];
    // {
    // person: {
    //     id: 1,
    //     name: 'Ivan',
    //     age: 15
    // },]
// app.get('/best/:id?', function (req,res) {
//     // res.send(req.query.name + ' the best');
//     req.params.id ?  res.send('Best men at id - ' + req.params.id) :
//     res.send('Noone is the best');
// });
app.get('/all', (req,res) => {res.send(persons);});
app.get('/person/:id', (req,res) => {
    res.send(persons[req.params.id])
});
app.get('/create', (req,res) => {
    const person = {id: persons.length, name: req.query.name, age: req.query.age};
    persons.push(person);
    res.send(person);
})
app.listen(5500);
