(function() {

  tabris.registerWidget("_Swipe", {
    _type: "tabris.Swipe",
    _properties: {
      parent: "any",
      itemCount: "integer"
    },
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
      this.super("_create", omit(properties, ["itemCount"]));
      this._nativeSet("data", {swipe: true});
      this._swipe = tabris.create("_Swipe", {itemCount: 0});
      tabris._nativeBridge.set(this._swipe.cid, "parent", this.cid);
      return this;
    },

    _addChild: function(child) {
      if (tabris.device.get("platform") === "Android") {
        // Original Swipe child container is not spanned upon Swipe bounds
        var wrapper = tabris.create("Composite", {layoutData: {left: 0, top: 0, right: 0, bottom: 0}});
        child._parent = null;
        child._setParent(wrapper);
        addSwipeItem(this, wrapper);
        return;
      }
      addSwipeItem(this, child);
    },

    _removeChild: function(child) {
      var index = this._children.indexOf(child);
      tabris.Proxy.prototype._removeChild.apply(this, arguments);
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

  function omit(object, keys) {
    var result = {};
    for (var key in object) {
      if (keys.indexOf(key) === -1) {
        result[key] = object[key];
      }
    }
    return result;
  }

  function addSwipeItem(swipeView, swipeItem) {
    tabris.Widgets._addChild.call(swipeView, swipeItem);
    swipeView._swipe._nativeSet("itemCount", swipeView._children.length);
    swipeView._swipe._nativeCall("add", {
      index: swipeView._children.indexOf(swipeItem),
      control: swipeItem.cid
    });
  }

})();
