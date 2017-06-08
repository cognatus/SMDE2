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
	let nameImage = formatedDate.toString() + '' + randomNumber.toString();

	let userDir = _media + userId;
	let backDir = _media + userId + '/background';
	let profDir = _media + userId + '/profile';
	let flag = false;

	if (!fs.existsSync(userDir)){
		fs.mkdirSync(userDir);
	}

	if (!fs.existsSync(backDir)){
		fs.mkdirSync(backDir);
	}

	if (!fs.existsSync(profDir)){
		fs.mkdirSync(profDir);
	}

	busboy.on('field', function(fieldname, val) {
		req.body[fieldname] = val;
	});

	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
		if ( fieldname === 'profileBackground') {
			if ( filename != '' ) {
				let strBackPath = _media + userId + '/background/' + nameImage + '.jpg';
				fstreamBack = fs.createWriteStream(strBackPath);
				file.pipe(fstreamBack);
				fstreamBack.on('close', function() {
					file.resume();
					let newPhoto = { name: nameImage + '.jpg', album: 'background' };
					User.update({ _id: userId },
						{ $push: { photos: newPhoto }, $set: { backPhoto: nameImage + '.jpg' } },
					(err, doc) => {
						if (err) {
							console.log(err);
							res.status(500).send({ message: 'Hubo un error al agregar la imagen de portada' });
						}
					});
				});
			}
		}
		if ( fieldname === 'profilePhoto' ) {
			if ( filename != '' ) {
				let strProfPath = _media + userId + '/profile/' + nameImage + '.jpg';
				fstreamProf = fs.createWriteStream(strProfPath);
				file.pipe(fstreamProf);
				fstreamProf.on('close', function() {
					file.resume();
					let newPhoto = { name: nameImage + '.jpg', album: 'profile' };
					User.update({ _id: userId },
						{ $push: { photos: newPhoto }, $set: { profilePhoto: nameImage + '.jpg' } },
					(err, doc) => {
						if (err) {
							console.log(err);
							res.status(500).send({ message: 'Hubo un error al agregar la foto de perfil' });
						}
					});
				});
			}
		}
	});
	busboy.on('finish', function() {
		console.log('Finish upload');
		flag = true;
		res.status(303).redirect('/perfil');
	});
	req.pipe(busboy);
	if ( flag ) {
		res.redirect('/perfil');
	}
};