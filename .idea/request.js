function requestServer(requestCount, isAsynch) {
    if (isAsynch === false) {
        for (let i = 1; i < requestCount + 1; i++) {
            require('request')("http://127.0.0.1:7000", function (error, res, body) {
                // console.log(res);
                console.log(body);
                console.log(new Date(Date.now()));
            })
        }
    } else {
        if (requestCount > 0) {
            require('request')("http://127.0.0.1:7000", function (error, res, body) {
                // console.log(res);
                console.log(body);
                console.log(new Date(Date.now()));
                return requestServer(--requestCount, true);
            })
        }
    }
}
requestServer(5,false);
