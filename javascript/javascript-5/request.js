const url = 'http://127.0.0.1:7000';
const readline = require('readline');
// let requestsCount = 0;
async function requestToServer(requestsCount, isAsync) {
    for (let i =1; i < requestsCount+1; i++) {
        if (isAsync === false) {
            await request();
        } else {
            request();
        }
    }
}

function request() {
    return new Promise((resolve) => {
        require('request')(url, function (error, response, body) {
            console.log(body);
            resolve()
        });
    })
}
const read =  readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// requestToServer(5,false);
read.question(`Укажите количество запросов на сервер `, (answer) => {
    read.question(`Укажите тип запросов (асинхронные или синхронные) `, answer1 => {
       const requestsCount = answer;
        let isAsync = null;
        if (answer1 === 'асинхронные') {
         isAsync = true;
        } else if (answer1 === 'синхронные') {
         isAsync = false;
        } else {
            isAsync = answer1;
        }
        requestToServer(requestsCount, isAsync);
        read.close();
    });
});
