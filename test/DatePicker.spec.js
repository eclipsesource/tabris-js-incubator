describe("DatePicker", function() {

  var nativeBridge, getNativeBridgeSpy;

  beforeEach(function() {
    nativeBridge = new NativeBridgeSpy();
    tabris._reset();
    tabris._init(nativeBridge);
    getNativeBridgeSpy = spyOn(nativeBridge, "get").and.callFake(function(id, name) {
      if (name === "year") {return 2015;}
      if (name === "month") {return 3;}
      if (name === "day") {return 30;}
    });
  });

  describe("when created", function() {

    var datePicker, createCall, createProperties, currentDate;

    beforeEach(function() {
      datePicker = tabris.create("DatePicker", {});
      createCall = nativeBridge.calls({op: "create"})[0];
      createProperties = createCall.properties;
      currentDate = new Date();
    });

    it("rwt.widgets.DateTime is created", function() {
      expect(createCall.type).toBe("rwt.widgets.DateTime");
    });

    it("Date with default native style is created", function() {
      expect(createProperties.style).toEqual(["DATE", "MEDIUM"]);
    });

    it("'date' property is not set on the native widget", function() {
      expect(createProperties.date).not.toBeDefined();
    });

    it("'year', 'month' and 'day' properties are set on the native widget", function() {
      tabris.create("DatePicker", {date: new Date("2015-04-30")});
      createProperties = nativeBridge.calls({op: "create"})[1].properties;
      expect(createProperties.year).toBe(2015);
      expect(createProperties.month).toBe(3);
      expect(createProperties.day).toBe(30);
    });

    it("default 'year', 'month' and 'day' are set on the native widget", function() {
      var date = new Date();
      expect(createProperties.year).toBe(date.getFullYear());
      expect(createProperties.month).toBe(date.getMonth());
      expect(createProperties.day).toBe(date.getDate());
    });

    describe("set", function() {
      describe("date", function() {
        it("sets 'year', 'month' and 'day' properties on the native widget", function() {
          datePicker.set("date", new Date("2015-04-30"));
          var setCall = nativeBridge.calls({op: "set"})[0];
          expect(setCall.properties.day).toBe(30);
          expect(setCall.properties.month).toBe(3);
          expect(setCall.properties.year).toBe(2015);
        });
        it("doesn't overwrite passed date with date without time", function() {
          var date = new Date(1431093114000);
          datePicker.set("date", date);
          expect(date.getDate()).toBe(8);
          expect(date.getMonth()).toBe(4);
          expect(date.getFullYear()).toBe(2015);
          expect(date.getHours()).toBe(15);
          expect(date.getMinutes()).toBe(51);
          expect(date.getMilliseconds()).toBe(0);
          expect(date.getSeconds()).toBe(54);
        });
      });
    });

    describe("get", function() {
      describe("date", function() {
        it("returns native widget's date", function() {
          var date = datePicker.get("date");
          expect(date.getDate()).toBe(30);
          expect(date.getMonth()).toBe(3);
          expect(date.getFullYear()).toBe(2015);
          expect(date.getHours()).toBe(0);
          expect(date.getMinutes()).toBe(0);
          expect(date.getMilliseconds()).toBe(0);
          expect(date.getSeconds()).toBe(0);
        });
      });
    });

    describe("event", function() {

      var listener;

      beforeEach(function() {
        listener = jasmine.createSpy();
      });

      var checkEvent = function(date) {
        expect(listener.calls.count()).toBe(1);
        expect(listener.calls.argsFor(0)[0]).toBe(datePicker);
        if (arguments.length > 0) {
          expect(listener.calls.argsFor(0)[1].getFullYear()).toEqual(date.getFullYear());
          expect(listener.calls.argsFor(0)[1].getMonth()).toEqual(date.getMonth());
          expect(listener.calls.argsFor(0)[1].getDate()).toEqual(date.getDate());
          expect(listener.calls.argsFor(0)[2]).toEqual({});
        } else {
          expect(listener.calls.argsFor(0)[1]).toEqual({});
        }
      };

      var checkListen = function(event) {
        var listen = nativeBridge.calls({op: "listen", id: datePicker.cid});
        expect(listen.length).toBe(1);
        expect(listen[0].event).toBe(event);
        expect(listen[0].listen).toBe(true);
      };

      describe("select", function() {
        beforeEach(function() {
          datePicker.on("select", listener);
        });
        it("gets fired upon date selection with natively got 'date'", function() {
          tabris._notify(datePicker.cid, "Selection", {});
          checkEvent(new Date(2015, 3, 30));
          checkListen("Selection");
        });
      });

      describe("change:date", function() {
        it("gets fired when 'select' is fired", function() {
          datePicker.on("change:date", listener);
          tabris._notify(datePicker.cid, "Selection", {});
          checkEvent(new Date(2015, 3, 30));
          checkListen("Selection");
        });
        it("gets fired upon 'date' property change", function() {
          datePicker.on("change:date", listener);
          var date = new Date(2015, 3, 30);
          datePicker.set("date", date);
          checkEvent(date);
          checkListen("Selection");
        });
      });
    });
  });

});
