function createOneClassroom(name, ownerId,classAlias, index) {

  const classList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CreateClasses')

  let crs = {
    name : name,
    ownerId : ownerId
    // name : 'Trial 22-23 Course 1',
    // ownerId : "109859049233455654657"
  }
  
  let course = Classroom.Courses.create(crs);
  Logger.log('Course created: %s (%s)', course.name, course.id);
  let newCourseId = course.id;
  let state = course.courseState

  let alias = {
    'alias': 'd:' + classAlias
  }
  const course_alias = Classroom.Courses.Aliases.create(resource=alias, courseId=newCourseId);
    Logger.log('%s successfully added as an alias!', course_alias.alias);

  classList.getRange(index + 2, 4).setValue(state)
}




function createClassrooms(){

  const classList = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('CreateClasses')
  
  let classData = classList.getDataRange().getValues()

  classData.shift()

  classData.forEach((thisClass, index) => {
    createOneClassroom(thisClass[0],thisClass[1], thisClass[2], index)
  })
}