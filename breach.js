const axios = require('axios');
const crypto = require('crypto');


const passwords_breach_lookup = (password) => {
    return new Promise((resolve, reject) =>  {

        let hashed_password = crypto.createHash('sha1').update(JSON.stringify((password))).digest('hex').toUpperCase();
        console.log(hashed_password);
        console.log(hashed_password.substring(0, 5));
        let hash_list = axios.get(`https://api.pwnedpasswords.com/range/${hashed_password.substring(0, 5)}`);

        hash_list.then(result => {
        let list = {Passwords: (result.data).split(`\r\n`)};

        for (line in list.Passwords){
            if (hashed_password === line.substring(5))

                console.log('success');
            console.log(list.Passwords[line])
        }
        // console.log("Result: ",list.Passwords)
    }).catch(err => {
        console.log("Error: ", err)
    });
})};

passwords_breach_lookup("Password").then(result => {
    console.log(result)
}).catch(err => [
    console.log(err)
]);