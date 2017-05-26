const fs = require('fs');
const User = require('../../models/User');

const _media =  'src/media/';

exports.updateProfilePhotos = (req, res) => {
	let userId = req.body.userId;
	let background = req.files.profileBackground;
	let profile = req.files.profilePhoto;
	console.log(userId);

	User.findOneAndUpdate({ _id: userId }, { $set: { profilePhoto: userId, backPhoto: userId } }, { new: false }, (err, doc) => {
		if (err) {
			res.status(500).send({ message: 'Hubo un error al encontrar o al modificar al usuario' });
		} else {
			if ( background.originalname !== '' ) {
				background.destination = _media + 'background/';
				background.filename = userId + '.jpg'
			}

			if ( profile.originalname !== '' ) {
				profile.destination = _media + 'profile/';
				profile.filename = userId + '.jpg'
			}
			res.json({ message: 'Fotos actualizadas con exito', path: background.path });
		}
	});

 };