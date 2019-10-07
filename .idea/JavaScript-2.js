async function promiseReduce(asyncFunctions, reduce, initialValue) {
  var initialdata = Promise.resolve(1);
  asyncFunctions.forEach(
    response => {
      initialdata = initialdata.then(
        async firstData => {
          return reduce(firstData, await response()) * initialValue;
        })
    })
}


const func1 = () => Promise.resolve(2);
const func2 = () => new Promise(resolve => {
  setTimeout(() => resolve(4), 1000);
});

promiseReduce([func1,func2], (memo, value) => memo * value, 88);


