const addTeachers = () => {

  getTeachers()

  addTeachersToSheet()

}

const addTeachersToSheet = () => {

  let currentFile = SpreadsheetApp.getActiveSpreadsheet()
  let thisSheet = currentFile.getActiveSheet()

   // get the current teacher ids
  let teacherIdPage = currentFile.getSheetByName('Teachers') || logFile.insertSheet('Teachers')

  let currentTeacherData = teacherIdPage.getDataRange().getValues()

  let currentTeacherIds = currentTeacherData.map(x => x[0])

  // get data to match with teacher ids
  let thisSheetData = thisSheet.getDataRange().getValues()
  thisSheetData.shift()

  thisSheetData.forEach(row => {
    let idIndex = currentTeacherIds.indexOf(row[5])

    console.log(idIndex)
    console.log(currentTeacherData[idIndex][1])

    row[2] = currentTeacherData[idIndex][1]

  })

  thisSheet.getRange(2,1,thisSheetData.length, thisSheetData[0].length).setValues(thisSheetData)

  console.log('hello')

}


function getTeachers() {
  
  // get all teachers from the current sheet
  // -------------------------------------------------------------------------------------
  let thisSheet = SpreadsheetApp.getActiveSheet().getDataRange().getValues()
  let currentFile = SpreadsheetApp.getActiveSpreadsheet()

  // get all teacher id's from sheet
  let teacherIds = thisSheet.map(x => x[5])

  // remove the headers
  teacherIds.shift()

  // remove dupes
  let uniqueTeachers = [...new Set(teacherIds)]

  // compare to teachers already on teachers sheet
  // -------------------------------------------------------------------------------------

  // get the current teacher ids
  let teacherIdPage = currentFile.getSheetByName('Teachers') || logFile.insertSheet('Teachers')

  let currentTeacherData = teacherIdPage.getDataRange().getValues()

  let currentTeacherIds = currentTeacherData.map(x => x[0])

  let newTeachers = getDelta(currentTeacherIds, uniqueTeachers)

  if (newTeachers.length > 0) {

  
  // get new emails for all new teachers
  // -------------------------------------------------------------------------------------

  // setup final list of teacher data
  let teacherData = []

  // get all emails for ID numbers and push to teacher data list
  newTeachers.forEach(teacher =>{

    try{
      let userData = AdminDirectory.Users.get(teacher)
      teacherData.push([teacher,userData.primaryEmail])
    } catch {
      teacherData.push([teacher,'unknown'])
    }
    
  })

  // add new teachers to sheet
  // -------------------------------------------------------------------------------------

  let lastRow = teacherIdPage.getLastRow()

  teacherIdPage.getRange(lastRow+1,1,teacherData.length,2).setValues(teacherData)
  console.log('teachers added')
  } else console.log('no teachers to add')
}


/**
 * @param {object[]} currentTeacherList old array of objects
 * @param {object[]} teachersToCheck new array of objects
 * @param {object} An object with changes
 */
function getDelta(currentTeacherList, teachersToCheck)  {
    var delta = []
    
    teachersToCheck.forEach(teacher => {
      if(!currentTeacherList.includes(teacher)){
        delta.push(teacher)
      }
    })


    return delta;
}