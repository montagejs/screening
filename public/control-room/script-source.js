/* <copyright>
Copyright (c) 2012, Motorola Mobility LLC.
All Rights Reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice,
  this list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of Motorola Mobility LLC nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
</copyright> */

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
