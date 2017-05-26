const fs = require('fs');
const User = require('../../models/User');

exports.updateProfilePhotos = (req, res) => {
	let userId = req.body.userId;
	let background = req.files.profileBackground;
	let profile = req.files.profilePhoto;

	User.findOneAndUpdate({ _id: userId }, { $set: { profilePhoto: userId, backPhoto: userId } }, { new: false }, (err, doc) => {
		if (err) {
			res.status(500).send({ message: 'Hubo un error al encontrar o al modificar al usuario' });
		} else {
			if ( background.originalname != '' ) {
				let readableStream = fs.createReadStream(background.path);
				let writableStream = fs.createWriteStream(__media + "background/" + userId + ".jpg");

				readableStream.pipe(writableStream, {end: false});
			}

			if ( profile.originalname != '' ) {
				let readableStream = fs.createReadStream(profile.path);
				let writableStream = fs.createWriteStream(__media + "profile/" + userId + ".jpg");

				readableStream.pipe(writableStream, {end: false});
			}
			res.json({ message: 'Fotos actualizadas con exito'});
		}
	});

 };