describe("SwipeItem", function() {
  var nativeBridge, swipeView;

  beforeEach(function() {
    nativeBridge = new NativeBridgeSpy();
    tabris._reset();
    tabris._init(nativeBridge);
    swipeView = tabris.create("SwipeView");
    nativeBridge.resetCalls();
  });

  describe("create", function() {
    it("is creating a composite with fill layout on iOS", function() {
      fakePlatform(nativeBridge, "iOS");
      var swipeItem = tabris.create("SwipeItem");
      expect(swipeItem.get("layoutData")).toEqual({left: 0, top: 0, right: 0, bottom: 0});
    });
    it("is not setting layoutData on Android", function() {
      fakePlatform(nativeBridge, "Andorid");
      var swipeItem = tabris.create("SwipeItem");
      expect(swipeItem.get("layoutData")).toEqual(null);
    });
  });

  describe("append", function() {
    it("fails for parents which are not SwipeView", function() {
      expect(function() {
        var composite = tabris.create("Composite");
        tabris.create("SwipeItem").appendTo(composite);
      }).toThrow(new Error("SwipeItem must be a child of a SwipeView"));
    });

    it("adds item to a SwipeView", function() {
      tabris.create("SwipeItem").appendTo(swipeView);
      expect(swipeView.children().length).toBe(1);
    });

    it("calls add on swipe", function() {
      var swipeItem = tabris.create("SwipeItem").appendTo(swipeView);
      var setOperations = nativeBridge.calls({op: "set"});
      var callOperations = nativeBridge.calls({op: "call"});

      expect(setOperations[0].properties.itemCount).toBe(1);
      expect(callOperations[0].op).toBe("call");
      expect(callOperations[0].method).toBe("add");
      expect(callOperations[0].parameters).toEqual({index: 0, control: swipeItem.cid});
    });

    it("appending twice adds two children", function() {
      var swipeItem1 = tabris.create("SwipeItem").appendTo(swipeView);
      var swipeItem2 = tabris.create("SwipeItem").appendTo(swipeView);
      var setOperations = nativeBridge.calls({op: "set"});
      var callOperations = nativeBridge.calls({op: "call"});

      expect(setOperations[0].properties.itemCount).toBe(1);
      expect(callOperations[0].op).toBe("call");
      expect(callOperations[0].method).toBe("add");
      expect(callOperations[0].parameters).toEqual({index: 0, control: swipeItem1.cid});
      expect(setOperations[1].properties.itemCount).toBe(2);
      expect(callOperations[1].op).toBe("call");
      expect(callOperations[1].method).toBe("add");
      expect(callOperations[1].parameters).toEqual({index: 1, control: swipeItem2.cid});
    });
  });

  describe("dispose", function() {
    it("removes SwipeView item", function() {
      var swipeItem = tabris.create("SwipeItem").appendTo(swipeView);
      swipeItem.dispose();
      expect(nativeBridge.calls({op: "set"})[1].properties.itemCount).toBe(0);
    });
  });

});

describe("SwipeView", function() {

  var nativeBridge;
  var swipeView;

  beforeEach(function() {
    nativeBridge = new NativeBridgeSpy();
    tabris._reset();
    tabris._init(nativeBridge);
    swipeView = tabris.create("SwipeView");
  });

  describe("create", function() {

    it("creates a tabris.Swipe", function() {
      var createCalls = nativeBridge.calls({op: "create"});
      expect(createCalls[1].type).toBe("tabris.Swipe");
      expect(createCalls[1].properties.parent).toBe(createCalls[0].id);
      expect(createCalls[1].properties.itemCount).toBe(0);
    });

    it("children list is empty", function() {
      expect(swipeView.children().toArray()).toEqual([]);
    });

  });

  describe("lockLeft", function() {
    it("calls native lockLeft with index data", function() {
      swipeView.lockLeft(2);
      var lockLeftMethodCalls = nativeBridge.calls({method: "lockLeft"})[0];
      expect(lockLeftMethodCalls.parameters).toEqual({index: 2});
    });
  });

  describe("lockRight", function() {
    it("calls native lockRight with index data", function() {
      swipeView.lockRight(2);
      var lockLeftMethodCalls = nativeBridge.calls({method: "lockRight"})[0];
      expect(lockLeftMethodCalls.parameters).toEqual({index: 2});
    });
  });

  describe("event", function() {
    describe("swipe", function() {
      it("is fired when swiping", function() {
        var swipeCallback = jasmine.createSpy("swipeCallback");
        swipeView.on("swipe", swipeCallback);
        swipeView._swipe.trigger("Swipe", {item: 2});
        expect(swipeCallback).toHaveBeenCalledWith(swipeView, 2);
      });

      it("is not fired when swiping and event detached ", function() {
        var swipeCallback = jasmine.createSpy("swipeCallback");
        swipeView.on("swipe", swipeCallback);
        swipeView.off("swipe", swipeCallback);
        swipeView._swipe.trigger("Swipe", {item: 2});
        expect(swipeCallback).not.toHaveBeenCalled();
      });
    });
  });

  describe("append", function() {

    it("fails if widget is not a SwipeItem", function() {
      expect(function() {
        var swipeView = tabris.create("SwipeView");
        tabris.create("Composite").appendTo(swipeView);
      }).toThrow(new Error("Only a SwipeItem can be appended to a SwipeView"));
    });

  });

  describe("dispose", function() {
    var swipeItem;

    beforeEach(function() {
      swipeItem = tabris.create("SwipeItem").appendTo(swipeView);
      swipeView.dispose();
    });

    it("disposes SwipeItems", function() {
      expect(swipeItem.isDisposed()).toBe(true);
    });

    it("removes SwipeView items", function() {
      var setOperations = nativeBridge.calls({op: "set"});
      expect(setOperations[1].properties.itemCount).toBe(0);
    });
  });

});

function fakePlatform(nativeBridge, platform) {
  spyOn(nativeBridge, "get").and.callFake(function(id, name) {
    if (id === "tabris.Device" && name === "platform") {
      return platform;
    }
  });
}
