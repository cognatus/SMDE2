const _jade = require('jade');
const fs = require('fs');
 
// @relativeTemplatePath is the path relative to the views directory, so include subDirectories if necessary
// @data is the data that will be injected into the template
exports.compile = function(relativeTemplatePath, data, next) {
 
	// actual path where the template lives on the file system, assumes the standard /views directory
	// output would be something like /var/www/my-website/views/email-template.jade
	let absoluteTemplatePath = process.cwd() + '\\views\\email\\' + relativeTemplatePath + '.jade';
	// console.log(absoluteTemplatePath);
	
	// get our compiled template by passing path and data to jade
	_jade.renderFile(absoluteTemplatePath, data, function(err, compiledTemplate) {
		if (err) {
			console.log(err);
			throw new Error('Problem compiling template(double check relative template path): ' + relativeTemplatePath);
		}
		// console.log('[INFO] COMPILED TEMPLATE: ', compiledTemplate);
		next(null, compiledTemplate);
	});
	
};