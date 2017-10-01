const nodemailer = require('nodemailer');
const config = require('../routes/settings').MAIL_CONFIG;
 
// Its not a good idea to provide your credentials like this, they should come from an external source. This is only for the demo.
const EMAIL_ACCOUNT_USER = config.ACCOUNT_USER;
const EMAIL_ACCOUNT_PASSWORD = config.ACCOUNT_PASSWORD;
const YOUR_NAME = config.USER_NAME;
const HOST = config.HOST;
const PORT = config.PORT;
const SECURE = config.SECURE;
 
//reusable transport, look at the docs to see other service/protocol options
var smtpTransport = nodemailer.createTransport({
	host: HOST,
	port: PORT,
	secure: SECURE,
	auth: {
		user: EMAIL_ACCOUNT_USER,
		pass: EMAIL_ACCOUNT_PASSWORD
	}
});
 
// Public method that actually sends the email
exports.sendMail = function(fromAddress, toAddress, subject, content, next){
	var success = true;
	var mailOptions = {
		// NOTE: the fromAdress can actually be different than the email address you're sending it from. Which is good and bad I suppose. Use it wisely.
		from: YOUR_NAME + ' <' + fromAddress + '>',
		to: toAddress,
		replyTo: fromAddress,
		subject: subject,
		html: content
	};
	
	// send the email!
	smtpTransport.sendMail(mailOptions, function(error, response){
		if (error) {
			console.log('[ERROR] Message NOT sent: ', error);
			success = false;
		} else {
			console.log('[INFO] Message Sent: ' + response.message);
		}
		next(error, success);
	});
};