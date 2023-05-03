function loadPartialHTML(partial) {
  const htmlServ = HtmlService.createTemplateFromFile(partial);
  return htmlServ.evaluate().getContent();
}

function loadSearchView() {
  return loadPartialHTML("search");
}

function loadAddClassroomView() {
  return loadPartialHTML("addClassroom");
}

function loadEditClassroomView() {
  return loadPartialHTML("editClassroom");
}
function loadStudentView() {
  return loadPartialHTML("students");
}
