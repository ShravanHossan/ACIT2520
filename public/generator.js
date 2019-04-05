const generatePassword = () => {
	var length = 30,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		password = "";

	for (var i = 0; n = charset.length, i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * n));
	}
	swal(`Your Password is: ${password}`);
};

// Easier way to do it using a generate-password module
// const generator = require('generate-password');

// var password = generator.generate({
// 	length: 20,
// 	numbers: true
// });

// console.log(password);