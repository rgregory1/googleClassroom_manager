function getDataForSearch() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const ws = ss.getActiveSheet()

  let data =  ws.getRange(2,1,ws.getLastRow()-1, 4).getValues()
  return data
  // let rawData = ws.getDataRange().getValues()
  // let data = rawData.map(x => [x[0],x[1],x[3],x[6]])
  
  // return data
  // return ws.getDataRange().getValues()
}

function archiveById (id){

  // let id = '526390027173'
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const ws = ss.getActiveSheet()

  let courseIds =  ws.getRange(2,2,ws.getLastRow()-1, 1).getValues().map(r => r[0].toString())

  const posIndex = courseIds.indexOf(id.toString())
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2

  archiveClass(id)

  ws.getRange(rowNumber, 4).setValue('ARCHIVED')
  console.log('complete')

}

function getCourseById(id='526390027173'){

  let courseData = {}

  const ss = SpreadsheetApp.getActiveSpreadsheet()
  const ws = ss.getActiveSheet()

  let courseIds =  ws.getRange(2,2,ws.getLastRow()-1, 1).getValues().map(r => r[0].toString())

  const posIndex = courseIds.indexOf(id.toString())
  const rowNumber = posIndex === -1 ? 0 : posIndex + 2
  const courseInfo = ws.getRange(rowNumber,1,1,6).getValues()[0]

  courseData = {
    courseId: courseInfo[1], 
    courseTeacher: courseInfo[2]
  }

  courseData.courseName = getCourseData(id)

  courseData.teachers = getAllTeachers(courseData.courseId)

  courseData.alias = getAlias(courseData.courseId)

  courseData.teachers = courseData.teachers.filter(x => x !== courseData.courseTeacher)


  return courseData
}



/**
 * simply archive one class when given the id
 */
function archiveClass(thisClass){

  Classroom.Courses.patch({courseState: "ARCHIVED"}, thisClass, {updateMask: "courseState"})

}


/**
 * remove one teacher from a class
 */
function removeCoteacherFromClass(classroomId, teacherId){

  try{ 
    let response = Classroom.Courses.Teachers.remove(classroomId, teacherId)
  } catch (err){
    return 'failed'
  }
  return 'success'
}

/**
 * add one teacher to a class
 */
function addCoteacherToClass(classroomId='526390027173', teacherId='craig.davis@mvsdschools.org'){

  try{
    let response = Classroom.Courses.Teachers.create({userId: teacherId,}, classroomId) 
  } catch(err){
    return 'failed'
  }
  return 'success'
}

function createCourse(data){

  // data = {
  //   courseName : 'hello there4',
  //   teacherId : 'russell.gregory@mvsdschools.org',
  //   alias : ''
  // }

  let resource = {
    "name": data.courseName,
    "ownerId": data.teacherId
    }

  let courseData = Classroom.Courses.create(resource)

  if (data.alias !== ''){

      addAliasToAClass(thisAlias=data.alias, courseData=courseData.id)
  }
  
  let provisionLine = [
    [
      courseData.name,
      courseData.id,
      data.teacherId,
      courseData.courseState,
      '',
      courseData.ownerId
    ]
  ]

  let provisionedSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Provisioned')

  provisionedSheet.insertRows(2)

  provisionedSheet.getRange(2,1,1,6).setValues(provisionLine)

}





