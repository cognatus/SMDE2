const jadeCompiler = require('../lib/jade-compiler');
const mailer = require('../lib/mailer');
 
exports.sendMail = function(params, next) {
	// you probably won't need this exactly how it is but its always good to do server side validation before using the data.
	if ( !params.toEmail || !params.body ) {
		return next({ code: 'NOPARAMS', status: 'ERROR' }, null);
	}
	
	// fromAddress, toAddress, subject, content, next
	const IMG_HOST = 'http://192.168.100.140:3000/fintra-assets/images';
	const FROM_ADDRESS = 'avillarroel@e-bitware.com';
	const TO_ADDRESS = params.toEmail;
	const SUBJECT = 'Fintra | ' + params.subject;
	
	// relative to views/ directory - don't include extension!
	const RELATIVE_TEMPLATE_PATH = 'confirmation';
	
	// get data from db, request, or whatever... For this example we just grab it from data submitted in the form and add a placeholder title and list
	let data = {
		title: params.subject,
		email: params.toEmail,
		firstName: params.firstName,
		lastName: params.lastName,
		body: params.body,
		imgHost: IMG_HOST
	};
	
	// get compiled template first
	jadeCompiler.compile(RELATIVE_TEMPLATE_PATH, data, function(err, html) {
		if (err) {
			throw new Error('Problem compiling template(double check relative path): ' + RELATIVE_TEMPLATE_PATH);
		}
		// now we have the html populated with our data so lets send an email!
		mailer.sendMail(FROM_ADDRESS, TO_ADDRESS, SUBJECT, html, function(err, success) {
			if (err) {
				throw new Error('Problem sending email to: ' + params.toEmail);
			}
			// Yay! Email was sent, now either do some more stuff or send a response back to the client
			next(null, { message: 'Email sent', data: success });
		});
	});
};