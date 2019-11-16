const url = 'http://127.0.0.1:7000'

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
requestToServer(5,false);
