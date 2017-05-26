var fs = require('fs');

exports.updateProfilePhotos = function(req, res){
	var userId = req.body.userId;
	var backImage = req.files.updateProfileBack;
	var profileImage = req.files.updateProfilePhoto;

	if ( backImage.originalFilename != '' ) {
		var readableStream = fs.createReadStream(backImage.path);
		var writableStream = fs.createWriteStream(__media + "/backgrounds/" + userId + ".jpg");

		readableStream.pipe(writableStream, {end: false});
	}

	if ( profileImage.originalFilename != '' ) {
		var readableStream = fs.createReadStream(profileImage.path);
		var writableStream = fs.createWriteStream(__media + "/photos/" + userId + ".jpg");

		readableStream.pipe(writableStream, {end: false});
	}
	res.json({ message: 'Fotos actualizadas con exito'});

 };