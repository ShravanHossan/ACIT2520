//With Promises
const generatePassword = () => {
    return new Promise(((resolve, reject) => {
        var length = 20,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            password = "";

        for (var i = 0; n = charset.length, i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        resolve(password)
    }))};


generatePassword().then(result => {
    console.log(result)
}).catch(err => {
    console.log(err)
});

module.exports = {
    generatePassword
}

// console.log(generatePassword());

// const generatePassword = () => {
//     var length = 20,
//         charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
//         password = "";
//
//     for (var i = 0; n = charset.length, i < length; i++) {
//         password += charset.charAt(Math.floor(Math.random() * n));
//     }
//     return password;
// }
//
// console.log(generatePassword());

