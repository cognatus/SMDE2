var Busboy = require('busboy');
const fs = require('fs');
const User = require('../../models/User');

const _media =	'src/media/';

exports.updateProfilePhotos = (req, res) => {
	var busboy = new Busboy({ headers: req.headers });

	let date = new Date();
	let formatedDate = date.getDate() + '' + date.getMonth() + '' + date.getFullYear() + '' + date.getHours() + '' + date.getMinutes() + '' + date.getSeconds();
	let randomNumber = Math.floor(Math.random() * 1000) + 1
	let userId = req.cookies.login._id;
	/*let background = req.files.profileBackground;
	let profile = req.files.profilePhoto;*/
	let nameImage = formatedDate.toString() + '' + randomNumber.toString();

	let dir = _media + userId + '/background';
	let strPath = _media + userId + '/background/' + nameImage + '.jpg';

	if (!fs.existsSync(dir)){
		fs.mkdirSync(dir);
	}

	busboy.on('field', function(fieldname, val) {
		req.body[fieldname] = val;
	});

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		console.log(fieldname);
		if ( fieldname === 'profileBackground' ) {
			fstream = fs.createWriteStream(strPath);
			file.pipe(fstream);
			fstream.on('close', function() {
				file.resume();
				let newPhoto = { name: nameImage + '.jpg', album: 'background' };
				User.update({ _id: userId },
					{ $push: { photos: newPhoto }, $set: { backPhoto: nameImage + '.jpg' } },
				(err, doc) => {
					if (err) {
						console.log(err);
						res.status(500).send({ message: 'Hubo un error al agregar la imagen de portada' });
					} else {	
						res.redirect('/perfil');
					}
				});
			});
		}
	});
	busboy.on('finish', function() {
		console.log('Done parsing form!');
		res.writeHead(303, { Connection: 'close', Location: '/perfil' });
		res.end();
	});
	req.pipe(busboy);
		

	/*if ( profile.originalname !== '' ) {
		profile.destination = _media + 'profile/';
		profile.filename = userId + '.jpg'
	}*/

};