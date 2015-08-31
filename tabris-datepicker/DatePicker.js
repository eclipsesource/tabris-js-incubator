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
        default: createCurrentDate(),
        access: {
          set: function(name, value) {
            var dateWithoutTime = stripTime(value);
            this._nativeSetDate(dateWithoutTime);
            this._storeProperty(name, dateWithoutTime);
          },
          get: function(name) {
            var result = this._getStoredProperty(name);
            if (result) {
              return result;
            }
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
          var date = new Date(this._nativeGet("year"), this._nativeGet("month"), this._nativeGet("day"));
          this.set("date", date);
          this.trigger("select", this, this.get("date"), {});
        }
      }
    },
    _setProperties: function(properties, options) {
      if (!properties.date) {
        this._nativeSetDate(this.get("date"));
      }
      this.super("_setProperties", properties, options);
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
