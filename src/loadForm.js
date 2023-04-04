function loadMainForm() {
  
  const htmlServ = HtmlService.createTemplateFromFile('main')
  const html = htmlServ.evaluate()
  html.setWidth(950).setHeight(600)
  const ui = SpreadsheetApp.getUi()
  ui.showModalDialog(html, 'Edit Classroom')
}
