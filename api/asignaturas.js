var base;
var stringQuery = '';

exports.constructor = function (basee) {
	base = basee;
}

/*
 * POST Methods.
 */

// FUNCION PARA MOSTRAR ASIGNATURAS/GRUPOS DEL USUARIO
exports.getSubjectsCoursesDatabase = function(req, res){
	var database = new base();

	// SI EL USUARIO ES TIPO ALUMNO
	if(req.session.privilegio == 1){
		stringQuery = 'SELECT idSubject, idCourse, subjectName, courseName, departmentName, subjectLevel '
					+ ' FROM Subject_has_Course a '
					+ ' INNER JOIN Subject AS s '
					+ ' 	ON s.idSubject = a.Subject_idSubject '
					+ ' INNER JOIN Course AS c '
					+ ' 	ON c.idCourse = a.Course_idCourse '
					+ ' INNER JOIN Department AS d '
					+ ' 	ON d.idDepartment = s.Department_idDepartment '
					+ ' WHERE Subject_idSubject NOT IN( '
					+ ' 	SELECT Subject_has_Course_Subject_idSubject  '
					+ ' 	FROM Student_has_Subject_has_Course b '
					+ ' 	WHERE b.Student_idStudent = "' + req.session.datos[0].idStudent + '" '
					+ ' ) '
					+ ' AND d.Institute_idInstitute = "' + req.session.datos[0].Institute_idInstitute + '" '
					+ ' ORDER BY courseName ASC, subjectName ASC; ';
	}
	
	// SI EL USUARIO ES TIPO PROFESOR
	if(req.session.privilegio == 2){
		stringQuery = 'SELECT idSubject, idCourse, subjectName, courseName, departmentName, subjectLevel '
					+ ' FROM Subject_has_Course a '
					+ ' INNER JOIN Subject AS s '
					+ ' 	ON s.idSubject = a.Subject_idSubject '
					+ ' INNER JOIN Course AS c '
					+ ' 	ON c.idCourse = a.Course_idCourse '
					+ ' INNER JOIN Department AS d '
					+ ' 	ON d.idDepartment = s.Department_idDepartment '
					+ ' WHERE (a.Subject_idSubject, a.Course_idCourse) NOT IN( '
					+ ' 	SELECT Subject_has_Course_Subject_idSubject, Subject_has_Course_Course_idCourse  '
					+ ' 	FROM Teacher_has_Subject_has_Course b '
					+ ' 	WHERE b.Teacher_idTeacher = "' + req.session.datos[0].idTeacher + '" '
					+ ' ) '
					+ ' AND d.Institute_idInstitute = "' + req.session.datos[0].Institute_idInstitute + '" '
					+ ' ORDER BY courseName ASC, subjectName ASC; ';
	}

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			var stringDataCourses = '';
			for(var i in result){
                var item = result[i];
                stringDataCourses += '<div class="colhh1 slide_list" data-subjectfilter= "' + item.subjectName + '" data-coursefilter="' + item.courseName + '">' 
                +   '<div class="colhh1 hover pd_lr8 listitem rel_pos" data-subject="' + item.idSubject + '" data-course="' + item.idCourse +'" data-name="' + item.subjectName + '">'
                +       '<div class="listitem_righticon circle bg_plusgray rippleria-dark" title="Agregar"></div>'
                +       '<div class="listitem_img"><span></span></div>'
                +       '<div class="listitem_info">'
                +           '<div class="listitem_alert txt_red"></div>'
                +           '<div class="listitem_title"><b>' + item.subjectName + '</b></div>'
                +           '<div class="listitem_bottomdata">' + item.courseName + '</div>'
                +       '</div>'
                +   '</div>'
                +   '<div class="colhh1 innerlistitem">'
                +       '<div class="list_borderleft">'
                +           '<div class="pd_llist">'
                +               '<div class="sl_title">Información</div>'
                +           '</div>'
                +           '<div class="pd_llist">'
                +               '<div class="colhh1 pd_l12 sl_title">Academia: <span class="margin_l normal_txt">' + item.departmentName + '</span></div>'
                +               '<div class="pd_4"></div>'
                +               '<div class="colhh1 pd_l12 sl_title">Nivel:<span class="margin_l normal_txt">' + item.subjectLevel + '</span></div>'
                +           '</div>'
                +       '</div>'
                +   '</div>'
                + '</div>';
            }
			res.send(stringDataCourses);
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al obtener Grupos',
					errorItem: ['-  Problemas con el servidor',
					'-  Problemas con la Base de Datos'],
					backUrl: '/subjects'
				}
			});
		}
	});

};

// FUNCION PARA INSERTAR ASIGNATURAS/GRUPOS
exports.insertSubjectsCoursesSelfUser = function(req, res){
	var database = new base();

	var coursesInput = req.body.insertCoursesField;

	//PRIMERO SEPARAMOS LOS CURSOS A INSCRIBIR
	var coursesArray = coursesInput.split(',');
	//ELIMINAMOS EL ULTIMO ELEMENTO POR QUE ES NULO
	coursesArray.pop();

	stringQuery = 'BEGIN;';

	//INSERTAMOS LOS CURSOS UNO POR UNO
	for( var i = 0; i < coursesArray.length; i++ ) {
	    var coursePos = coursesArray[i];
	    //SEPARAMOS ASIGNATURAS DE GRUPOS;
	    var subArray = coursePos.split('/');

	    // SI EL USUARIO ES TIPO ALUMNO
	    if(req.session.privilegio == 1){

	    	stringQuery	+= 'INSERT INTO Student_has_Subject_has_Course'
						+ ' (Student_idStudent, Subject_has_Course_Subject_idSubject, Subject_has_Course_Course_idCourse)'
						+ ' VALUES' 
						+ '("'  + req.session.datos[0].idStudent +  '",'
						+ ' "' + subArray[0] + '",'
						+' "' + subArray[1] + '");';
		}

		// SI EL USUARIO ES TIPO PROFESOR
	    if(req.session.privilegio == 2){

		   	stringQuery	+= 'INSERT INTO Teacher_has_Subject_has_Course'
						+ ' (Teacher_idTeacher, Subject_has_Course_Subject_idSubject, Subject_has_Course_Course_idCourse)'
						+ ' VALUES' 
						+ '("'  + req.session.datos[0].idTeacher +  '",'
						+ ' "' + subArray[0] + '",'
						+' "' + subArray[1] + '");';
		    	
		}
		
	}
	stringQuery += 'COMMIT;'

	database.query(stringQuery, function(error, result, row){
		if(!error) {
			console.log(stringQuery);
			res.redirect('/subjects');
		}else{
			console.log('Error en esta consulta: ' + stringQuery + ' Error: ' + error);
			res.render('error' , {
				errorData: {
					errorTitle: 'Error al inscribir Curso',
					errorItem: ['-  Problemas con el servidor',
					'-  Posiblemente algun dato enviado es nulo o incorrecto'],
					backUrl: '/subjects'
				}
			});
		}
	});

};
