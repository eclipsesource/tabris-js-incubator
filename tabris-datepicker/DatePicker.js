(function() {

  tabris.registerWidget("DatePicker", {
    _type: "rwt.widgets.DateTime",
    _initProperties: {
      style: ["DATE", "MEDIUM"],
      datePattern: "MDY"
    },
    _properties: {
      date: {
        type: "any", // TODO: introduce type "date"
        access: {
          set: function(name, value) {
            this._nativeSetDate(value);
            this._triggerChangeEvent(name, value);
          },
          get: function() {
            var year = this._nativeGet("year");
            var month = this._nativeGet("month");
            var day = this._nativeGet("day");
            return new Date(year, month, day);
          }
        }
      }
    },
    _events: {
      select: {
        name: "Selection",
        alias: "change:date",
        trigger: function() {
          this._triggerChangeEvent("date", this.get("date"));
          this.trigger("select", this, this.get("date"), {});
        }
      }
    },
    _setProperties: function(properties, options) {
      if (!properties.date) {
        this._nativeSetDate(createCurrentDate());
      }
      this._super("_setProperties", properties, options);
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

})();
