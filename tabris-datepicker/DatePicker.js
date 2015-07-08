(function() {

  tabris.registerWidget("DatePicker", {
    _type: "rwt.widgets.DateTime",
    _properties: {
      date: {
        type: true, // TODO: introduce type "date"
        default: createCurrentDate(),
        set: function(date) {
          this._nativeSetDate(date);
        }
      }
    },
    _events: {
      select: {
        name: "Selection",
        alias: "change:date",
        trigger: function() {
          var date = new Date(this._nativeGet("year"), this._nativeGet("month"), this._nativeGet("day"));
          this.set("date", date);
          this.trigger("select", this, this.get("date"), {});
        }
      }
    },
    _initProperties: {
      style: ["DATE", "MEDIUM"],
      datePattern: "MDY"
    },
    _setProperty: function(name, value, options) {
      var val = name === "date" ? stripTime(value) : value;
      this.super("_setProperty", name, val, options);
      if (name === "date") {
        this._triggerChangeEvent("date", val);
      }
    },
    _setProperties: function(properties, options) {
      this.super("_setProperties", properties, options);
      if (!properties.date) {
        this._nativeSetDate(this.get("date"));
      }
    },
    _nativeSetDate: function(date) {
      this._nativeSet("year", date.getFullYear());
      this._nativeSet("month", date.getMonth());
      this._nativeSet("day", date.getDate());
    }
  });

  function createCurrentDate() {
    var date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

})();
