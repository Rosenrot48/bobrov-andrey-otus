// 1) нужна промежуточная переменная, которая будет хранить данные для перемножения
// 2) сделать подписку на promise, ждать получения данных, передевать их в функцию reduce вторым аргументом

async function promiseReduce( asyncFunctions, reduce, initialValue) {
  var initialInputData = Promise.resolve(initialValue);
  asyncFunctions.forEach( async promise =>
    {
      console.log(await promise());
       // const promiseResult = await promise();
      initialValue = reduce(initialValue, await promise());
      console.log(initialValue);
      return initialValue;
    })
}


const func1 = () => Promise.resolve(2);
const func2 = () => new Promise(resolve => {
  setTimeout(() => resolve(4), 1000);
});

promiseReduce([func1,func2], (memo, value) => memo * value, 88);


