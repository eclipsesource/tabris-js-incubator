require("datepicker");

var page = tabris.create("Page", {topLevel: true, title: "DatePicker"});

tabris.create("DatePicker", {
  layoutData: {left: 0, top: 0}
}).appendTo(page).on("select", function() {
  console.log("date selected: " + this.get("date"));
}).on("change:date", function() {
  console.log("date property changed: " + this.get("date"));
});

page.open();
