const axios = require('axios');
var passowrd = axios.get('https://api.pwnedpasswords.com/range/FA224');

passowrd.then(result => {
    let list = {Passwords: (result.data).split(`\r\n`)};

    for (line in list.Passwords){
        console.log(list.Passwords[line])
    }
    // console.log("Result: ",list.Passwords)
}).catch(err => {
    console.log("Error: ", err)
});