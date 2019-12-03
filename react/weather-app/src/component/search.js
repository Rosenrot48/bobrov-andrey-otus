// import React from 'react';
const fetch = require("node-fetch");


const weather = async name => {
    return (
    await fetch('http://api.openweathermap.org/data/2.5/weather?q='+name+'&APPID=8505bf024d54eacace4c7ae721f57dae')
        .then(response => {
            console.log(response);
        })
)
};

// function weatherFind() {
//     return (
//         <div  style={{ align: 'center'}}>
//             <button onClick={weather('London')}> Weather </button>
//         </div>
//     )
// }
//
// export default weatherFind;
// export default weather('London');
weather('London');
