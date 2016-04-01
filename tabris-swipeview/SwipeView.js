(function() {

  tabris.registerWidget("SwipeItem", {

    _type: "rwt.widgets.Composite",

    _supportsChildren: true,

    _create: function(properties) {
      var _properties = {};
      if (device.platform === "iOS") {
        _properties.layoutData = {left: 0, top: 0, right: 0, bottom: 0};
      }
      var safeProperties = omit(properties, ["layoutData"]);
      this._super("_create", [extend(safeProperties, _properties)]);
      return this;
    },

    _setParent: function(parent) {
      if (!(parent instanceof tabris.SwipeView)) {
        throw new Error("SwipeItem must be a child of a SwipeView");
      }
      tabris.Widget.prototype._setParent.call(this, parent);
    }

  });

  tabris.registerWidget("_Swipe", {
    _type: "tabris.Swipe",
    _properties: {parent: "any", itemCount: "integer"},
    _events: {Swipe: true}
  });

  tabris.registerWidget("SwipeView", {

    _type: "rwt.widgets.Composite",

    _supportsChildren: true,

    _events: {
      swipe: {
        listen: function(state) {
          if (state) {
            this._swipe.on("Swipe", triggerSwipe, this);
          } else {
            this._swipe.off("Swipe", triggerSwipe, this);
          }
        }
      }
    },

    _create: function(properties) {
      this._super("_create", [omit(properties, ["itemCount"])]);
      this._nativeSet("data", {swipe: true});
      this._swipe = tabris.create("_Swipe", {itemCount: 0});
      tabris._nativeBridge.set(this._swipe.cid, "parent", this.cid);
      return this;
    },

    _addChild: function(child) {
      if (!(child instanceof tabris.SwipeItem)) {
        throw new Error("Only a SwipeItem can be appended to a SwipeView");
      }
      tabris.Widget.prototype._addChild.call(this, child);
      this._swipe._nativeSet("itemCount", this._children.length);
      this._swipe._nativeCall("add", {
        index: this._children.indexOf(child),
        control: child.cid
      });
    },

    _removeChild: function(child) {
      tabris.Widget.prototype._removeChild.call(this, child);
      var index = this._children.indexOf(child);
      this._swipe._nativeSet("itemCount", this._children.length);
      this._swipe._nativeCall("remove", {items: [index]});
    },

    lockLeft: function(index) {
      this._swipe._nativeCall("lockLeft", {index: index});
    },

    lockRight: function(index) {
      this._swipe._nativeCall("lockRight", {index: index});
    }
  });

  function triggerSwipe(swipeData) {
    this.trigger("swipe", this, swipeData.item);
  }

})();

function omit(object, keys) {
  var result = {};
  for (var key in object) {
    if (keys.indexOf(key) === -1) {
      result[key] = object[key];
    }
  }
  return result;
}

function extend(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var name in source) {
      target[name] = source[name];
    }
  }
  return target;
}
