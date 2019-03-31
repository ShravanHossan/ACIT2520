const axios = require('axios');
const crypto = require('crypto');

const passwords_breach_lookup = (password) => {
    return new Promise((resolve, reject) =>  {

        const hash = crypto.createHash('sha1');
        try {
            let data = hash.update(password, 'utf-8');


            let hashed_password = data.digest('hex').toUpperCase();


            let hash_list = axios.get(`https://api.pwnedpasswords.com/range/${hashed_password.substring(0, 5)}`);

            hash_list.then(result => {
            let list = {Passwords: (result.data).split(`\r\n`)};


            for (let line in list.Passwords){

                if (hashed_password.substring(5, 40) === list.Passwords[line].substring(0, 35))

                    resolve(`Password: ${password} was found ${list.Passwords[line].substring(36,50)} times (hash : ${hashed_password})`)
            }

            resolve(`${password} was not found`)



        }).catch(err => {
            reject("Error: ", err)
        });
        }
        catch (e) {
            reject(`Password ${password} is invalid`)
        }
})};

passwords_breach_lookup("123456").then(result => {
    console.log(result)
}).catch(err => [
    console.log(err)
]);
module.exports = {
    passwords_breach_lookup
};