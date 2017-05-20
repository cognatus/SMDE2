var base;
var stringQuery = '';

var htmlspecialchars = require('htmlspecialchars');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

exports.constructor = function (basee) {
	base = basee;
}


//FUNCION PARA INSERTAR UN NUEVO RECORDATORIO
exports.insertReminder = function(req, res){
	var database = new base();

	var reminderTitle = req.body.formCalendarTitle ;
	var reminderText  = req.body.formCalendarComment ;
	var day = req.body.formCalendarDay;
	var month = req.body.formCalendarMonth;
	var year = req.body.formCalendarYear;
	var hour = req.body.formCalendarHour;
	var minutes = req.body.formCalendarMinute;
	
	var reminderLimitDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':00' ;
	var reminderOwner = req.session.datos[0].userEmail;

	stringQuery = 'BEGIN;'
	stringQuery += 'INSERT INTO Reminder' 
					+ ' (idReminder, reminderTitle, reminderText, reminderDateTime, reminderLimitDate, User_userEmail)'
					+ ' VALUES (UUID(),'
					+ ' "' + htmlspecialchars(reminderTitle) + '",'
					+ ' "' + htmlspecialchars(reminderText) + '",'
					+ ' NOW(),'
					+ ' "' + reminderLimitDate + '",'
					+ ' "' + reminderOwner + '");';
	stringQuery += 'COMMIT;'

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			console.log('Nuevo recordatorio insertado correctamente');
			res.redirect('/calendar');
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al insertar Publicación',
					errorItem: ['-  Fecha Incorrecta',
					'-  Problemas con el Servidor'],
					backUrl: '/calendar'
				}
			});
		}
	});
};

//FUNCION PARA INSERTAR UNA NUEVA PUBLICACIÓN
exports.insertPublication = function(req, res){
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
	
	var pubId = 'pUb' + Math.floor((Math.random() * 596501699) + 16985689) + '' + time;
	var publicationTitle = req.body.formCalendarTitle;
	var publicationText  = req.body.formCalendarComment;
	var day = req.body.formCalendarDay;
	var month = req.body.formCalendarMonth;
	var year = req.body.formCalendarYear;
	var hour = req.body.formCalendarHour;
	var minutes = req.body.formCalendarMinute;
	var publicationLimitDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':00' ;
	var publicationOwner = req.session.datos[0].userEmail;
	//OBTENERMOS EL CURSO AL QUE QUEREMOS PUBLICAR
	var subCourseString = req.body.calendarCourseSelectField;
	//SEPARAMOS EL idSubject del idCourse POR QUE SE MANDAN EN UNA SOLA CADENA DE TEXTO
	var subCourse = subCourseString.split('/');

	stringQuery = 'BEGIN;'

	stringQuery += 'INSERT INTO Publication' 
				+ ' (idPublication, pubTitle, pubText, pubDateTime, publicationLimitDate, Teacher_User_userEmail,'
				+ ' Subject_has_Course_Subject_idSubject, Subject_has_Course_Course_idCourse)'
				+ ' VALUES ("' + pubId + '",'
				+ ' "' + htmlspecialchars(publicationTitle) + '",'
				+ ' "' + htmlspecialchars(publicationText) + '",'
				+ ' NOW(),'
				+ ' "' + publicationLimitDate + '",'
				+ ' "' + publicationOwner + '",'
				//		 idSubject 		  	  idCourse
				+ ' "' + subCourse[0] + '", "' + subCourse[1] + '");';

	//Eror al mandar un archivo o ninguno
	if(req.files.publicationAttachedFiles.length > 0) {
	    req.files.publicationAttachedFiles.forEach(function (element, index, array) {

	    	stringQuery += 'INSERT INTO publicationAttachedFile'
						+ ' (idPublicationAttachedFile, publicationAttachedNameFile, fileSize, Publication_idPublication)'
						+ ' VALUES (UUID(),'
						+ ' "' + element.name + '",'
						+ ' "' + element.fileSize + '",'
						+ ' "' + pubId + '");';

			//Este metodo es el metodo 1
			var readableStream = fs.createReadStream(element.path);
			//Aqui hay que poner la ruta completa ya que _dirname es relativo al script donde esta escrito
			var writableStream = fs.createWriteStream('C:/Users/Alex/Desktop/SMDE-Prototipos/public/publications/' + req.session.datos[0].idTeacher + '/' + element.name);

			readableStream.pipe(writableStream, {end: false});

			//Este es el metodo 2
	    	/*fs.readFile(element.path, function (err, data) {

	    		var newPath = 'C:/Users/Alex/Desktop/SMDE-Prototipos/public/publications/' + req.session.datos[0].idTeacher + '/' + element.name;
	    		fs.writeFile(newPath, data, function (err) {
	        		if(err) {
	        			console.log(err);
	        		}
	    		});
	    	});*/
	    });
	}

	stringQuery += 'COMMIT;'

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			console.log('Nueva Publicación insertada correctamente');
			res.redirect('/calendar');
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al insertar Publicación',
					errorItem: ['-  Fecha Incorrecta', 'No se pudieron subir los Archivos Adjuntos',
					'-  Problemas con el Servidor'],
					backUrl: '/calendar'
				}
			});
		}
	});
};

// FUNCION PARA MOSTRAR MATERIAS DE PERFIL DE LA BASE DE DATOS
exports.getProfileSubjectsDatabaseCalendar = function(req, res){
	var database = new base();

	//SI EL USUARIO ES TIPO PROFESOR
	if(req.session.privilegio == 2){
		stringQuery = 'SELECT idSubject, idCourse, subjectName, courseName'
					+ ' FROM User AS u'
					+ ' INNER JOIN Teacher AS s'
					+ '     ON u.userEmail = s.User_userEmail'
					+ ' INNER JOIN Teacher_has_Subject_has_Course AS ss'
					+ '     ON s.idTeacher = ss.Teacher_idTeacher'
					+ ' INNER JOIN Subject_has_Course AS sc'
					+ '     ON ss.Subject_has_Course_Subject_idSubject = sc.Subject_idSubject'
					+ ' 	AND ss.Subject_has_Course_Course_idCourse = sc.Course_idCourse'
					+ ' INNER JOIN Subject AS su'
					+ '     ON sc.Subject_idSubject = su.idSubject'
					+ ' INNER JOIN Course AS c'
					+ '     ON sc.Course_idCourse = c.idCourse'
					+ ' INNER JOIN Department AS d'
					+ '     ON d.idDepartment = su.Department_idDepartment'
					+ ' WHERE u.userEmail  = "' + req.session.datos[0].userEmail + '"'
					+ ' ORDER BY su.subjectName ASC;'
	}

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringDataProfileCoursesCalendar = '';
			for(var i in result){
                var item = result[i];
                stringDataProfileCoursesCalendar += '<option value="' + item.idSubject + '/' + item.idCourse + '">' + item.subjectName + ' ' + item.courseName + '</option>' 
            }
			res.send(stringDataProfileCoursesCalendar);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});

};

// FUNCION PARA MOSTRAR RECORDATORIOS DEL USUARIO
exports.getRemindersDatabase = function(req, res){
	var database = new base();

	stringQuery = 'SELECT idReminder, reminderTitle, reminderText,'
				+ '	DATE_FORMAT(reminderDateTime, "%d/%m/%Y") AS reminderDate, DATE_FORMAT(reminderDateTime, "%H:%i") AS reminderTime,'
				+ '	DATE_FORMAT(reminderLimitDate, "%d/%m/%Y") AS reminderLimDate, DATE_FORMAT(reminderLimitDate, "%H:%i") AS reminderLimTime'
				+ ' FROM Reminder '
				+ ' WHERE User_userEmail="' + req.session.datos[0].userEmail + '" '
				+ ' ORDER BY reminderDateTime DESC; ';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringDataReminders = '';
			for(var i in result){
                var item = result[i];
                stringDataReminders += '<div data-name="' + item.reminderTitle + '" data-date="' + item.reminderLimDate + '" data-datepost="' + item.reminderDate + '" class="colhh1 block_container bg_white cal_post">'
                                    +    '<div style="padding-top: 2px;margin-bottom: 16px;" class="colhh1 list_leftitem">'
                                    +      '<div class="listitem_img"><span>A</span></div>'
                                    +      '<div class="listitem_info">'
                                    +        '<div title=" Publicado el ' + item.reminderDate + ' a las ' + item.reminderTime + '" class="listitem_rightinfo">'
                                    +          '<label class="item_date">' + item.reminderDate + '</label>'
                                    +          '<label class="item_time">&nbsp;' + item.reminderTime + '</label>'
                                    +        '</div>'
                                    +        '<div class="listitem_title"> <b>' + item.reminderTitle + '</b></div>'
                                    +        '<div class="listitem_bottomdata">Recordatorio</div>'
                                    +      '</div>'
                                    +    '</div>'
                                    +    '<div class="pd_lr8">'
                                    +      '<div class="pd_llist">'
                                    +        '<div class="sl_title">Fecha Límite: <span class="margin_l normal_txt">' + item.reminderLimDate + ' a las ' + item.reminderLimTime + '</span></div>'
                                    +        '<div class="pd_8 border_bottom"></div>'
                                    +      '</div>'
                                    +      '<div class="pd_llist">'
                                    +        '<div class="pd_4"></div>'
                                    +        '<div class="sl_title">Comentarios</div>'
                                    +        '<div class="pd_16 justify_text breakword">' + item.reminderText + '</div>'
                                    +      '</div>'
                                    +    '</div>'
                                    +    '<div class="pd10_16 listitemactions bg_lightgray autooverflow">'
                                    +      '<div class="autocol right_float">'
                                    +        '<span title="Editar" class="circle bg_editgray hover" onclick="editReminder(&quot;' + item.idReminder + '&quot;)"></span>'
                                    +        '<span title="Eliminar" class="circle bg_delete hover" onclick="deleteReminder(&quot;' + item.idReminder + '&quot;)"></span></div>'
                                    +    '</div>'
                                    +  '</div>';
            }
			res.send(stringDataReminders);
			
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('Error');
		}
	});
};

// FUNCION PARA MOSTRAR PUBLICACIONES QUE HACE EL PROFESOR
exports.getPublicationsDatabase = function(req, res){
	var database = new base();

	//SI EL USUARIO ES TIPO ALUMNO
	if(req.session.privilegio == 1){
		stringQuery = 'SELECT idPublication, pubTitle, pubText, photoName,'
					+ '	DATE_FORMAT(pubDateTime, "%d/%m/%Y") AS pubDate, DATE_FORMAT(pubDateTime, "%H:%i") AS pubTime,'
					+ '	DATE_FORMAT(publicationLimitDate, "%d/%m/%Y") AS pubLimDate, DATE_FORMAT(publicationLimitDate, "%H:%i") AS pubLimTime,'
					+ '	userName, userLastName, userSecondLastName, userEmail, subjectName, courseName'
					+ '		FROM Publication AS p '
					+ '		INNER JOIN Teacher AS t '
					+ '			ON t.User_userEmail = p.Teacher_User_userEmail '
					+ '		INNER JOIN User AS u '
					+ '			ON u.userEmail = t.User_userEmail '
					+ '		INNER JOIN Subject_has_Course AS shc '
					+ '			ON shc.Subject_idSubject = p.Subject_has_Course_Subject_idSubject '
					+ '			AND shc.Course_idCourse = p.Subject_has_Course_Course_idCourse '
					+ '		INNER JOIN Subject AS s '
					+ '			ON s.idSubject = shc.Subject_idSubject '
					+ '		INNER JOIN Course As c '
					+ '			On c.idCourse = shc.Course_idCourse '
					+ '	WHERE (p.Subject_has_Course_Subject_idSubject, p.Subject_has_Course_Course_idCourse) IN '
					+ ' 	( '
					+ '			SELECT Subject_has_Course_Subject_idSubject, Subject_has_Course_Course_idCourse '
					+ '			FROM Student_has_Subject_has_Course '
					+ '            WHERE Student_idStudent = "' + req.session.datos[0].idStudent + '"'
					+ ' 	) '
					+ ' GROUP BY idPublication ORDER BY pubDateTime DESC; ';
	}
	//SI EL USUARIO ES TIPO PROFESOR
	else if(req.session.privilegio == 2){
		stringQuery = 'SELECT idPublication, pubTitle, pubText, photoName,'
					+ '	DATE_FORMAT(pubDateTime, "%d/%m/%Y") AS pubDate, DATE_FORMAT(pubDateTime, "%H:%i") AS pubTime,'
					+ '	DATE_FORMAT(publicationLimitDate, "%d/%m/%Y") AS pubLimDate, DATE_FORMAT(publicationLimitDate, "%H:%i") AS pubLimTime,'
					+ '	userName, userLastName, userSecondLastName, userEmail, subjectName, courseName'
					+ '		FROM Publication AS p '
					+ '		INNER JOIN Teacher AS t '
					+ '			ON t.User_userEmail = p.Teacher_User_userEmail '
					+ '		INNER JOIN User AS u '
					+ '			ON u.userEmail = t.User_userEmail '
					+ '		INNER JOIN Subject_has_Course AS shc '
					+ '			ON shc.Subject_idSubject = p.Subject_has_Course_Subject_idSubject '
					+ '			AND shc.Course_idCourse = p.Subject_has_Course_Course_idCourse '
					+ '		INNER JOIN Subject AS s '
					+ '			ON s.idSubject = shc.Subject_idSubject '
					+ '		INNER JOIN Course As c '
					+ '			On c.idCourse = shc.Course_idCourse '
					+ '	WHERE (p.Subject_has_Course_Subject_idSubject, p.Subject_has_Course_Course_idCourse) IN '
					+ ' 	( '
					+ '			SELECT Subject_has_Course_Subject_idSubject, Subject_has_Course_Course_idCourse '
					+ '			FROM Teacher_has_Subject_has_Course '
					+ '            WHERE Teacher_idTeacher = "' + req.session.datos[0].idTeacher + '"'
					+ ' 	) '
					+ ' GROUP BY idPublication ORDER BY pubDateTime DESC; ';
	}

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var publicationsData = '';

			for(var i in result){
                var item = result[i];

                publicationsData += '<div data-name="' + item.pubTitle + '" data-date="' + item.pubLimDate + '" data-datepost="' + item.pubDate + '" class="colhh1 block_container bg_white cal_post">'
                                 +     '<div style="padding-top: 2px;margin-bottom: 16px;" class="colhh1 list_leftitem">'
                                 +       '<div class="listitem_img"><img src="profile_photos/' + item.photoName + '.png" title="' + item.userEmail + '"/></div>'
                                 +       '<div class="listitem_info">'
                                 +         '<div title=" Publicado el ' + item.pubDate + ' a las ' + item.pubTime + '" class="listitem_rightinfo">'
                                 +           '<label class="item_date">' + item.pubDate + '</label>'
                                 +           '<label class="item_time">&nbsp;' + item.pubTime + '</label>'
                                 +         '</div>'
                                 +         '<div title="' + item.userEmail + '" class="listitem_title"> <b>' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '</b></div>'
                                 +         '<div class="listitem_bottomdata">' + item.pubTitle + '</div>'
                                 +       '</div>'
                                 +     '</div>'
                                 +     '<div class="pd_lr8">'
                                 +       '<div class="pd_llist">'
                                 +         '<div class="sl_title">Asunto: <span class="margin_l normal_txt">' + item.pubTitle + '</span></div>'
                                 +         '<div class="pd_4"></div>'
                                 +         '<div class="sl_title">Asignatura: <span class="margin_l normal_txt">' + item.subjectName + '</span></div>'
                                 +         '<div class="pd_4"></div>'
                                 +         '<div class="sl_title">Grupo: <span class="margin_l normal_txt">' + item.courseName + '</span></div>'
                                 +         '<div class="pd_4"></div>'
                                 +         '<div class="sl_title">Entrega: <span class="margin_l normal_txt">' + item.pubLimDate + ' a las ' + item.pubLimTime + '</span></div>'
                                 +         '<div class="pd_12 border_bottom"></div>'
                                 +       '</div>'
                                 +       '<div class="pd_llist">'
                                 +         '<div class="pd_4"></div>'
                                 +         '<div class="sl_title">Comentarios</div>'
                                if(item.pubText != null && item.pubText.trim() != ''){
                                	publicationsData += '<div class="pd_16 justify_text breakword border_bottom">' + item.pubText
                                 					 +		'<div class="pd_4"></div>'
                                 					 +	'</div>'
                                }
                                else{
                                	publicationsData += '<div class="pd_16 opacity_color b_text border_bottom">'
                                					 +		'Sin Comentarios<div class="pd_4"></div>'
                                					 + 	'</div>'
                                }
                publicationsData +=       '</div>'
                                 + 		 '<div class="pd_llist">'
	                             +     		'<div class="pd_4"></div>'
	                             +     		'<div class="sl_title">Archivos Adjuntos</div>'
	                             + 		 '</div>'
	                             +       '<div class="pd_llist hidecontent_button" data-id="' + item.idPublication + '">'
                                 +           '<span class="txtprimary_color sl_title">Mostrar Archivos</span>'
                                 +       '</div>'
	                             + 		 '<div style="margin-bottom: 18px;" class="attached_filecontainer pd_lr8"></div>'
                				 + '</div>'   
                                 + '<div class="pd10_16 listitemactions bg_lightgray autooverflow">'
                                    if(req.session.privilegio == 1){
                                        publicationsData += '<div class="autocol right_float">'
                                                         +    '<span title="Responder" class="circle bg_reply hover" onclick="sendFeedback(&quot;' + item.idPublication + '&quot;)"></span>'
                                    }
                                    if(req.session.privilegio == 2){
                                        publicationsData += '<div style="margin-top: 11px;" class="autocol txtprimary_color sl_title underline" onclick="showFeedbacks(&quot;' + item.idPublication + '&quot;)">Mostrar Respuestas</div>'
                                                         +    '<div class="autocol right_float">'

                                        if(req.session.datos[0].userEmail == item.userEmail){
                                            publicationsData += '<span title="Editar" class="circle bg_editgray hover" onclick="editPublication(&quot;' + item.idPublication + '&quot;)"></span>'
                                                             +  '<span title="Eliminar" class="circle bg_delete hover" onclick="deletePublication(&quot;' + item.idPublication + '&quot;)"></span>'
                                        }
                                    }

                publicationsData +=       '</div>'
                                 +     '</div>'
                                 +   '</div>';
            }

            res.send(publicationsData);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('Error');
		}
	});
};

// FUNCION PARA MOSTRAR PUBLICACIONES QUE HACE EL PROFESOR
exports.getPublicationAttachedFiles = function(req, res){
	var database = new base();

	var idPublication = req.query.idPublication;

	stringQuery = 'SELECT pa.*, t.idTeacher '
				+ '	FROM publicationAttachedFile AS pa '
				+ ' INNER JOIN Publication as p '
				+ ' 	ON p.idPublication = pa.Publication_idPublication '
				+ ' INNER JOIN Teacher as t '
				+ ' 	ON t.User_userEmail = p.Teacher_User_userEmail '
				+ '	WHERE idPublication = "' + idPublication + '";';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
                 
            if(result.length != 0){
				for(var i in result){
	                var item = result[i];
	                stringData += '<div class="attached_fileinner">'
	               				+ 	'<span class="v_middle bg_file bg_blue borad"></span>'
				                + 	'<div class="v_middle sl_title opacity_color" title="' + item.publicationAttachedNameFile + '">' + item.publicationAttachedNameFile + '</div>'
				                /*+ 	'<a href="publications/' + item.idTeacher + '/' + item.publicationAttachedNameFile + '">'*/
				                + 	'<span title="Descargar" class="right_float bg_download hover" onclick="downloadAttachment(&quot;' + item.idTeacher + '/' + item.publicationAttachedNameFile + '&quot;)"></span>'
				                /*+	'</a>'*/
				                + '</div>';
				    if(i < result.length - 1){
	                	stringData += '<div class="pd_4"></div>'
	                }
	            }
	        }

            res.send(stringData);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('Error');
		}
	});
};

// FUNCION PARA DESCARGAR ARCHIVOS
exports.downloadAttachment = function(req, res){

	var directory = req.query.file;
	console.log(directory);

	var file = 'C:/Users/Alex/Desktop/SMDE-Prototipos/public/publications/' + directory;

	var filename = path.basename(file);
	var mimetype = mime.lookup(file);

	res.setHeader('Content-disposition', 'attachment; filename=' + filename);
	res.setHeader('Content-type', mimetype);

	var filestream = fs.createReadStream(file);
	filestream.pipe(res);

};