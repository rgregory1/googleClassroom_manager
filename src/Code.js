function onOpen() {
  let ui = SpreadsheetApp.getUi()
  ui.createMenu('Manual Buttons')
    .addSubMenu(
        ui.createMenu('Setup')
          .addItem('List GC Course', 'listGCCourses')
          .addItem('Add Teachers','addTeachers')
        )
    .addItem('Edit Classroom','loadMainForm')
    // .addItem('5 Add Drop','addRemoveStudents')
    .addToUi()
}

// testing clasp

function listGCCourses() {

  console.time('get google classroom courses')

  // get logFile setup
  // let curDate = getCurrentDate()
  // let logFileId = getLogFileId(curDate)
  let currentFile = SpreadsheetApp.getActiveSpreadsheet()

  // var sh = ss.getSheetByName('LISTS');

  let activeCourses = currentFile.getSheetByName('Active') || currentFile.insertSheet('Active')
  let archivedCourses = currentFile.getSheetByName('Archived') || currentFile.insertSheet('Archived')
  let declinedCourses = currentFile.getSheetByName('Declined') || currentFile.insertSheet('Declined')
  let provisionedCourses = currentFile.getSheetByName('Provisioned') || currentFile.insertSheet('Provisioned')

  activeCourses.clear()
  archivedCourses.clear()
  declinedCourses.clear()
  provisionedCourses.clear()

  activeCourses.setFrozenRows(1)
  archivedCourses.setFrozenRows(1)
  declinedCourses.setFrozenRows(1)
  provisionedCourses.setFrozenRows(1)



  SpreadsheetApp.flush()

  activeCourses.activate()

  let pageCount = 0
  let pageToken = null

  var optionalArgs = {
    pageSize: 200,
    // courseStates: ['ACTIVE','PROVISIONED'],
    // courseStates: ['ACTIVE'],
    pageToken: pageToken
  };
  let courseList = []

  let courseListHeaders = [

    'Name',
    'Id',
    'Teacher',
    'State',
    'Last Updated',
    'OwnerId',
  ]


  while (true) {

    optionalArgs.pageToken = pageToken

    var response = Classroom.Courses.list(optionalArgs);
    // console.log(response)
    var courses = response.courses;

    // test if courses returns something, if not skip adding to list
    if (courses) {

      console.log(courses.length)



      courses.forEach(course => {



        courseList.push(
          [
            course.name,
            course.id,
            '',
            course.courseState,
            Utilities.formatDate(new Date(course.updateTime), "EST", "YYYY-MM-dd"),
            // course.updateTime,
            course.ownerId,
          ]
        )
      })
    }
    pageToken = response.nextPageToken

    if (!pageToken) {
      break
    }

    pageCount += 1
    console.log(pageCount)
    SpreadsheetApp.getActive().toast(courseList.length, "Classes Retrived");
    // if(pageCount == 2){
    //   break
    // }

  }

  // update for year
  // courseList = courseList.filter( c => c[4] > '2022-07-01')

  let activeList = courseList.filter(c => c[3] == 'ACTIVE')
  activeList.unshift(courseListHeaders)
  let archiveList = courseList.filter(c => c[3] == 'ARCHIVED')
  archiveList.unshift(courseListHeaders)
  let declinedList = courseList.filter(c => c[3] == 'DECLINED')
  declinedList.unshift(courseListHeaders)
  let provisionedList = courseList.filter(c => c[3] == 'PROVISIONED')
  provisionedList.unshift(courseListHeaders)

  activeCourses.getRange(1, 1, activeList.length, activeList[0].length).setValues(activeList);
  sortSheet(activeCourses,5)
  archivedCourses.getRange(1, 1, archiveList.length, archiveList[0].length).setValues(archiveList);
  sortSheet(archivedCourses,5)
  declinedCourses.getRange(1, 1, declinedList.length, declinedList[0].length).setValues(declinedList);
  sortSheet(declinedCourses,5)
  provisionedCourses.getRange(1, 1, provisionedList.length, provisionedList[0].length).setValues(provisionedList);
  sortSheet(provisionedCourses,5)

  console.timeEnd('get google classroom courses')
}




