const fs = require('fs');

const add_password = (username, site, password) => {
    return new Promise((resolve,reject) => {

        if (fs.existsSync('passwords.json') === false) {
            fs.writeFileSync('passwords.json', '{}');
        }

        let passwords = JSON.parse(fs.readFileSync('passwords.json'));
        if (username || site || password != "") {
            try{
                passwords[username] = {
                    site: site,
                    password: password
                }

                var string_result = JSON.stringify(passwords, undefined, 2);
                fs.writeFileSync('passwords.json', string_result);
                resolve(`${username} and its password has been added for ${site}`)
            }catch (e) {
                throw new Error("Password did not write to database.")
            }
        } else if (username || site || password == "") {
            resolve('Inputs cannot be empty')
        }
        
    })
};

module.exports = {
    add_password
};




