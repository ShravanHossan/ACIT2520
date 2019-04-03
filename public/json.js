const fs = require('fs');

const add_password = (username, site, password) => {
    return new Promise((resolve,reject) => {

        if (fs.existsSync('passwords.json') === false) {
            fs.writeFileSync('passwords.json', '{}');
            return JSON.parse(fs.readFileSync('passwords.json'))

        }

        let passwords = JSON.parse(fs.readFileSync('passwords.json'));

        try {
            passwords[username] = {
                site: site,
                password: password
            };


            var string_result = JSON.stringify(passwords, undefined, 2);
            fs.writeFileSync('passwords.json', string_result);
            resolve("Password has been added.")
        }catch (e) {
            throw new Error("Password did not write to database.")

        }
    })
};
add_password().then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
});


module.exports = {
    add_password
};




