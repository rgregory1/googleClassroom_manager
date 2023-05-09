function bulkEmailArchiveNotices() {
  let sheetData = SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet()
    .getDataRange()
    .getValues();

  sheetData.shift();

  let teacherArray = sheetData.map(x => x[2]);

  let teacherList = new Set(teacherArray);

  console.log("hey");

  teacherList.forEach(teacher => {
    sendArchiveEmail(teacher);
  });
}

function sendArchiveEmail(teacher = "russell.gregory@mvsdschools.org") {
  let body = `<p>Hello Google Classroom Educator,</p>

  <p>This message is to inform you that MVSD will be archiving all Google Classrooms on July 30, 2023.  Students are no longer able to remove themselves from classes, so this is necessary to free the students from being stuck in classes in which they are no longer enrolled.</p>

  <p>If you need access to one or more of your classes after that time, you may <a href="https://drive.google.com/file/d/1DbXkHTlp0KKvcTex3aZ224Ln3rjTKj04/view?usp=share_link">restore the class by following these instructions.</a></p>
  `;

  GmailApp.sendEmail(teacher, "Google Classroom Archive Notice", "", {
    htmlBody: body,
    noReply: true,
  });
}

function archiveCheckOne() {
  let ui = SpreadsheetApp.getUi(); // Same variations.

  let result = ui.alert(
    "Please confirm",
    "Are you sure you want to ARCHIVE ALL CLASS ON THIS PAGE?",
    ui.ButtonSet.YES_NO
  );

  // Process the user's response.
  if (result == ui.Button.YES) {
    archiveCheckTwo();
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert("No Harm, No Foul.");
  }
}

function archiveCheckTwo() {
  let ui = SpreadsheetApp.getUi(); // Same variations.

  let result = ui.alert(
    "Please DOUBLE confirm",
    "Are you sure you want to ARCHIVE ALL CLASS ON THIS PAGE?",
    ui.ButtonSet.YES_NO
  );

  // Process the user's response.
  if (result == ui.Button.YES) {
    // User clicked "Yes".
    ui.alert("Confirmation received.");
    archiveAllClassesOnPage()
  } else {
    // User clicked "No" or X in the title bar.
    ui.alert("Whoa! Glad we stopped when we did.");
  }
}

function archiveAllClassesOnPage() {

  let message

  let sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getActiveSheet()
  let sheetData = sheet
    .getDataRange()
    .getValues();

  sheetData.shift();

  let classArray = sheetData.map(x => x[1]);

  classArray.forEach((classroom, index) => {
    let result = archiveClass(classroom)

    if(result == 'success'){
      message = 'ARCHIVED'
    } else message = 'Failed'

    sheet.getRange(index+2, 4).setValue(message)
  })


}





















