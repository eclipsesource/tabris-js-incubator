require("tabris-swipeview");

var page = tabris.create("Page", {
  topLevel: true,
  title: "SwipeView"
});

var controlsComposite = tabris.create("Composite", {
  layoutData: {centerX: 0, top: 0, bottom: "#swipeView"}
}).appendTo(page);

var textInput = tabris.create("TextInput", {
  layoutData: {left: 10, centerY: 0},
  message: "index"
}).appendTo(controlsComposite);

tabris.create("Button", {
  layoutData: {left: "prev() 10", centerY: 0},
  text: "lockLeft"
}).appendTo(controlsComposite).on("select", function() {
  page.children("#swipeView").first().lockLeft(parseInt(textInput.get("text")));
});

tabris.create("Button", {
  layoutData: {left: "prev() 5", centerY: 0},
  text: "lockRight"
}).appendTo(controlsComposite).on("select", function() {
  page.children("#swipeView").first().lockRight(parseInt(textInput.get("text")));
});

var swipeView = tabris.create("SwipeView", {
  id: "swipeView",
  background: "gray",
  layoutData: {left: 0, top: 100, right: 20, bottom: 0}
}).appendTo(page);

swipeView.on("swipe", function(widget, item) {
  console.log("swiped to item index: " + item);
});

["red", "green", "blue"].forEach(function(color, i) {
  var swipeItem = tabris.create("SwipeItem").appendTo(swipeView);
  tabris.create("Composite", {
    background: color,
    layoutData: {left: 0, top: 0, width: 100 * (i + 1), height: 100 * (i + 1)}
  }).appendTo(swipeItem);
});

["red", "green", "blue"].forEach(function(color) {
  var swipeItem = tabris.create("SwipeItem").appendTo(swipeView);
  tabris.create("Composite", {
    background: color,
    layoutData: {left: 0, top: 0, right: 0, bottom: 0}
  }).appendTo(swipeItem);
});

page.open();
