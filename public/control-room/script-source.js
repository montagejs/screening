var Montage = require("montage/core/core").Montage;

exports.ScriptSource = Montage.create(Montage, {
    id: {
        enumerable: true,
        value: null
    },

    _name: {
        enumerable: false,
        value: false
    },

    name: {
        get: function() {
            return this._name;
        },
        set: function(value) {
            this._name = value;
            this.displayName = value.substr(0, value.lastIndexOf('.')) || value;
        }
    },

    _tags: {
        enumerable: false,
        value: []
    },

    displayTags: {
        get: function() {
            var self = this;

            // Add quotes to multi-word tags
            var quotedTags = self._tags.map(function(elem) {
                return /\s/g.test(elem) ? '"' + elem + '"' : elem;
            });

            return quotedTags.join(" ");
        },
        set: function(value) {
            var self = this;

            var tags = value.match(/\w+|"[^"]+"/g);
            // Remove quotes
            tags.forEach(function(elem, index) {
                tags[index] = tags[index].replace(/"/g, "");
            });

            self._tags = tags;
        }
    },

    _displayName: {
        enumerable: false,
        value: false
    },

    displayName: {
        get: function() {
            return this._displayName;
        },
        set: function(value) {
            this._displayName = value;
        }
    },

    _size: {
        enumerable: false,
        value: [],
        distinct: true
    },

    size: {
        get: function() {
            return this._size;
        },
        set: function(value) {
            this._size = value;
        }
    },

    _modified: {
        enumerable: false,
        value: [],
        distinct: true
    },

    modified: {
        get: function() {
            return this._modified;
        },
        set: function(value) {
            this._modified = value;
        }
    },

    _code: {
        enumerable: false,
        value: [],
        distinct: true
    },

    code: {
        get: function() {
            return this._code;
        },
        set: function(value) {
            this._code = value;
        }
    },

    fromServer: {
        value: function(obj) {
            this.id = obj._id;
            this.name = obj.name;
            this.size = obj.size;
            this.modified = obj.modified;
            this.code = obj.code;


            this._tags = obj.tags || [];
        }
    }
});