var base;
var stringQuery = '';
var fs = require('fs');

exports.constructor = function (basee) {
	base = basee;
}


/*
 * POST Methods.
 */

 //FUNCION DE LOGIN GENERAL
exports.login = function(req, res){
	var database = new base();
	var userNameLogin = req.body.sign_user;
	var userPassLogin = req.body.sign_key;
	var i = 0;

	var consulta = function(){
		database.query(stringQuery, function(error, result, row){
			if(!error && result.length > 0) {
				res.redirect('/main');
				req.session.datos = result;
			}else if(i === 3){
				console.log('Error al hacer login');
				res.json({
					errorData: {
						errorTitle: 'Error al iniciar sesión',
						errorItem: ['-  Usuario o contraseña incorrecta',
						'-  El usuario no existe dentro del sistema'],
						backUrl: '/login'
					}
				});
			}else{
				console.log('nope');
				select_usertype(i++);
				consulta();
			}
		});
	};
	
	var select_usertype = function(tipo){
		switch(tipo) {
			case 0:
				stringQuery = 'SELECT * FROM User INNER JOIN Administrator ' 
				+ ' 	ON User.userEmail = Administrator.User_userEmail ' 
				+ ' INNER JOIN Institute '
				+ ' 	ON User.Institute_idInstitute = Institute.idInstitute '
				+ ' WHERE User.userEmail="' + userNameLogin + '" AND User.userPassword="' + userPassLogin + '"; ';
				req.session.privilegio = 3;
				break;
			case 1:
				stringQuery = 'SELECT * FROM User INNER JOIN Student ' 
				+ ' 	ON User.userEmail = Student.User_userEmail ' 
				+ ' INNER JOIN Institute '
				+ ' 	ON User.Institute_idInstitute = Institute.idInstitute '
				+ ' WHERE User.userEmail="' + userNameLogin + '" AND User.userPassword="' + userPassLogin + '"; ';
				req.session.privilegio = 1;
				break;
			case 2:
				stringQuery = 'SELECT * FROM User INNER JOIN Teacher ' 
				+ ' 	ON User.userEmail = Teacher.User_userEmail ' 
				+ ' INNER JOIN Institute '
				+ ' 	ON User.Institute_idInstitute = Institute.idInstitute '
				+ ' WHERE User.userEmail="' + userNameLogin + '" AND User.userPassword="' + userPassLogin + '"; ';
				req.session.privilegio = 2;
				break;
		}
	};

	select_usertype(i);
	consulta();

};

exports.logout = function(req,res){
	req.session.destroy();
	res.redirect('/login');
}

//AGREGAR UN NUEVO ALUMNO
exports.insertStudent = function(req, res){
	var database = new base();
	var userEmail = req.body.insertStudentEmail ;
	var userName = req.body.insertStudentName ;
	var userLastName = req.body.insertStudentLastName ;
	var userSecondLastName = req.body.insertStudentSecondLastName ;
	var userSex = req.body.insertStudentSex ;
	var userPassword  = req.body.insertStudentPassword ;
	var userInstitute = req.session.datos[0].Institute_idInstitute ;

	stringQuery = 'BEGIN;';

	stringQuery += 'INSERT INTO User'
				+ ' (userEmail, userName, userLastName, userSecondLastName, userSex, userPassword, Institute_idInstitute, photoName) VALUES ('
				+ '"' + userEmail + '", '
				+ '"' + userName + '", '
				+ '"' + userLastName + '", '
				+ '"' + userSecondLastName + '", '
				+ '"' + userSex + '", '
				+ '"' + userPassword + '", '
				+ '"' + userInstitute + '", '
				+ 'UUID());';

	stringQuery += 'INSERT INTO Student (idStudent, User_userEmail)'
				+' VALUES (UUID(), '
				+ '"' + userEmail + '");';

	stringQuery += 'COMMIT;';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringQuery2 = 'SELECT s.idStudent, u.photoName ' 
							+ ' FROM Student AS s '
							+ ' INNER JOIN User AS u '
							+ ' 	ON u.userEmail = s.User_userEmail '
							+ ' WHERE u.userEmail = "' + userEmail + '";';

			database.query(stringQuery2, function(error, result, row){
				if(!error) {
					//CREAR UN NUEVO DIRECTORIO EN EL SERVIDOR PARA GUARDAR LOS ARCHIVOS QUE SUBAN LOS ALUMNOS
					/*var dir = './public/publications/' + result[0].idStudent;

					if (!fs.existsSync(dir)){
					    fs.mkdirSync(dir);
					}*/

					var readableStream = fs.createReadStream(__base + '/public/images/profilephoto.png');
					var writableStream = fs.createWriteStream(__base + '/public/profile_photos/' + result[0].photoName + '.png');

					readableStream.pipe(writableStream, {end: false});

					var readableStream2 = fs.createReadStream(__base + '/public/images/profilebackground.jpg');
					var writableStream2 = fs.createWriteStream(__base + '/public/profile_backgrounds/' + result[0].photoName + '.png');

					readableStream2.pipe(writableStream, {end: false});

					res.redirect('/management');
				}else{
					console.log('Error aqui: ' + stringQuery2 + ' Error: ' + error )
					res.render('error' , {
						errorData: {
							errorTitle: 'Error al crear directorio para Profesor en el Servidor',
							backUrl: '/management'
						}
					});
				}
			});
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al crear Alumno',
					errorItem: ['-  Es posible que ya exista un alumno con el correo ingresado',
					'-  Problemas con el Servidor'],
					backUrl: '/management'
				}
			});
		}
	});
};

//AGREGAR UN NUEVO PROFESOR
exports.insertTeacher = function(req, res){
	var database = new base();
	var userEmail = req.body.insertTeacherEmail ;
	var userName = req.body.insertTeacherName ;
	var userLastName = req.body.insertTeacherLastName ;
	var userSecondLastName = req.body.insertTeacherSecondLastName ;
	var userSex = req.body.insertTeacherSex ;
	var userPassword  = req.body.insertTeacherPassword ;
	var userInstitute = req.session.datos[0].Institute_idInstitute ;

	stringQuery = 'BEGIN;';

	stringQuery += 'INSERT INTO User'
	 			+ ' (userEmail, userName, userLastName, userSecondLastName, userSex, userPassword, Institute_idInstitute, photoName) VALUES ('
	 			+ '"' + userEmail + '", '
	 			+ '"' + userName + '", '
	 			+ '"' + userLastName + '", '
	 			+ '"' + userSecondLastName + '", '
	 			+ '"' + userSex + '", '
	 			+ '"' + userPassword + '", '
	 			+ '"' + userInstitute + '", '
	 			+ 'UUID());';

	stringQuery += 'INSERT INTO Teacher (idTeacher, User_userEmail)'
				+ ' VALUES (UUID(), '
				+ '"' + userEmail + '");';

	stringQuery += 'COMMIT;';

	database.query(stringQuery, function(error, result, row){
		if(!error) {

			var stringQuery2 = 'SELECT t.idTeacher, u.photoName ' 
							+ ' FROM Teacher AS t '
							+ ' INNER JOIN User AS u '
							+ ' 	ON u.userEmail = t.User_userEmail '
							+ ' WHERE u.userEmail = "' + userEmail + '";';

			database.query(stringQuery2, function(error, result, row){
				if(!error) {
					//CREAR UN NUEVO DIRECTORIO EN EL SERVIDOR PARA GUARDAR LOS ARCHIVOS QUE SUBAN LOS PROFESORES
					var dir = './public/publications/' + result[0].idTeacher;

					if (!fs.existsSync(dir)){
					    fs.mkdirSync(dir);
					}

					var readableStream = fs.createReadStream(__base + '/public/images/profilephoto.png');
					var writableStream = fs.createWriteStream(__base + '/public/profile_photos/' + result[0].photoName + '.png');

					readableStream.pipe(writableStream, {end: false});

					var readableStream2 = fs.createReadStream(__base + '/public/images/profilebackground.jpg');
					var writableStream2 = fs.createWriteStream(__base + '/public/profile_backgrounds/' + result[0].photoName + '.png');

					readableStream2.pipe(writableStream, {end: false});

					res.redirect('/management');
				}else{
					console.log('Error aqui: ' + stringQuery2 + ' Error: ' + error )
					res.render('error' , {
						errorData: {
							errorTitle: 'Error al crear directorio para Profesor en el Servidor',
							backUrl: '/management'
						}
					});
				}
			});
			
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al crear Profesor',
					errorItem: ['-  Es posible que ya exista un profesor con el correo ingresado',
					'-  Problemas con el Servidor'],
					backUrl: '/management'
				}
			});
		}
	});
};

//AGREGAR UN NUEVO DEPARTAMENTO
exports.insertDept = function(req, res){
	var database = new base();
	var deptIdKey = req.body.insertDeptIdKey ;
	var deptName  = req.body.insertDeptName ;
	var deptInstitute = req.session.datos[0].Institute_idInstitute ;

	stringQuery = 'INSERT INTO Department' 
					+ ' (idDepartment, departmentName, Institute_idInstitute)'
					+ ' VALUES (UUID(),'
					+ ' "' + deptName + '",'
					+ ' "' + deptInstitute + '");';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			console.log('Furulo el insert');
			res.redirect('/management');
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al crear Academia',
					errorItem: ['-  Es posible que ya exista una academia con el mismo nombre',
					'-  Problemas con el Servidor'],
					backUrl: '/management'
				}
			});
		}
	});
};

exports.insertSubject = function(req, res){
	var database = new base();
	var subjectName  = req.body.insertSubjectName ;
	var subjectLevel  = req.body.insertSubjectLevel ;
	var subjectInstitute = req.session.datos[0].Institute_idInstitute ;
	var subjectDept  = req.body.insertSubjectDept ;

	stringQuery = 'INSERT INTO Subject' 
					+ ' (idSubject, subjectName, subjectLevel, Department_Institute_idInstitute, Department_idDepartment)'
					+ ' VALUES (UUID(),'
					+ ' "' + subjectName + '",'
					+ ' "' + subjectLevel + '",'
					+ ' "' + subjectInstitute + '",'
					+ ' "' + subjectDept + '");';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			console.log('Furulo el insert');
			res.redirect('/management');
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al crear Asignatura',
					errorItem: ['-  Es posible que ya exista una asignatura con el mismo nombre',
					'-  Problemas con el Servidor'],
					backUrl: '/management'
				}
			});
		}
	});
};

exports.insertCourse = function(req, res){
	var database = new base();
	var courseName  = req.body.insertCourseName ;
	var courseLevel = req.body.insertCourseLevel ;
	var courseInstitute = req.session.datos[0].Institute_idInstitute;

	stringQuery = 'INSERT INTO Course' 
					+ ' (idCourse, courseName, courseLevel, Institute_idInstitute)'
					+ ' VALUES (UUID(),'
					+ ' "' + courseName + '",'
					+ ' "' + courseLevel + '",'
					+ ' "' + courseInstitute + '");';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			console.log('Furulo el insert');
			res.redirect('/management');
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al crear Grupo',
					errorItem: ['-  Es posible que ya exista un grupo con ese nombre',
					'-  Problemas con el Servidor'],
					backUrl: '/management'
				}
			});
		}
	});
};

exports.insertSubjectCourse = function(req, res){
	var database = new base();
	var subjectId = req.body.insertSubjectCourseSId ;
	var courseId = req.body.insertSubjectCourseCId ;

	stringQuery = 'INSERT INTO Subject_has_Course' 
					+ ' (Subject_idSubject, Course_idCourse)'
					+ ' VALUES ("' + subjectId + '",'
					+ ' "' + courseId + '");';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			console.log('Furulo el insert');
			res.redirect('/management');
		}else{
			console.log('Error aqui: ' + stringQuery + ' Error: ' + error )
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al crear Curso',
					errorItem: ['-  El curso ya existe'],
					backUrl: '/management'
				}
			});
		}
	});
};

// FUNCION PARA MOSTRAR TODOS LOS USUARIOS DE LA BASE PAPUH
exports.getUsers = function(req, res){
	var database = new base();

	stringQuery = 'SELECT * FROM User;' ;
				
	database.query(stringQuery, function(error, result, row){
		if(!error) {
			res.json(result);
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});
};

// FUNCION PARA MOSTRAR TODOS LOS USUARIOS DE LA BASE POR SU ID
exports.getUserById = function(req, res){
	var database = new base();

	stringQuery = 'SELECT * FROM User WHERE photoName = "'+ req.params.user_id +'";' ;
				
	database.query(stringQuery, function(error, result, row){
		if(!error) {
			res.json(result);
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});
};

// FUNCION PARA MOSTRAR DATOS DE administradores DE LA BASE DE DATOS
exports.getAdministratorsDatabase = function(req, res){
	var database = new base();

	stringQuery = 'SELECT User.*, idAdministrator FROM User INNER JOIN Administrator' 
				+ ' ON User.userEmail = Administrator.User_userEmail'
				+ ' WHERE Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '"'
				+ ' ORDER BY userName ASC;' ;
				
	database.query(stringQuery, function(error, result, row){
		if(!error) {
			res.send(result);
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});
};

// FUNCION PARA MOSTRAR DATOS DE ALUMNOS DE LA BASE DE DATOS
exports.getStudentsDatabase = function(req, res){
	var database = new base();

	stringQuery = 'SELECT User.*, idStudent FROM User INNER JOIN Student' 
				+ ' ON User.userEmail = Student.User_userEmail'
				+ ' WHERE Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '"' 
				+ ' ORDER BY userName ASC;';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                stringData += '<div class="colhh1 block_container bg_white" data-name="' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '">' 
                            +   '<div class="colhh1 listitem rel_pos">'
                            +       '<div class="listitem_img"><img src="profile_photos/' + item.photoName + '.png"></img></div>'
                            +       '<div class="listitem_info">'
                            +			'<div title="Opciones" class="minimenu_container">'
							+				'<div class="minimenu"><span></span><span></span><span></span></div>'
							+				'<div class="minimenu_hidden">'
							+					'<div class="pd_16 hover">Editar</div>'
							+					'<div class="pd_16 hover" onclick="deleteUser(&quot;' + item.userEmail + '&quot;)">Eliminar</div>'
							+				'</div>'
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
                            +               '<div class="pd_4"></div>'
                            +               '<div class="colhh1 pd_l12 sl_title">Id: <span class="margin_l normal_txt">' + item.idStudent + '</span></div>'
                            +               '<div class="pd_4"></div>'
                            +               '<div class="colhh1 pd_l12 sl_title">Sexo: <span class="margin_l normal_txt">' + item.userSex + '</span></div>'
                            +           '</div>'
                    		+       	'<div class="pd_8"></div>'
                            +       	'<div class="colhh1">'
                            +           	'<div class="pd_llist">'
                            +               	'<div class="sl_title">Cursos Inscritos</div>'
                            +           	'</div>'
                            +           	'<div class="pd_llist hidecontent_button"  data-id="' + item.userEmail + '">'
                            +               	'<span class="txtprimary_color sl_title">Mostrar Cursos</span>'
                            +           	'</div>'
                            +           	'<div class="person_subjectslist"></div>'
                            +       	'</div>'
                            +       '</div>'
                            +   '</div>'
                            + '</div>';
            }
			res.send(stringData);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});
};

// FUNCION PARA MOSTRAR MATERIAS DE ALUMNOS DE LA BASE DE DATOS
exports.getStudentsSubjectsDatabase = function(req, res){
	var database = new base();
	var studentEmail = req.query.studentEmail;

	stringQuery = 'SELECT idCourse, idSubject, subjectName, courseName'
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
				+ ' WHERE su.Department_Institute_idInstitute= "' + req.session.datos[0].Institute_idInstitute + '"' 
				+ ' AND userEmail= "' + studentEmail + '";' ;
				
	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                    stringData += '<div class="colhh1 pd_l12 hover">'
                            	+ 	'<div class="listitem_img"><span>B</span></div>'
                            	+ 	'<div class="listitem_info">'
                            	+ 		'<div class="listitem_title"><b>' + item.subjectName + '</b></div>'
                            	+ 		'<div class="listitem_bottomdata">Grupo: ' + item.courseName + '</div>'
                            	+ 	'</div>'
                            	+ '</div>';
                        }
			res.send(stringData);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});

};

// FUNCION PARA MOSTRAR DATOS DE PROFESORES DE LA BASE DE DATOS
exports.getTeachersDatabase = function(req, res){
	var database = new base();

	stringQuery = 'SELECT User.*, idTeacher FROM User INNER JOIN Teacher'
				+ ' ON User.userEmail = Teacher.User_userEmail'
				+ ' WHERE Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '"'
				+ ' ORDER BY userName ASC;';

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                stringData += '<div class="colhh1 block_container bg_white" data-name="' + item.userName + ' ' + item.userLastName + ' ' + item.userSecondLastName + '">' 
                            +   '<div class="colhh1 listitem rel_pos">'
                            +       '<div class="listitem_img"><img src="profile_photos/' + item.photoName + '.png"></img></div>'
                            +       '<div class="listitem_info">'
                            +			'<div title="Opciones" class="minimenu_container">'
							+				'<div class="minimenu"><span></span><span></span><span></span></div>'
							+				'<div class="minimenu_hidden">'
							+					'<div class="pd_16 hover">Editar</div>'
							+					'<div class="pd_16 hover" onclick="deleteUser(&quot;' + item.userEmail + '&quot;)">Eliminar</div>'
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
                            +               '<div class="pd_4"></div>'
                            +               '<div class="colhh1 pd_l12 sl_title">Id: <span class="margin_l normal_txt">' + item.idTeacher + '</span></div>'
                            +               '<div class="pd_4"></div>'
                            +               '<div class="colhh1 pd_l12 sl_title">Sexo: <span class="margin_l normal_txt">' + item.userSex + '</span></div>'
                            +           '</div>'
                    		+       	'<div class="pd_8"></div>'
                            +       	'<div class="colhh1">'
                            +           	'<div class="pd_llist">'
                            +               	'<div class="sl_title">Cursos Inscritos</div>'
                            +           	'</div>'
                            +           	'<div class="pd_llist hidecontent_button" data-id="' + item.userEmail + '">'
                            +               	'<span class="txtprimary_color sl_title">Mostrar Cursos</span>'
                            +           	'</div>'
                            +           	'<div class="person_subjectslist"></div>'
                            +       	'</div>'
                            +       '</div>'
                            +   '</div>'
                            + '</div>';
            }
			res.send(stringData);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});
};

// FUNCION PARA MOSTRAR MATERIAS DE PROFESOR DE LA BASE DE DATOS
exports.getTeachersSubjectsDatabase = function(req, res){
	var database = new base();
	var teacherEmail = req.query.teacherEmail;

	stringQuery = 'SELECT idTeacher, idSubject, subjectName, courseName'
					+ ' FROM User as u'
					+ ' INNER JOIN Teacher as s'
					+ '     ON u.userEmail = s.User_userEmail'
					+ ' INNER JOIN Teacher_has_Subject_has_Course as ss'
					+ '     ON s.idTeacher = ss.Teacher_idTeacher'
					+ ' INNER JOIN Subject_has_Course as sc'
					+ '     ON ss.Subject_has_Course_Subject_idSubject = sc.Subject_idSubject'
					+ '		AND ss.Subject_has_Course_Course_idCourse = sc.Course_idCourse'
					+ ' INNER JOIN Subject as su'
					+ '     ON sc.Subject_idSubject = su.idSubject'
					+ ' INNER JOIN Course as c'
					+ '     ON sc.Course_idCourse = c.idCourse'
					+ ' WHERE su.Department_Institute_idInstitute= "' + req.session.datos[0].Institute_idInstitute + '"' 
					+ ' AND userEmail= "' + teacherEmail + '";' ;

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                    stringData += '<div class="colhh1 pd_l12 hover">'
                            	+ 	'<div class="listitem_img"><span>B</span></div>'
                            	+ 	'<div class="listitem_info">'
                            	+ 		'<div class="listitem_title"><b>' + item.subjectName + '</b></div>'
                            	+ 		'<div class="listitem_bottomdata">Grupo: ' + item.courseName + '</div>'
                            	+ 	'</div>'
                            	+ '</div>';
                        }
			res.send(stringData);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});

};

// FUNCION PARA MOSTRAR DATOS DE DEPARTAMENTOS DE LA BASE DE DATOS
exports.getDepartmentsDatabase = function(req, res){
	var database = new base();

	stringQuery = 'SELECT * FROM Department'
				+ ' WHERE Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '";' ;

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                stringData += '<div class="colhh1 block_container bg_white" data-name="' +item.departmentName + '">' 
                            +   '<div class="colhh1 listitem rel_pos">'
                            +       '<div class="listitem_img"><span></span></div>'
                            +       '<div class="listitem_info">'
                            +			'<div title="Opciones" class="minimenu_container">'
							+				'<div class="minimenu"><span></span><span></span><span></span></div>'
							+				'<div class="minimenu_hidden">'
							+					'<div class="pd_16 hover">Editar</div>'
							+					'<div class="pd_16 hover" onclick="deleteItem(&quot;' + item.idDepartment + '&quot;)">Eliminar</div>'
							+				'</div>'
							+			'</div>'
                            +           '<div class="listitem_title"><b>' + item.departmentName + '</b></div>'
                            +           '<div class="listitem_bottomdata">Academia'
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            +   '<div class="colhh1">'
                            +       '<div class="list_borderleft">'
                            +           '<div class="pd_llist">'
                            +               '<div class="sl_title">Información</div>'
                            +           '</div>'
                            +           '<div class="pd_llist">'
                            +               '<div class="colhh1 pd_l12 sl_title">Id: <span class="margin_l normal_txt">' + item.idDepartment + '</span></div>'
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            + '</div>';
            }
			res.send(stringData);

		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});
};

// FUNCION PARA MOSTRAR DATOS DE ASIGNATURAS DE LA BASE DE DATOS
exports.getSubjectsDatabase = function(req, res){
	var database = new base();

	stringQuery = 'SELECT * FROM Subject'
				+ ' WHERE Department_Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '";' ;

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                stringData += '<div class="colhh1 block_container bg_white" data-name="' +item.subjectName + '">' 
                            +   '<div class="colhh1 listitem rel_pos">'
                            +       '<div class="listitem_img"><span></span></div>'
                            +       '<div class="listitem_info">'
                            +			'<div title="Opciones" class="minimenu_container">'
							+				'<div class="minimenu"><span></span><span></span><span></span></div>'
							+				'<div class="minimenu_hidden">'
							+					'<div class="pd_16 hover">Editar</div>'
							+					'<div class="pd_16 hover" onclick="deleteItem(&quot;' + item.idSubject + '&quot;)">Eliminar</div>'
							+				'</div>'
							+			'</div>'
                            +           '<div class="listitem_title"><b>' + item.subjectName + '</b></div>'
                            +           '<div class="listitem_bottomdata">Asignatura'
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            +   '<div class="colhh1">'
                            +       '<div class="list_borderleft">'
                            +           '<div class="pd_llist">'
                            +               '<div class="sl_title">Información</div>'
                            +           '</div>'
                            +           '<div class="pd_llist">'
                            +               '<div class="colhh1 pd_l12 sl_title">Id: <span class="margin_l normal_txt">' + item.idSubject + '</span></div>'
                            +				'<div class="pd_4"></div>'
                            +               '<div class="colhh1 pd_l12 sl_title">Nivel: <span class="margin_l normal_txt">' + item.subjectLevel + '</span></div>'
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            + '</div>';
            }
			res.send(stringData);
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});
};

// FUNCION PARA MOSTRAR DATOS DE CURSOS DE LA BASE DE DATOS
exports.getCoursesDatabase = function(req, res){
	var database = new base();
	stringQuery = 'SELECT * FROM Course'
				+ ' WHERE Institute_idInstitute="' + req.session.datos[0].Institute_idInstitute + '";' ;
	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringData = '';
			for(var i in result){
                var item = result[i];
                stringData += '<div class="colhh1 block_container bg_white" data-name="' +item.courseName + '">' 
                            +   '<div class="colhh1 listitem rel_pos">'
                            +       '<div class="listitem_img"><span></span></div>'
                            +       '<div class="listitem_info">'
                            +			'<div title="Opciones" class="minimenu_container">'
							+				'<div class="minimenu"><span></span><span></span><span></span></div>'
							+				'<div class="minimenu_hidden">'
							+					'<div class="pd_16 hover">Editar</div>'
							+					'<div class="pd_16 hover" onclick="deleteItem(&quot;' + item.idCourse + '&quot;)">Eliminar</div>'
							+				'</div>'
							+			'</div>'
                            +           '<div class="listitem_title"><b>' + item.courseName + '</b></div>'
                            +           '<div class="listitem_bottomdata">Grupo'
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            +   '<div class="colhh1">'
                            +       '<div class="list_borderleft">'
                            +           '<div class="pd_llist">'
                            +               '<div class="sl_title">Información</div>'
                            +           '</div>'
                            +           '<div class="pd_llist">'
                            +               '<div class="colhh1 pd_l12 sl_title">Id: <span class="margin_l normal_txt">' + item.idCourse + '</span></div>'
                            +				'<div class="pd_4"></div>'
                            +               '<div class="colhh1 pd_l12 sl_title">Nivel: <span class="margin_l normal_txt">' + item.courseLevel + '</span></div>'
                            +           '</div>'
                            +       '</div>'
                            +   '</div>'
                            + '</div>';
            }
			res.send(stringData);
			
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.send('error');
		}
	});

};
