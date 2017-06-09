var Busboy = require('busboy');
const fs = require('fs');
const User = require('../../models/User');

const _media =	'src/media/';

exports.uploadProfilePhotos = (req, res) => {
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
			} else {
				file.resume();
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
			} else {
				file.resume();
			}
		}
	});
	busboy.on('finish', function() {
		console.log('Finish upload');
		res.redirect('/perfil');
	});
	req.pipe(busboy);
};

exports.updateProfileName = (req, res) => {
	User.findOneAndUpdate({_id: req.cookies.login._id}, {$set: {
		name: req.body.name,
		lastName: req.body.lastName,
	}}, {new: false}, (err, doc) => {
		if (err) {
			res.status(500).send({ message: err });
		}else{
			res.send('Usuario modificado');
		}
	});
};

exports.updatePhoto = (req, res) => {
	let userId = req.cookies.login._id;
	if ( req.body.album === 'background' ) {
		User.findOneAndUpdate({ _id: userId }, { $set: {
			backPhoto: req.body.name,
		}}, {new: false}, (err, doc) => {
			if (err) {
				res.status(500).send({ message: err });
			}else{
				res.send({ message: 'Foto de portada cambiada' });
			}
		});
	} else if ( req.body.album === 'profile' ) {
		User.findOneAndUpdate({ _id: userId }, {$set: {
			profilePhoto: req.body.name,
		}}, {new: false}, (err, doc) => {
			if (err) {
				res.status(500).send({ message: err });
			}else{
				res.send({ message: 'Foto de perfil cambiada' });
			}
		});
	}
};

exports.deletePhoto = (req, res) => {
	let userId = req.cookies.login._id;
	let fileToRemove = _media + userId + '/' + req.query.album + '/' + req.query.name
	fs.unlink(fileToRemove, () => {
		User.findOneAndUpdate({ _id: userId }, { $pull:
			{ photos: { name: req.query.name, album: req.query.album } } 
		}, {new: false}, (err, doc) => {
			if (err) {
				res.status(500).send({ message: err });
			}else{
				if ( req.query.album == 'background' ) {
					User.findOneAndUpdate({ _id: userId }, { $set: {
						backPhoto: ''
					}}, {new: false}, (err, doc) => {
						if ( err ) {
							res.status(500).send({ message: err })
						} else {
							res.send({ message: 'Foto de perfil borrada' });
						}
					});
				} else if ( req.query.album == 'profile' ) {
					User.findOneAndUpdate({ _id: userId }, { $set: {
						profilePhoto: ''
					}}, {new: false}, (err, doc) => {
						if ( err ) {
							res.status(500).send({ message: err })
						} else {
							res.send({ message: 'Foto de portada borrada' });
						}
					});
				} else {
					res.send({ message: 'Foto borrada' });
				}
			}
		});
	});
};