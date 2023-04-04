
function collectCourseInfo(courseId='488854071820'){

  let courseData = {}

  courseData.teachers = getAllTeachers(courseId)

  courseData.alias = getAlias(courseId)

  return courseData
}


function getAlias(courseId){

  let alias = []
  let response = Classroom.Courses.Aliases.list(courseId)

  if(response.aliases){
    alias = response.aliases.map(x => x.alias)
  }
  
  return alias
}


function getAllTeachers(courseId) {
  
  let response = Classroom.Courses.Teachers.list(courseId)   

  let allTeachersList = response.teachers.map(x => x.profile.emailAddress)

  return allTeachersList
  
}

function getCourseData(courseId = '526390027173'){

  let response = Classroom.Courses.get(courseId)

  return response.name
}

/**
 *  remove one alias from a class
 */
function removeAliasForOneClass(thisAlias,courseId){

  let response2 = Classroom.Courses.Aliases.remove(courseId,thisAlias)

  console.log(response2)
  return 'success'

}

/**
 * add alias to a class
 */
function addAliasToAClass(thisAlias='d:new alias 1', courseId='526390027173'){

  let alias = {
    'alias' : thisAlias
  }
  
  let response3 = Classroom.Courses.Aliases.create(resource=alias, courseId=courseId)

  console.log(response3)
  return 'success'
}


/**
 * renames google classroom course
 */
function changeClassroomName(id='526390027173', newName='howdy doody') {
  
  Classroom.Courses.patch({'name': newName}, id, {updateMask: "name"})

  updateNameOnSS(id, newName)
  
}


function updateNameOnSS(courseid, newName){

  let currentSheet = SpreadsheetApp.getActive()
  let currentSheetData = currentSheet.getDataRange().getValues()

  let lineIndex = currentSheetData.findIndex(x => x[1] == courseid)

  let lineToChange = parseInt(lineIndex) + 1
  
  currentSheet.getRange('A' + lineToChange).setValue(newName)

}


function sortSheet(thisSheet, col = 5){

  if(!thisSheet){
    thisSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
  }
  

  let range = thisSheet.getRange(2,1,thisSheet.getLastRow()-1, 6)

  let data = range.getValues()

  data.sort(function(a,b){
    return b[col-1] - a[col-1]
  })


  // thisSheet.sort({column: 4, ascending: false})

  range.setValues(data)

  // range.sort()
}












