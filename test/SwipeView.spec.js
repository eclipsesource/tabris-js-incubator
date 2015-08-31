describe("SwipeView", function() {

  var nativeBridge;

  beforeEach(function() {
    nativeBridge = new NativeBridgeSpy();
    tabris._reset();
    tabris._init(nativeBridge);
  });

  describe("when created", function() {

    var swipe, createCalls;

    beforeEach(function() {
      swipe = tabris.create("SwipeView", {});
      createCalls = nativeBridge.calls({op: "create"});
    });

    it("a Composite is created", function() {
      expect(createCalls[0].type).toBe("rwt.widgets.Composite");
      expect(createCalls[0].properties.data).toEqual({swipe: true});
    });

    it("a Swipe is created", function() {
      expect(createCalls[1].type).toBe("tabris.Swipe");
      expect(createCalls[1].properties.parent).toBe(createCalls[0].id);
      expect(createCalls[1].properties.itemCount).toBe(0);
    });


    describe("lockLeft", function() {
      it("calls native lockLeft with index data", function() {
        swipe.lockLeft(2);
        var lockLeftMethodCalls = nativeBridge.calls({method: "lockLeft"})[0];
        expect(lockLeftMethodCalls.parameters).toEqual({index: 2});
      });
    });

    describe("lockRight", function() {
      it("calls native lockRight with index data", function() {
        swipe.lockRight(2);
        var lockLeftMethodCalls = nativeBridge.calls({method: "lockRight"})[0];
        expect(lockLeftMethodCalls.parameters).toEqual({index: 2});
      });
    });

    describe("event", function() {
      describe("swipe", function() {
        it("is fired when swiping", function() {
          var swipeCallback = jasmine.createSpy("swipeCallback");
          swipe.on("swipe", swipeCallback);
          swipe._swipe.trigger("Swipe", {item: 2});
          expect(swipeCallback).toHaveBeenCalledWith(swipe, 2);
        });

        it("is not fired when swiping and event detached ", function() {
          var swipeCallback = jasmine.createSpy("swipeCallback");
          swipe.on("swipe", swipeCallback);
          swipe.off("swipe", swipeCallback);
          swipe._swipe.trigger("Swipe", {item: 2});
          expect(swipeCallback).not.toHaveBeenCalled();
        });
      });
    });

    describe("appending", function() {

      describe("a child on Android", function() {

        var child;

        beforeEach(function() {
          nativeBridge.resetCalls();
          fakePlatform(nativeBridge, "Android");
          child = tabris.create("TextView");
          swipe.append(child);
        });

        it("wraps the child in a full-sized Composite", function() {
          expect(child.parent().type).toBe("Composite");
          expect(child.parent().get("layoutData")).toEqual({left: 0, top: 0, right: 0, bottom: 0});
        });

        it("calls add on swipe", function() {
          var calls = nativeBridge.calls({id: createCalls[1].id});

          expect(calls[0].op).toBe("set");
          expect(calls[0].properties.itemCount).toBe(1);

          expect(calls[1].op).toBe("call");
          expect(calls[1].method).toBe("add");
          expect(calls[1].parameters).toEqual({index: 0, control: child.parent().cid});
        });

      });

      describe("a child on iOS", function() {

        var child;

        beforeEach(function() {
          nativeBridge.resetCalls();
          fakePlatform(nativeBridge, "iOS");
          child = tabris.create("TextView");
          swipe.append(child);
          nativeBridge.get.and.returnValue([0, 0, 300, 600]);
          swipe.trigger("resize", swipe, [0, 0, 300, 600], {});
        });

        it("appends the child to the SwipeView", function() {
          expect(child.parent().type).toBe("SwipeView");
          expect(JSON.stringify(child.parent().get("bounds")))
            .toBe(JSON.stringify({left: 0, top: 0, width: 300, height: 600}));
        });

        it("calls add on swipe", function() {
          var calls = nativeBridge.calls({id: createCalls[1].id});

          expect(calls[0].op).toBe("set");
          expect(calls[0].properties.itemCount).toBe(1);

          expect(calls[1].op).toBe("call");
          expect(calls[1].method).toBe("add");
          expect(calls[1].parameters).toEqual({index: 0, control: child.cid});
        });

      });

      describe("two children", function() {

        var child1, child2;

        beforeEach(function() {
          fakePlatform(nativeBridge, "Android");
          child1 = tabris.create("TextView");
          child2 = tabris.create("TextView");
          swipe.append(child1);
          nativeBridge.resetCalls();
          swipe.append(child2);
        });

        it("calls add on swipe", function() {
          var calls = nativeBridge.calls({id: createCalls[1].id});

          expect(calls[0].op).toBe("set");
          expect(calls[0].properties.itemCount).toBe(2);

          expect(calls[1].op).toBe("call");
          expect(calls[1].method).toBe("add");
          expect(calls[1].parameters).toEqual({index: 1, control: child2.parent().cid});
        });

      });

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
