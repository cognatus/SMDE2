var base;
var stringQuery = '';

var htmlspecialchars = require('htmlspecialchars');

exports.constructor = function (basee) {
	base = basee;
}

exports.insertLobby = function(req, res){
	var database = new base();

	var now = new Date();
	var dd = now.getDate();
	var mm = now.getMonth() + 1;
	var yyyy = now.getFullYear();
	var hh = now.getHours();
	var min = now.getMinutes();
	var sec = now.getSeconds();
	var milsec = now.getMilliseconds();
	var time = dd + '' + mm + '' + yyyy + '' + hh + '' + min + '' + sec + '' + milsec;

	var stringQuery2 = '';
	//OBTIENE LA CADENA DE TEXTO DE LOS USUARIOS PARA LA LOBBY
	var lobbyUsers = req.body.insetUsersLobby;
	var message = req.body.insertNewLobbyMsm;
	var owner = req.session.datos[0].userEmail;
	//SEPARA A LOS USUARIOS A PARTIR DE UN ELEMENTO SEPARADOR
	var usersArray = lobbyUsers.split(',');
	//ELIMINA EL ULTIMO ELEMENTO YA QUE SE MANDA NULO EN LA ULTIMA POSICION DEL ARREGLO
	usersArray.pop();
	usersArray.push(owner);

	var uniqueId = 'l0b8Y' + Math.floor( (Math.random() * 596501699) + 16985689 ) + '' + time;

	if( lobbyUsers != null || lobbyUsers.trim() != '' ){
		if( message != null || message.trim() != '' ){
			stringQuery = 'BEGIN;';

			stringQuery += 'INSERT INTO Lobby (idLobby) VALUES ("' + uniqueId + '");';

			for ( var i = 0; i < usersArray.length; i++ ) {
					stringQuery += 'INSERT INTO User_has_Lobby (User_userEmail, Lobby_idLobby)'
								+ ' VALUES ("' + usersArray[i] + '", "' + uniqueId + '");';
			}

			stringQuery += 'INSERT INTO Message'
						+ ' (idMessage, messageText, messageDateTime, messageStatus, Lobby_idLobby, User_userEmail)'
						+ ' VALUES (UUID(),'
						+ ' "' + htmlspecialchars(message) + '",'
						+ ' NOW(), 1, "' + uniqueId + '",'
						+ ' "' + owner + '");';

			stringQuery += 'COMMIT;';
		}	
	}
	else{
		res.render('error' , {
				errorData: {
				errorTitle: 'Error al crear Conversación',
				errorItem: ['-  No puede crearse la sala haber agregado algun usuario',
				'-  El mensaje no puede estar vacio'],
				backUrl: '/messages'
			}
		});
	}

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			res.redirect('/messages');
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al mandar su mensaje',
					errorItem: ['-  Problemas con el servidor'],
					backUrl: '/messages'
				}
			});
		}
	});
};

//FUNCION PARA OBTENER LAS LOBBIES DEL USUARIO
exports.insertNewMessage = function(req, res){
	var database = new base();

	var lobby = req.body.lobbyBody;
	var msmText = req.body.messageBody;

	if(msmText != null || msmText.trim() != ''){

		stringQuery += 'INSERT INTO MESSAGE (idMessage, messageText, messageDateTime, Lobby_idLobby, User_userEmail)'
					+ ' VALUES '
					+ ' (UUID(),'
					+ ' "' + htmlspecialchars(msmText) + '",'
					+ ' NOW(),'
					+ ' "' + lobby + '",'
					+ ' "' + req.session.datos[0].userEmail + '");';
	}

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			res.redirect('/messages');
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.send('Error');
		}
	});
};

//FUNCION PARA OBTENER LAS LOBBIES DEL USUARIO
exports.getLobbiesDatabase = function(req, res){
	var database = new base();

	stringQuery = 'SELECT idLobby, DATE_FORMAT(m.messageDateTime, "%d/%m/%Y") AS lobbyDate,'
				+ ' DATE_FORMAT(m.messageDateTime, "%H:%i") AS lobbyHour, m.messageText AS lastMsm, u2.userEmail AS lastSenderEmail, u2.userName AS lastSenderName,'
				+ ' GROUP_CONCAT(uhl.User_userEmail SEPARATOR ", ") AS participantsEmails,'
				+ ' GROUP_CONCAT(u.userName, " ", u.userLastName SEPARATOR ", ") AS participantsNames, '
				+ ' GROUP_CONCAT(u.photoName SEPARATOR ",") AS participantsPhotos'
				+ ' FROM user_has_lobby AS uhl '
				+ ' INNER JOIN User AS u '
				+ ' 	ON u.userEmail = uhl.User_userEmail '
				+ ' INNER JOIN Lobby AS l '
				+ ' 	ON l.idLobby = uhl.Lobby_idLobby '
				+ ' INNER JOIN Message AS m'
				+ ' 	ON m.Lobby_idLobby = l.idLobby'
				+ '		AND messageDateTime IN '
				+ '		('
				+ '			SELECT MAX(messageDateTime) FROM Message AS m2 '
				+ '			WHERE m2.Lobby_idLobby = l.idLobby '
				+ '		)'
				+ ' INNER JOIN User AS u2 '
				+ ' 	ON u2.userEmail = m.User_userEmail '
				+ ' WHERE uhl.Lobby_idLobby IN '
				+ ' 	( '
				+ '			SELECT Lobby_idLobby '
				+ '       	FROM user_has_lobby '
				+ '       	WHERE User_userEmail = "' + req.session.datos[0].userEmail + '" '
				+ '   	) '
				+ ' AND uhl.User_userEmail != "' + req.session.datos[0].userEmail + '"  '
				+ ' GROUP BY uhl.Lobby_idLobby '
				+ ' ORDER BY m.messageDateTime DESC; '

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			stringDataLobby = '';

			for(var i in result){
                var item = result[i];
                var arrayParticipantsPhotos = item.participantsPhotos.split(',');
                var arrayParticipantsNames = item.participantsNames.split(', ');

                stringDataLobby += ''
                + '<div class="colhh1 hover listitem rippleria-dark" data-rippleria="" data-name="' + item.participantsNames + '" data-type="' + item.participantsEmails + '" data-title="' + item.participantsEmails + '\n' + item.participantsNames + '" onclick="selectLobby(&quot;' + item.idLobby + '&quot;)">'
                +    '<div class="listitem_img">'
                if(arrayParticipantsPhotos.length > 1){
                	for(var j = 0; j < arrayParticipantsPhotos.length; j++){
                		if(j > 3){
                			break;
                		}
                		else{
                			stringDataLobby += '<img class="img_mul circle" src="profile_photos/' + arrayParticipantsPhotos[j] + '.png" title="' + arrayParticipantsNames[j] + '">'
                		}
                	}
                }
                else{
                	stringDataLobby += '<img class="circle" src="profile_photos/' + item.participantsPhotos + '.png">'
                }
                stringDataLobby += '</div>'
                +    '<div class="listitem_info border_bottom">'
                +        '<div class="listitem_rightinfo" title="' + item.lobbyDate + ' a las ' + item.lobbyHour + '">'
                +            '<label class="lobby_date">' + item.lobbyDate + '</label>'
                +            '<label class="lobby_time">&nbsp;' + item.lobbyHour + '</label>'
                +        '</div>'
                +        '<div class="listitem_title">'
                +            '<b title="' + item.participantsEmails + '\n' + item.participantsNames + '">' + item.participantsNames + '</b>'
                +        '</div>'
                if(item.lastSenderEmail == req.session.datos[0].userEmail){
                	stringDataLobby += '<div class="listitem_bottomdata"><span class="bg_reply msm_miniicon"></span>&nbsp;' + item.lastMsm +'</div>'
                }
                else{
                	stringDataLobby +=  '<div class="listitem_bottomdata"><span class="b_text">'+ item.lastSenderName + ':</span>&nbsp;' + item.lastMsm +'</div>'
                }
                stringDataLobby +='</div>'
                + '</div>';
            }

			res.send(stringDataLobby);
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.send('Error');
		}
	});
};

//FUNCION PARA OBTENER LAS LOBBIES DEL USUARIO
exports.getSelectedLobbyMessages = function(req, res){
	var database = new base();

	var lobby = req.query.lobby;

	stringQuery = 'SELECT idMessage, messageText,'
				+ ' 	DATE_FORMAT(messageDateTime, "%d/%m/%Y") AS messageDate,'
				+ ' 	DATE_FORMAT(messageDateTime, "%H:%i") AS messageTime,'
				+ ' 	messageStatus, userEmail, userName, userLastName, photoName'
				+ ' FROM Message AS m '
				+ ' INNER JOIN USER AS u '
				+ ' 	ON u.userEmail = m.User_userEmail '
				+ ' WHERE Lobby_idLobby = "' + lobby + '" '
				+ ' ORDER BY messageDateTime ASC;';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			selectedLobbyData = result;
			res.send(selectedLobbyData);
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.send('Error');
		}
	});
};

// FUNCION PARA MOSTRAR CONTACTOS (ADMINITRADORES)
exports.getProfileContactsAdministratorsMsm = function(req, res){
	var database = new base();

	stringQuery = 'SELECT userName, userLastName, userSecondLastName, userEmail, photoName '
				+ ' FROM User AS u'
				+ ' INNER JOIN Administrator AS a ' 
				+ ' ON u.userEmail = a.User_userEmail '
				+ ' WHERE u.Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '" '
				+ ' AND u.userEmail != "' + req.session.datos[0].userEmail + '";' ;

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                stringData += '<div class="colhh1 pd_lr8 listitem hover" data-name="' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '" data-email="' + item.userEmail + '">' 
                                +       '<div class="listitem_img"><img src="profile_photos/' + item.photoName + '.png"></img></div>'
                                +       '<div class="listitem_info">'
                                +           '<div class="listitem_rightinfo">Admin</div>'
                                +           '<div class="listitem_title"><b>' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '</b></div>'
                                +           '<div class="listitem_bottomdata">' + item.userEmail
                                +           '</div>'
                                +       '</div>'
                                +   '</div>'
            }
			res.send(stringData);
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});
};

// FUNCION PARA MOSTRAR CONTACTOS (ESTUDIANTES)
exports.getProfileContactsStudentsMsm = function(req, res){
	var database = new base();

	//SI EL USUARIO ES TIPO ALUMNO
	if(	req.session.privilegio == 1	){
		stringQuery = 'SELECT userName, userLastName, userSecondLastName, userEmail, photoName '
					+ ' FROM Student_has_Subject_has_Course a '
					+ '	JOIN Student_has_Subject_has_Course b '
					+ '		ON a.Subject_has_Course_Subject_idSubject = b.Subject_has_Course_Subject_idSubject '
					+ '		AND a.Subject_has_Course_Course_idCourse = b.Subject_has_Course_Course_idCourse '
					+ '		AND a.Student_idStudent != b.Student_idStudent '
					+ '	INNER JOIN Subject as sub '
					+ '		ON sub.idSubject = a.Subject_has_Course_Subject_idSubject '
					+ '	INNER JOIN Course as c '
					+ '		ON c.idCourse = a.Subject_has_Course_Course_idCourse '
					+ '	INNER JOIN Student as s '
					+ '		ON s.idStudent = b.Student_idStudent '
					+ '	INNER JOIN User as u '
					+ '		ON u.userEmail = s.User_userEmail '
					+ '	WHERE a.Student_idStudent = "' + req.session.datos[0].idStudent + '" '
					+ '	AND b.Student_idStudent != "' + req.session.datos[0].idStudent + '" '
					+ '	GROUP BY b.Student_idStudent;';
	}

	//SI EL USUARIO ES TIPO PROFESOR
	else if( req.session.privilegio == 2 ){
		stringQuery = 'SELECT userName, userLastName, userSecondLastName, userEmail, photoName '
					+ ' FROM Teacher_has_Subject_has_Course a '
					+ '	JOIN Student_has_Subject_has_Course b '
					+ '		ON a.Subject_has_Course_Subject_idSubject = b.Subject_has_Course_Subject_idSubject '
					+ '		AND a.Subject_has_Course_Course_idCourse = b.Subject_has_Course_Course_idCourse '
					+ '		AND a.Teacher_idTeacher != b.Student_idStudent '
					+ '	INNER JOIN Subject as sub '
					+ '		ON sub.idSubject = a.Subject_has_Course_Subject_idSubject '
					+ '	INNER JOIN Course as c '
					+ '		ON c.idCourse = a.Subject_has_Course_Course_idCourse '
					+ '	INNER JOIN Student as s '
					+ '		ON s.idStudent = b.Student_idStudent '
					+ '	INNER JOIN User as u '
					+ '		ON u.userEmail = s.User_userEmail '
					+ '	WHERE a.Teacher_idTeacher = "' + req.session.datos[0].idTeacher + '" '
					+ '	AND b.Student_idStudent != "' + req.session.datos[0].idTeacher + '" '
					+ '	GROUP BY b.Student_idStudent;';
	}

	// SI EL USUARIO ES TIPO ADMIN
	else if(req.session.privilegio == 3){
		stringQuery = 'SELECT userName, userLastName, userSecondLastName, userEmail, photoName '
				+ ' FROM User AS u '
				+ ' INNER JOIN Student AS s' 
				+ ' ON u.userEmail = s.User_userEmail'
				+ ' WHERE u.Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '"' 
				+ ' ORDER BY userName ASC;';
	}

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                stringData += '<div class="colhh1 pd_lr8 listitem hover" data-name="' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '" data-email="' + item.userEmail + '">' 
                                +       '<div class="listitem_img"><img src="profile_photos/' + item.photoName + '.png"></img></div>'
                                +       '<div class="listitem_info">'
                                +           '<div class="listitem_rightinfo">Alumno</div>'
                                +           '<div class="listitem_title"><b>' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '</b></div>'
                                +           '<div class="listitem_bottomdata">' + item.userEmail
                                +           '</div>'
                                +       '</div>'
                                +   '</div>'
            }
			res.send(stringData);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});
};

// FUNCION PARA MOSTRAR CONTACTOS (PROFESORES)
exports.getProfileContactsTeachersMsm = function(req, res){
	var database = new base();

	//SI EL USUARIO ES TIPO AlUMNO
	if(req.session.privilegio == 1){
		stringQuery = 'SELECT userEmail, userName, userLastName, userSecondLastName, photoName '
					+ ' FROM Student_has_Subject_has_Course a '
					+ ' JOIN Teacher_has_Subject_has_Course b '
					+ ' 	ON a.Subject_has_Course_Subject_idSubject = b.Subject_has_Course_Subject_idSubject '
					+ ' 	AND a.Subject_has_Course_Course_idCourse = b.Subject_has_Course_Course_idCourse '
					+ ' 	AND a.Student_idStudent != b.Teacher_idTeacher '
					+ ' INNER JOIN Subject as sub '
					+ ' 	ON sub.idSubject = b.Subject_has_Course_Subject_idSubject '
					+ ' INNER JOIN Course as c '
					+ ' 	ON c.idCourse = b.Subject_has_Course_Course_idCourse '
					+ ' INNER JOIN Teacher as t '
					+ ' 	ON t.idTeacher = b.Teacher_idTeacher '
					+ ' INNER JOIN User as u '
					+ ' 	ON u.userEmail = t.User_userEmail '
					+ ' WHERE a.Student_idStudent = "' + req.session.datos[0].idStudent + '" '
					+ '    AND b.Teacher_idTeacher != "'  + req.session.datos[0].idStudent +  '" ';
					+ '	GROUP BY b.Teacher_idTeacher;';
	}

	//SI EL USUARIO ES TIPO PROFESOR
	else if(req.session.privilegio == 2){
		stringQuery = 'SELECT userEmail, userName, userLastName, userSecondLastName '
					+ ' FROM Teacher_has_Subject_has_Course a '
					+ ' JOIN Teacher_has_Subject_has_Course b '
					+ ' 	ON a.Subject_has_Course_Subject_idSubject = b.Subject_has_Course_Subject_idSubject '
					+ ' 	AND a.Subject_has_Course_Course_idCourse = b.Subject_has_Course_Course_idCourse '
					+ ' 	AND a.Teacher_idTeacher != b.Teacher_idTeacher '
					+ ' INNER JOIN Subject as sub '
					+ ' 	ON sub.idSubject = b.Subject_has_Course_Subject_idSubject '
					+ ' INNER JOIN Course as c '
					+ ' 	ON c.idCourse = b.Subject_has_Course_Course_idCourse '
					+ ' INNER JOIN Teacher as t '
					+ ' 	ON t.idTeacher = b.Teacher_idTeacher '
					+ ' INNER JOIN User as u '
					+ ' 	ON u.userEmail = t.User_userEmail '
					+ ' WHERE a.Teacher_idTeacher = "' + req.session.datos[0].idTeacher + '" '
					+ '    AND b.Teacher_idTeacher != "'  + req.session.datos[0].idTeacher +  '" ';
					+ '	GROUP BY b.Teacher_idTeacher;';
	}

	// SI EL USUARIO ES TIPO ADMIN
	else if(req.session.privilegio == 3){
		stringQuery = 'SELECT userName, userLastName, userSecondLastName, userEmail, photoName '
				+ ' FROM User AS u '
				+ ' INNER JOIN Teacher AS t' 
				+ ' ON u.userEmail = t.User_userEmail'
				+ ' WHERE u.Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '"' 
				+ ' ORDER BY userName ASC;';
	}
	
	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                stringData += '<div class="colhh1 pd_lr8 listitem hover" data-name="' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '" data-email="' + item.userEmail + '">' 
                                +       '<div class="listitem_img"><img src="profile_photos/' + item.photoName + '.png"></img></div>'
                                +       '<div class="listitem_info">'
                                +           '<div class="listitem_rightinfo">Profe</div>'
                                +           '<div class="listitem_title"><b>' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '</b></div>'
                                +           '<div class="listitem_bottomdata">' + item.userEmail
                                +           '</div>'
                                +       '</div>'
                                +   '</div>'
            }
			res.send(stringData);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});

};