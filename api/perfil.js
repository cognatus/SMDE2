var base;
var stringQuery = '';

var fs = require('fs');

exports.constructor = function (basee) {
	base = basee;
}

exports.setProfileTheme = function(req, res){
	var database = new base();
	var theme = req.session.datos[0].darkTheme;

	if(theme == 0){
		stringQuery = 'UPDATE User SET darkTheme = 1'
			+ ' WHERE userEmail="' + req.session.datos[0].userEmail + '";' ;
		req.session.datos[0].darkTheme = 1;
	}
	if(theme == 1){
		stringQuery = 'UPDATE User SET darkTheme = 0'
			+ ' WHERE userEmail="' + req.session.datos[0].userEmail + '";' ;
		req.session.datos[0].darkTheme = 0;
	}
	
	database.query(stringQuery, function(error, result, row){
		if(!error) {
			console.log('Cambio de tema correctamente');
			res.redirect('/settings');
		}else{
			console.log('Error en esta sentencia: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});
};

exports.setProfileMsmColor = function(req, res){
	var database = new base();
	var msmColor = req.body.msmValueColor;

	stringQuery = 'UPDATE User SET msmColor="' + msmColor + '"'
	+ ' WHERE userEmail="' + req.session.datos[0].userEmail + '";';
	req.session.datos[0].msmColor = msmColor;
	
	database.query(stringQuery, function(error, result, row){
		if(!error) {
			console.log('Cambio de color correcto');
			res.redirect('/settings');
		}else{
			console.log('Error en esta sentencia: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});	
};

// FUNCION PARA MOSTRAR MATERIAS DE PERFIL DE LA BASE DE DATOS
exports.getProfileSubjectsDatabase = function(req, res){
	var database = new base();

	//SI EL USUARIO ES TIPO ALUMNO
	if(req.session.privilegio == 1){
		stringQuery = 'SELECT idSubject, idCourse, subjectName, courseName, subjectLevel, departmentName'
					+ ' FROM User AS u'
					+ ' INNER JOIN Student AS s'
					+ '     ON u.userEmail = s.User_userEmail'
					+ ' INNER JOIN Student_has_Subject_has_Course AS ss'
					+ '     ON s.idStudent = ss.Student_idStudent'
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
	//SI EL USUARIO ES TIPO PROFESOR
	else if(req.session.privilegio == 2){
		stringQuery = 'SELECT idSubject, idCourse, subjectName, courseName, subjectLevel, departmentName'
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
			var stringDataProfileCourses = '';
			for(var i in result){
                var item = result[i];
                stringDataProfileCourses += '<div class="colhh1 block_container bg_white">' 
						                +   '<div class="colhh1 listitem rippleria-dark" data-name="' + item.subjectName + '" data-type="' + item.courseName +'">'
						                +       '<div class="listitem_img"><span></span></div>'
						                +       '<div class="listitem_info">'
						                +			'<div title="Opciones" class="minimenu_container">'
										+				'<div class="minimenu"><span></span><span></span><span></span></div>'
										+				'<div class="minimenu_hidden">'
										+					'<div class="pd_16 hover">Eliminar</div>'
										+				'</div>'
										+			'</div>'
						                +           '<div class="listitem_rightinfo subject_prom">Promedio:<label></label></div>'
						                +           '<div class="listitem_title"><b>' + item.subjectName + '</b></div>'
						                +           '<div class="listitem_bottomdata rank" title="Nivel ' + item.subjectLevel + '" data-level="' + item.subjectLevel + '"></div>'
						                +       '</div>'
						                +   '</div>'
						                +   '<div class="colhh1">'
						                +       '<div class="list_borderleft">'
						                +           '<div class="pd_llist">'
						                +               '<div class="sl_title">Información</div>'
						                +           '</div>'
						                +           '<div class="pd_llist">'
						                +               '<div class="colhh1 pd_l12 sl_title">Grupo: <span class="margin_l normal_txt">' + item.courseName + '</span></div>'
						                +               '<div class="pd_4"></div>'
						                +               '<div class="colhh1 pd_l12 sl_title">Academia: <span class="margin_l normal_txt">' + item.departmentName + '</span></div>'
						                +               '<div class="pd_4"></div>'
						                +               '<div class="colhh1 pd_l12 sl_title">Nivel:<span class="margin_l normal_txt">' + item.subjectLevel + '</span></div>'
						                +           '</div>'
                if(req.session.privilegio == 1 || req.session.privilegio == 2){
                    stringDataProfileCourses +=     '<div class="pd_8"></div>'
			                                +       '<div class="colhh1">'
			                                +           '<div class="pd_llist">'
			                                +               '<div class="sl_title">Personas en este Curso</div>'
			                                +           '</div>'
			                                +           '<div class="pd_llist hidecontent_button"  data-id="' + item.idSubject + '" data-subid="' + item.idCourse + '">'
			                                +               '<span class="txtprimary_color sl_title">Mostrar Personas</span>'
			                                +           '</div>'
			                                +           '<div class="course_peoplelist"></div>'
			                                +       '</div>';
                }
            	stringDataProfileCourses +=       '</div>'
							            +   '</div>'
							            + '</div>';
            }
			res.send(stringDataProfileCourses);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});

};

// FUNCION PARA MOSTRAR CONTACTOS (ADMINITRADORES)
exports.getProfileContactsAdministrators = function(req, res){
	var database = new base();

	stringQuery = 'SELECT userName, userLastName, userSecondLastName, userEmail, photoName '
				+ ' FROM User AS u'
				+ ' INNER JOIN Administrator AS a ' 
				+ ' ON u.userEmail = a.User_userEmail '
				+ ' WHERE u.Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '" '
				+ ' AND u.userEmail != "' + req.session.datos[0].userEmail + '";' ;

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringDataAdmins = '';
			for(var i in result){
                var item = result[i];
                stringDataAdmins += '<div class="colhh1 block_container bg_white" data-name="' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '" data-type="Administrador">' 
                            +   '<div class="colhh1 listitem rel_pos">'
                            +       '<div class="listitem_img"><img src="profile_photos/' + item.photoName + '.png"></img></div>'
                            +       '<div class="listitem_info">'
                            +			'<div title="Opciones" class="minimenu_container">'
							+				'<div class="minimenu"><span></span><span></span><span></span></div>'
							+				'<div class="minimenu_hidden">'
							+       			'<a href="/messages">'
							+						'<div class="pd_16 hover">Enviar Mensaje</div>'
							+       			'</a>'
							+				'</div>'
							+			'</div>'
                            +           '<div class="listitem_title"><b>' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '</b></div>'
                            +           '<div class="listitem_bottomdata">Administrador'
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            +   '<div class="colhh1">'
                            +       '<div class="list_borderleft">'
                            +           '<div class="pd_llist">'
                            +               '<div class="sl_title">Información</div>'
                            +           '</div>'
                            +           '<div class="pd_llist">'
                            +               '<div class="colhh1 pd_l12 sl_title">Correo: <span class="margin_l normal_txt">' + item.userEmail + '</span></div>'             
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            + '</div>';
            }
			res.send(stringDataAdmins);
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});
};

// FUNCION PARA MOSTRAR CONTACTOS (ESTUDIANTES)
exports.getProfileContactsStudents = function(req, res){
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
			var stringDataStudents = '';
			for(var i in result){
                var item = result[i];
         stringDataStudents += '<div class="colhh1 block_container bg_white" data-name="' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '" data-type="Alumno">' 
                            +   '<div class="colhh1 listitem rel_pos">'
                            +       '<div class="listitem_img"><img src="profile_photos/' + item.photoName + '.png"></img></div>'
                            +       '<div class="listitem_info">'
                            +			'<div title="Opciones" class="minimenu_container">'
							+				'<div class="minimenu"><span></span><span></span><span></span></div>'
							+				'<div class="minimenu_hidden">'
							+       			'<a href="/messages">'
							+						'<div class="pd_16 hover">Enviar Mensaje</div>'
							+					'</a>'
							if(req.session.privilegio == 2){
								stringDataStudents += '<div class="pd_16 hover">Calificar</div>'
							}
		 stringDataStudents +=       		'</div>'
							+			'</div>'
                            +           '<div class="listitem_title"><b>' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '</b></div>'
                            +           '<div class="listitem_bottomdata">Alumno'
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            +   '<div class="colhh1">'
                            +       '<div class="list_borderleft">'
                            +           '<div class="pd_llist">'
                            +               '<div class="sl_title">Información</div>'
                            +           '</div>'
                            +           '<div class="pd_llist">'
                            +               '<div class="colhh1 pd_l12 sl_title">Correo: <span class="margin_l normal_txt">' + item.userEmail + '</span></div>'             
                            +           '</div>';

                if(req.session.privilegio != 3){
                    stringDataStudents +=       '<div class="pd_8"></div>'
                                +       '<div class="colhh1">'
                                +           '<div class="pd_llist">'
                                +               '<div class="sl_title">Cursos en común</div>'
                                +           '</div>'
                                +           '<div class="pd_llist hidecontent_button"  data-id="' + item.userEmail + '">'
                                +               '<span class="txtprimary_color sl_title">Mostrar Cursos</span>'
                                +           '</div>'
                                +           '<div class="person_subjectslist"></div>'
                                +       '</div>';
                }

                stringDataStudents +=       '</div>'
                            +   '</div>'
                            + '</div>';
            }
			res.send(stringDataStudents);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});
};

// FUNCION PARA MOSTRAR CONTACTOS (PROFESORES)
exports.getProfileContactsTeachers = function(req, res){
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
		stringQuery = 'SELECT userEmail, userName, userLastName, userSecondLastName, photoName '
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
			var stringDataTeachers = '';
			for(var i in result){
                var item = result[i];
                stringDataTeachers += '<div class="colhh1 block_container bg_white" data-name="' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '" data-type="Profesor">' 
                            +   '<div class="colhh1 listitem rel_pos">'
                            +       '<div class="listitem_img"><img src="profile_photos/' + item.photoName + '.png"></img></div>'
                            +       '<div class="listitem_info">'
                            +			'<div title="Opciones" class="minimenu_container">'
							+				'<div class="minimenu"><span></span><span></span><span></span></div>'
							+				'<div class="minimenu_hidden">'
							+       			'<a href="/messages">'
							+						'<div class="pd_16 hover">Enviar Mensaje</div>'
							+       			'</a>'
							+				'</div>'
							+			'</div>'
                            +           '<div class="listitem_title"><b>' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '</b></div>'
                            +           '<div class="listitem_bottomdata">Profesor'
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            +   '<div class="colhh1">'
                            +       '<div class="list_borderleft">'
                            +           '<div class="pd_llist">'
                            +               '<div class="sl_title">Información</div>'
                            +           '</div>'
                            +           '<div class="pd_llist">'
                            +               '<div class="colhh1 pd_l12 sl_title">Correo: <span class="margin_l normal_txt">' + item.userEmail + '</span></div>'             
                            +           '</div>';

                if(req.session.privilegio != 3){
                    stringDataTeachers +=       '<div class="pd_8"></div>'
                                +       '<div class="colhh1">'
                                +           '<div class="pd_llist">'
                                +               '<div class="sl_title">Cursos en común</div>'
                                +           '</div>'
                                +           '<div class="pd_llist hidecontent_button"  data-id="' + item.userEmail + '">'
                                +               '<span class="txtprimary_color sl_title">Mostrar Cursos</span>'
                                +           '</div>'
                                +           '<div class="person_subjectslist"></div>'
                                +       '</div>';
                }

                stringDataTeachers +=       '</div>'
                            +   '</div>'
                            + '</div>';
            }
			res.send(stringDataTeachers);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});

};

// FUNCION PARA MOSTRAR COINCIDENCIAS (ESTUDIANTES)
exports.getStudentCoincidences = function(req, res){
	var database = new base();
	var studentEmail = req.query.studentEmail;
	
	//SI EL USUARIO ES TIPO ALUMNO
	if(req.session.privilegio == 1){
		stringQuery = 'SELECT subjectName, courseName '
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
					+ '	AND s.User_userEmail = "' + studentEmail + '"; ';
	}

	//SI EL USUARIO ES TIPO PROFESOR
	else if(req.session.privilegio == 2){
		stringQuery = 'SELECT subjectName, courseName '
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
					+ '	AND s.User_userEmail = "' + studentEmail + '"; ';
	}

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var	stringDataCoincidences = '';
			for(var i in result){
                var item = result[i];
                stringDataCoincidences += '<div class="colhh1 pd_l12 hover">'
						                + 	'<div class="listitem_img"><span>B</span></div>'
						                + 	'<div class="listitem_info">'
						                + 		'<div class="listitem_title"><b>' + item.subjectName + '</b></div>'
						                + 		'<div class="listitem_bottomdata">Grupo: ' + item.courseName + '</div>'
						                + 	'</div>'
						                + '</div>';
                }
			res.send(stringDataCoincidences);
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});
};


// FUNCION PARA MOSTRAR COINCIDENCIAS (PROFESORES)
exports.getTeacherCoincidences = function(req, res){
	var database = new base();
	var teacherEmail = req.query.teacherEmail;

	//SI EL USUARIO ES TIPO ALUMNO
	if(req.session.privilegio == 1){
		stringQuery = 'SELECT subjectName, courseName '
					+ ' FROM Student_has_Subject_has_Course a '
					+ '	JOIN Teacher_has_Subject_has_Course b '
					+ '		ON a.Subject_has_Course_Subject_idSubject = b.Subject_has_Course_Subject_idSubject '
					+ '		AND a.Subject_has_Course_Course_idCourse = b.Subject_has_Course_Course_idCourse '
					+ '		AND a.Student_idStudent != b.Teacher_idTeacher '
					+ '	INNER JOIN Subject as sub '
					+ '		ON sub.idSubject = a.Subject_has_Course_Subject_idSubject '
					+ '	INNER JOIN Course as c '
					+ '		ON c.idCourse = a.Subject_has_Course_Course_idCourse '
					+ '	INNER JOIN Teacher as t '
					+ '		ON t.idTeacher = b.Teacher_idTeacher '
					+ '	INNER JOIN User as u '
					+ '		ON u.userEmail = t.User_userEmail '
					+ '	WHERE a.Student_idStudent = "' + req.session.datos[0].idStudent + '" '
					+ '	AND b.Teacher_idTeacher != "' + req.session.datos[0].idStudent + '" '
					+ '	AND t.User_userEmail = "' + teacherEmail + '"; ';
	}

	//SI EL USUARIO ES TIPO PROFESOR
	else if(req.session.privilegio == 2){
		stringQuery = 'SELECT subjectName, courseName '
					+ ' FROM Teacher_has_Subject_has_Course a '
					+ '	JOIN Teacher_has_Subject_has_Course b '
					+ '		ON a.Subject_has_Course_Subject_idSubject = b.Subject_has_Course_Subject_idSubject '
					+ '		AND a.Subject_has_Course_Course_idCourse = b.Subject_has_Course_Course_idCourse '
					+ '		AND a.Teacher_idTeacher != b.Teacher_idTeacher '
					+ '	INNER JOIN Subject as sub '
					+ '		ON sub.idSubject = a.Subject_has_Course_Subject_idSubject '
					+ '	INNER JOIN Course as c '
					+ '		ON c.idCourse = a.Subject_has_Course_Course_idCourse '
					+ '	INNER JOIN Teacher as t '
					+ '		ON t.idTeacher = b.Teacher_idTeacher '
					+ '	INNER JOIN User as u '
					+ '		ON u.userEmail = t.User_userEmail '
					+ '	WHERE a.Teacher_idTeacher = "' + req.session.datos[0].idTeacher + '" '
					+ '	AND b.Teacher_idTeacher != "' + req.session.datos[0].idTeacher + '" '
					+ '	AND t.User_userEmail = "' + teacherEmail + '"; ';
	}

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var	stringDataCoincidences = '';
			for(var i in result){
                var item = result[i];
                stringDataCoincidences += '<div class="colhh1 pd_l12 hover">'
						                + 	'<div class="listitem_img"><span>B</span></div>'
						                + 	'<div class="listitem_info">'
						                + 		'<div class="listitem_title"><b>' + item.subjectName + '</b></div>'
						                + 		'<div class="listitem_bottomdata">Grupo: ' + item.courseName + '</div>'
						                + 	'</div>'
						                + '</div>';
                }
			res.send(stringDataCoincidences);
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.redirect('/error');
		}
	});
};

exports.updateProfilePhotos = function(req, res){

	var backImage = req.files.updateProfileBack;
	var profileImage = req.files.updateProfilePhoto;
	var nameImage = req.session.datos[0].photoName;

	console.log(__base + "/public/profile_back/" + nameImage + ".jpg");	
	if( backImage.originalFilename != '' ){

		var readableStream = fs.createReadStream(backImage.path);
		var writableStream = fs.createWriteStream(__base + "/public/profile_backgrounds/" + nameImage + ".png");

		readableStream.pipe(writableStream, {end: false});

		res.redirect('/profile');
	}

	if( profileImage.originalFilename != '' ){

		var readableStream = fs.createReadStream(profileImage.path);
		var writableStream = fs.createWriteStream(__base + "/public/profile_photos/" + nameImage + ".png");

		readableStream.pipe(writableStream, {end: false});

		res.redirect('/profile');
	}
 };