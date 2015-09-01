require("tabris-datepicker");

var page = tabris.create("Page", {topLevel: true, title: "DatePicker"});

var datePicker = tabris.create("DatePicker", {
  layoutData: {centerX: 0, centerY: 0}
}).on("select", function() {
  console.log("date selected: " + this.get("date"));
}).on("change:date", function() {
  console.log("date property changed: " + this.get("date"));
}).appendTo(page);

tabris.create("Button", {
  text: "Set date to the beginning of the third millennium",
  layoutData: {centerX: 0, top: [datePicker, 10]}
}).on("select", function() {
  datePicker.set("date", new Date(2001, 0, 1));
}).appendTo(page);

page.open();
