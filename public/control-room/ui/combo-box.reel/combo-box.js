var Montage = require("montage/core/core").Montage,
    Component = require("montage/ui/component").Component;

/**
 @class ComboBox
 */
var ComboBox = exports.ComboBox = Montage.create(Component, {

    hasTemplate: {
        enumerable: false,
        value: true
    },

    selectedIndex: {
        enumerable: true,
        set: function (value) {
            this._element.options[value].selected = true;
            this.value = this._element.options[value].value;
        },
        get: function () {
            return this._element.selectedIndex;
        }
    },

    _value: {
        enumerable: false,
        value: null
    },

    value: {
        enumerable: true,
        set: function (value) {
            if (this._element.options[this._element.selectedIndex].value !== value) {
                var index = this.firstIndexForValue(value);

                if (index >= 0) {
                    this._value = this._element.options[index].value;
                    this._element.options[index].selected = true;
                    this.needsDraw = true;
                }
            } else {
                this._value = value;
                this.needsDraw = true;
            }
        },
        get: function () {
            return this._value;
        }
    },

    _comboElement: {
        enumerable: false,
        value: null
    },

    _comboLabel: {
        enumerable: false,
        value: null
    },

    _comboButton: {
        enumerable: false,
        value: null
    },

    _comboIcon: {
        enumerable: false,
        value: null
    },

    _comboIconOn: {
        enumerable: false,
        value: null
    },

    _comboListContainer: {
        enumerable: false,
        value: null
    },

    _comboList: {
        enumerable: false,
        value: null
    },

    _comboListShadow: {
        enumerable: false,
        value: null
    },

    _comboItems: {
        enumerable: false,
        value: null
    },

    _textInput: {
        enumerable: false,
        value: null
    },

    _textBuffer: {
        enumerable: false,
        value: null
    },

    _options: {
        enumerable: false,
        value: null
    },

    _hideComboList: {
        enumerable: false,
        value: false
    },

    _deleteComboList: {
        enumerable: false,
        value: false
    },

    _scrollY: {
        enumerable: false,
        value: 0
    },

    _scrollTo: {
        enumerable: false,
        value: 0
    },

    _buttonPressed: {
        enumerable: false,
        value: false
    },

    _active: {
        enumerable: false,
        value: false
    },

    _previousActiveItem: {
        enumerable: false,
        value: null
    },

    _currentActiveItem: {
        enumerable: false,
        value: null
    },

    _activeItem: {
        enumerable: false,
        get: function () {
            return this._currentActiveItem;
        },
        set: function (value) {
            this._previousActiveItem = this._currentActiveItem;
            this._currentActiveItem = value;
        }
    },

    _itemPressed: {
        enumerable: false,
        value: false
    },

    _cursorY: {
        enumerable: false,
        value: null
    },

    _cursorX: {
        enumerable: false,
        value: null
    },

    _isScrolling: {
        enumerable: false,
        value: false
    },

    _isWheelScrolling: {
        enumerable: false,
        value: false
    },

    _pressedTimeout: {
        enumerable: false,
        value: false
    },

    _wheelTimeout: {
        enumerable: false,
        value: false
    },

    _animationInterval: {
        enumerable: false,
        value: false
    },

    _touchIdentifier: {
        enumerable: false,
        value: null
    },

    _blockEventsUntilDraw: {
        enumerable: false,
        value: false
    },

    _valueUpdated: {
        enumerable: false,
        value: false
    },

    firstIndexForValue: {
        value: function (value) {
            var i;

            if (this._options === null) {
                this._options = this._element.getElementsByTagName("option");
            }
            for (i = 0; i < this._options.length; i++) {
                if (this._options[i].value === value) {
                    return i;
                }
            }
            return -1;
        }
    },

    options: {
        get: function () {
            var i, optionsArray = [];

            if (this._options === null) {
                this._options = this._element.getElementsByTagName("option");
            }
            for (i = 0; i < this._options.length; i++) {
                optionsArray.push({
                    value: this._options[i].value,
                    text: this._options[i].textContent
                });
            }
            return optionsArray;
        },
        set: function (value) {
            // TODO: validation of value and error reporting
            // TODO: update options in draw cycle?

            var i, option;
            
            if(this._element.childElementCount > 0) {
                while (this._element.firstChild) {
                    this._element.removeChild(this._element.firstChild);
                }

                for (i=0; i<value.length; i++) {
                    option=document.createElement("option");
                    option.value=value[i].value;
                    option.textContent=value[i].text;
                    this._element.appendChild(option);
                }
            } else {
                for(i=0; i<value.length; ++i) {
                    option=document.createElement("option");
                    option.value=value[i];
                    option.textContent=value[i];
                    this._element.appendChild(option);
                }
            }

            this.needsDraw = true;
        }
    },

    _isLastKeyEventKeydown: {
        enumerable: false,
        value: false
    },

    _keyboardCursorIndex: {
        enumerable: false,
        value: null
    },

    keyboardCursorIndex: {
        enumerable: false,
        get: function () {
            return this._keyboardCursorIndex;
        },
        set: function (value) {
            window.clearInterval(this._animationInterval);
            if (value <= 0) {
                this._keyboardCursorIndex = 0;
            } else {
                if (value >= this._options.length) {
                    this._keyboardCursorIndex = this._options.length - 1;
                } else {
                    this._keyboardCursorIndex = value;
                }
            }
            this._scrollTo = -this._keyboardCursorIndex * 50 - 13;
            this._activeItem = this._comboItems[this._keyboardCursorIndex];
            this._isScrolling = false;
            document.removeEventListener("mouseup", this, false);
            document.removeEventListener("mousemove", this, false);
            document.removeEventListener("touchend", this, false);
            document.removeEventListener("touchmove", this, false);
            this._itemPressed = true;
            this.needsDraw = true;
        }
    },

    _decodeKeyCode: {
        enumerable: false,
        value: function (event) {

            var tmp;

            switch (event.keyCode) {
                case 8: // del
                    event.preventDefault();
                    break;
                case 13: // return
                    this.keyboardCursorIndex = this._keyboardCursorIndex;
                    document.removeEventListener("touchstart", this, false);
                    document.removeEventListener("mousedown", this, false);
                    document.removeEventListener("mousewheel", this, false);
                    window.removeEventListener("resize", this, false);
                    window.removeEventListener("orientationchange", this, false);
                    this._valueUpdated = true;
                    this.selectedIndex = this._activeItem.getAttribute("data-index");
                    this._hideComboList = true;
                    this._active = false;
                    break;
                case 27: // esc
                    document.removeEventListener("touchstart", this, false);
                    document.removeEventListener("touchmove", this, false);
                    document.removeEventListener("touchend", this, false);
                    document.removeEventListener("mousedown", this, false);
                    document.removeEventListener("mouseup", this, false);
                    document.removeEventListener("mousemove", this, false);
                    document.removeEventListener("mousewheel", this, false);
                    window.removeEventListener("resize", this, false);
                    window.removeEventListener("orientationchange", this, false);
                    this._hideComboList = true;
                    this._active = false;
                    this.needsDraw = true;
                    break;
                case 33: // page up
                    tmp = ((this._offsetHeight / 50) | 0);
                    if (tmp < 1) {
                        tmp = 1;
                    }
                    this.keyboardCursorIndex -= tmp;
                    this._textBuffer = "";
                    break;
                case 34: // page down
                    tmp = ((this._offsetHeight / 50) | 0);
                    if (tmp < 1) {
                        tmp = 1;
                    }
                    this.keyboardCursorIndex += tmp;
                    this._textBuffer = "";
                    break;
                case 35: // end
                    this.keyboardCursorIndex = this._options.length - 1;
                    this._textBuffer = "";
                    break;
                case 36: // home
                    this.keyboardCursorIndex = 0;
                    this._textBuffer = "";
                    break;
                case 38: // up
                    this.keyboardCursorIndex--;
                    this._textBuffer = "";
                    break;
                case 40: // down
                    this.keyboardCursorIndex++;
                    this._textBuffer = "";
                    break;
            }
        }
    },

    handleKeydown: {
        enumerable: false,
        value: function (event) {
            this._decodeKeyCode(event);
            this._textInput.value = "";
            this._textInput.focus();
            this._isLastKeyEventKeydown = true;
        }
    },

    _previousKeyPressTimestamp: {
        enumerable: false,
        value: null
    },

    handleKeypress: {
        enumerable: false,
        value: function (event) {
            var self = this,
                timestamp = event.timeStamp;

            if (this._isLastKeyEventKeydown) {
                this._isLastKeyEventKeydown = false;
            } else {
                this._decodeKeyCode(event);
            }
            this._textInput.value = "";
            this._textInput.focus();
            window.setTimeout(function () {
                var length,
                    j,
                    i,
                    textMatched = false;

                j = length = self._comboItems.length;

                if (self._previousKeyPressTimestamp && (self._previousKeyPressTimestamp + 1500 < timestamp)) {
                    self._textBuffer = "";
                }
                self._previousKeyPressTimestamp = timestamp;
                self._textBuffer += self._textInput.value.toUpperCase();
                if (self._itemPressed) {
                    if ((self._textBuffer.length === 1) && (self._textBuffer[0] === self._comboItems[self.keyboardCursorIndex].textContent.substring(0, 1).toUpperCase())) {
                        i = self.keyboardCursorIndex;
                    } else if ((self._textBuffer.length === 2) && (self._textBuffer[0] === self._textBuffer[1])) {
                        self._textBuffer = self._textBuffer[0];
                        i = self.keyboardCursorIndex;
                    } else {
                        i = self.keyboardCursorIndex - 1;
                    }
                } else {
                    i = -1;
                }
                while (j && !textMatched) {
                    i = (i + 1) % length;
                    if (self._textBuffer === self._comboItems[i].textContent.substring(0, self._textBuffer.length).toUpperCase()) {
                        textMatched = true;
                    }
                    j--;
                }
                if (textMatched) {
                    self.keyboardCursorIndex = i;
                }
            }, 0);
        }
    },

    _createComboList: {
        enumerable: false,
        value: function () {
            var i;

            this._comboListContainer = document.createElement("div");
            this._comboList = document.createElement("div");
            this._comboListContainer.appendChild(this._comboList);
            this._comboListContainer.classList.add("montage-combobox-container");
            this._comboList.classList.add("combolist");
            if (this._textInput === null) {
                this._textInput = document.createElement("input");
                this._textInput.style.position = "absolute";
                this._textInput.style.width = "1px";
                this._textInput.style.height = "1px";
                this._textInput.style.top = "-9999px";
                this._textInput.style.border = "none";
            }
            this._textBuffer = value = "";
            this._keyboardCursorIndex = this._element.selectedIndex;
            this._comboListContainer.appendChild(this._textInput);

            document.addEventListener("keydown", this, false);
            document.addEventListener("keypress", this, false);

            if (this._options === null) {
                this._options = this._element.getElementsByTagName("option");
            }
            this._comboItems = [];
            if (this._options.length) {
                for (i = 0; i < this._options.length; i++) {
                    this._comboItems[i] = this._comboList.appendChild(document.createElement("div"));
                    this._comboItems[i].textContent = this._options[i].textContent;
                    this._comboItems[i].setAttribute("data-index", i);
                }
                this._comboItems[this._element.selectedIndex].className = "selected";
            }
            this._comboListContainer.style.display = "block";
            this._scrollTo = this._scrollY = -this._element.selectedIndex * 50 - 13;
            if (this._element.classList.contains("dark")) {
                this._comboListContainer.classList.add("dark");
            }
            // This is going to cause a redraw outside the draw stages
            // It could be done instead with 2 draw stages, but would not perform as good
            document.body.appendChild(this._comboListContainer);
        }
    },

    handleResize: {
        enumerable: false,
        value: function () {
            this._scrollTo = this._scrollY;
            this.needsDraw = true;
        }
    },

    handleOrientationchange: {
        enumerable: false,
        value: function () {
            this._scrollTo = this._scrollY;
            this.needsDraw = true;
        }
    },

    handleTouchstart: {
        enumerable: false,
        value: function (event) {
            if (!this._showComboList) {
                var self = this, target;

                this._touchIdentifier = event.targetTouches[0].identifier;
                target = event.targetTouches[0].target;
                if (target.nodeType === 3) {
                    target = target.parentNode;
                }
                if (target === this._comboListContainer) {
                    document.removeEventListener("touchstart", this, false);
                    document.removeEventListener("touchend", this, false);
                    document.removeEventListener("touchmove", this, false);
                    window.removeEventListener("resize", this, false);
                    window.removeEventListener("orientationchange", this, false);
                    this._hideComboList = true;
                    this._active = false;
                } else if (this._active) {
                    if (target.getAttribute("data-index")) {
                        document.addEventListener("touchend", this, false);
                        document.addEventListener("touchmove", this, false);
                        this._activeItem = target;
                        this._pressedTimeout = window.setTimeout(function () {
                            self._itemPressed = true;
                            self.needsDraw = true;
                        }, 40);
                    } else {
                        document.removeEventListener("touchstart", this, false);
                        document.removeEventListener("touchend", this, false);
                        document.removeEventListener("touchmove", this, false);
                        window.removeEventListener("resize", this, false);
                        window.removeEventListener("orientationchange", this, false);
                        this._hideComboList = true;
                        this._active = false;
                    }
                } else {
                    document.addEventListener("touchstart", this, false);
                    document.addEventListener("touchend", this, false);
                    document.addEventListener("touchmove", this, false);
                    this._buttonPressed = true;
                    this._comboElement.focus();
                }
                window.clearInterval(self._animationInterval);
                this._cursorX = event.targetTouches[0].clientX;
                this._cursorY = event.targetTouches[0].clientY;
                this._isScrolling = false;
                this.needsDraw = true;
                event.preventDefault();
                event.stopPropagation();
            }
        }
    },

    handleTouchmove: {
        enumerable: false,
        value: function (event) {
            var i = 0;

            while ((i < event.changedTouches.length) && (event.changedTouches[i].identifier !== this._touchIdentifier)) {
                i++;
            }
            if (i < event.changedTouches.length) {
                var dX = event.changedTouches[i].clientX - this._cursorX,
                    dY = event.changedTouches[i].clientY - this._cursorY,
                    squaredDist = dY * dY + dX * dX;

                if ((squaredDist > 50) || (this._isScrolling)) {
                    window.clearTimeout(this._pressedTimeout);
                    if (this._active) {
                        this._scrollTo = this._scrollY + dY;
                        this._cursorY = event.changedTouches[i].clientY;
                        this._isScrolling = true;
                    } else {
                        document.removeEventListener("touchstart", this, false);
                        document.removeEventListener("touchend", this, false);
                        document.removeEventListener("touchmove", this, false);
                        this._buttonPressed = false;
                    }
                    this.needsDraw = true;
                }
                event.preventDefault();
            }
        }
    },

    handleTouchend: {
        enumerable: false,
        value: function (event) {
            var i = 0;

            while ((i < event.changedTouches.length) && (event.changedTouches[i].identifier !== this._touchIdentifier)) {
                i++;
            }
            if (i < event.changedTouches.length) {
                document.removeEventListener("touchend", this, false);
                document.removeEventListener("touchmove", this, false);
                if ((this._active) && (!this._isScrolling)) {
                    document.removeEventListener("touchstart", this, false);
                    window.removeEventListener("resize", this, false);
                    window.removeEventListener("orientationchange", this, false);
                    this._valueUpdated = true;
                    this.selectedIndex = this._activeItem.getAttribute("data-index");
                    this._hideComboList = true;
                    this._active = false;
                } else {
                    if (this._active) {
                        if (event.changedTouches[i].velocity.speed > 40) {
                            var startY = this._scrollY,
                                self = this,
                                startTime = new Date().getTime(),
                                momentum = event.changedTouches[i].velocity.y;

                            this._animationInterval = window.setInterval(function () {
                                var time = new Date().getTime() - startTime;

                                if (time < 1000) {
                                    self._scrollTo = startY + ((momentum + momentum * (1000 - time) / 1000) * time / 2000);
                                } else {
                                    window.clearInterval(self._animationInterval);
                                }
                                self.needsDraw = true;
                            }, 16);
                        }
                    } else {
                        window.addEventListener("resize", this, false);
                        window.addEventListener("orientationchange", this, false);
                        this._buttonPressed = false;
                        this._active = true;
                    }
                }
                if (!this._hideComboList) {
                    this._itemPressed = false;
                }
                this.needsDraw = true;
                event.preventDefault();
            }
        }
    },

    handleMousedown: {
        enumerable: false,
        value: function (event) {
            if (!this._blockEventsUntilDraw) {
                if (!this._showComboList) {
                    var self = this,
                        target = event.target;
                    if (target.nodeType === 3) {
                        target = target.parentNode;
                    }
                    if (target === this._comboListContainer) {
                        document.removeEventListener("mousedown", this, false);
                        document.removeEventListener("mouseup", this, false);
                        document.removeEventListener("mousemove", this, false);
                        document.removeEventListener("mousewheel", this, false);
                        window.removeEventListener("resize", this, false);
                        window.removeEventListener("orientationchange", this, false);
                        this._hideComboList = true;
                        this._active = false;
                    } else if (this._active) {
                        if (target.getAttribute("data-index")) {
                            document.addEventListener("mouseup", this, false);
                            document.addEventListener("mousemove", this, false);
                            this._activeItem = target;
                            this._pressedTimeout = window.setTimeout(function () {
                                self._itemPressed = true;
                                self.needsDraw = true;
                            }, 40);
                        } else {
                            document.removeEventListener("mousedown", this, false);
                            document.removeEventListener("mouseup", this, false);
                            document.removeEventListener("mousemove", this, false);
                            document.removeEventListener("mousewheel", this, false);
                            window.removeEventListener("resize", this, false);
                            window.removeEventListener("orientationchange", this, false);
                            this._hideComboList = true;
                            this._active = false;
                        }
                    } else {
                        document.addEventListener("mousedown", this, false);
                        document.addEventListener("mouseup", this, false);
                        document.addEventListener("mousemove", this, false);
                        this._buttonPressed = true;
                        this._comboElement.focus();
                    }
                    window.clearInterval(self._animationInterval);
                    this._cursorX = event.clientX;
                    this._cursorY = event.clientY;
                    this._isScrolling = false;
                    this.needsDraw = true;
                    this._blockEventsUntilDraw = true;
                    //event.stopPropagation();
                }
            }
            event.preventDefault();
        }
    },

    handleMousewheel: {
        enumerable: false,
        value: function (event) {
            this._scrollTo = this._scrollY + (event.wheelDeltaY * 50) / 120;
            event.preventDefault();
            this.needsDraw = true;
            this._isScrolling = true;
            this._isWheelScrolling = true;
            window.clearTimeout(this._pressedTimeout);
            window.clearInterval(self._animationInterval);
        }
    },

    handleMousemove: {
        enumerable: false,
        value: function (event) {
            var dX = event.clientX - this._cursorX,
                dY = event.clientY - this._cursorY,
                squaredDist = dY * dY + dX * dX;

            if ((squaredDist > 50) || (this._isScrolling)) {
                window.clearTimeout(this._pressedTimeout);
                if (this._active) {
                    this._scrollTo = this._scrollY + dY;
                    this._cursorY = event.clientY;
                    this._isScrolling = true;
                } else {
                    document.removeEventListener("mousedown", this, false);
                    document.removeEventListener("mouseup", this, false);
                    document.removeEventListener("mousemove", this, false);
                    this._buttonPressed = false;
                }
                this.needsDraw = true;
            }
            event.preventDefault();
        }
    },

    handleMouseup: {
        enumerable: false,
        value: function (event) {
            if (!this._blockEventsUntilDraw) {
                document.removeEventListener("mouseup", this, false);
                document.removeEventListener("mousemove", this, false);
                if ((this._active) && (!this._isScrolling)) {
                    document.removeEventListener("mousedown", this, false);
                    document.removeEventListener("mousewheel", this, false);
                    window.removeEventListener("resize", this, false);
                    window.removeEventListener("orientationchange", this, false);
                    this._valueUpdated = true;
                    this.selectedIndex = this._activeItem.getAttribute("data-index");
                    this._hideComboList = true;
                    this._active = false;
                } else {
                    if (this._active) {
                        if (event.velocity.speed > 40) {
                            var startY = this._scrollY,
                                self = this,
                                startTime = new Date().getTime(),
                                momentum = event.velocity.y;

                            this._animationInterval = window.setInterval(function () {
                                var time = new Date().getTime() - startTime;

                                if (time < 1000) {
                                    self._scrollTo = startY + ((momentum + momentum * (1000 - time) / 1000) * time / 2000);
                                } else {
                                    window.clearInterval(self._animationInterval);
                                }
                                self.needsDraw = true;
                            }, 16);
                        }
                    } else {
                        document.addEventListener("mousewheel", this, false);
                        window.addEventListener("resize", this, false);
                        window.addEventListener("orientationchange", this, false);
                        this._buttonPressed = false;
                        this._active = true;
                    }
                }
                if (!this._hideComboList) {
                    this._itemPressed = false;
                }
                this.needsDraw = true;
                this._blockEventsUntilDraw = true;
                event.preventDefault();
            }
        }
    },

    handleChange: {
        enumerable: false,
        value: function (event) {
            this.needsDraw = true;
        }
    },

    prepareForDraw: {
        enumerable: false,
        value: function () {
            // The following "if" is a temporary workaround that should be removed after css-only reels can be loaded
            // if (!this.__proto__.cssWorkaroundLoaded) {
            //     var style = document.createElement("link");
            //     style.rel = "stylesheet";
            //     style.type = "text/css";
            //     style.href = module.path.slice(0, -12) + "/combo-box.css";
            //     document.head.insertBefore(style, document.head.firstChild);
            //     this.__proto__.cssWorkaroundLoaded = true;
            // }
            this._element.tabIndex = -1;
            this._comboElement = document.createElement("span");
            this._comboElement.tabIndex = 0;
            this._comboElement.style.outline = "none";
            this._comboLabel = document.createElement("span");
            this._comboButton = document.createElement("span");
            this._comboIcon = document.createElement("span");
            this._comboIconOn = document.createElement("span");
            this._comboElement.classList.add("montage-combobox");
            this._comboLabel.classList.add("label");
            this._comboButton.classList.add("button");
            this._comboIcon.classList.add("icon");
            this._comboIconOn.classList.add("iconon");
            this._element.parentNode.insertBefore(this._comboElement, this._element.nextSibling);
            this._comboElement.appendChild(this._comboButton);
            this._comboElement.appendChild(this._comboLabel);
            this._comboElement.appendChild(this._comboIcon);
            this._comboElement.appendChild(this._comboIconOn);
            this._element.style.position = "absolute";
            this._element.style.opacity = 0;
            this._element.style.webkitTransform = "translate3d(-9999px,-9999px,0)";
            this._element.addEventListener("change", this, false);
            this.eventManager.isStoringPointerEvents = true;
            if (this._element.classList.contains("dark")) {
                this._comboElement.classList.add("dark");
            }
            if (window.Touch) {
                this._comboElement.addEventListener("touchstart", this, false);
            } else {
                this._comboElement.addEventListener("mousedown", this, false);
            }
            this.selectedIndex = this._element.selectedIndex;
        }
    },

    _comboPosition: {
        enumerable: false,
        value: null
    },

    _width: {
        enumerable: false,
        value: null
    },

    _comboListWidth: {
        enumerable: false,
        value: null
    },

    _showComboList: {
        enumerable: false,
        value: false
    },

    _x: {
        enumerable: false,
        value: null
    },

    _y: {
        enumerable: false,
        value: null
    },

    _offsetHeight: {
        enumerable: false,
        value: null
    },

    willDraw: {
        enumerable: false,
        value: function () {
            if (this._element.offsetWidth === 0) {
                this._needsAnotherDraw = true;
            }
            this._width = this._element.offsetWidth;
            if (this._comboListContainer !== null) {
                this._comboPosition = webkitConvertPointFromNodeToPage(this._comboButton, new WebKitPoint(0, 0));
                this._comboListWidth = this._comboList.offsetWidth;
                if (this._active) {
                    var maxScroll = 6 - this._comboPosition.y,
                        minScroll;

                    this._offsetHeight = this._comboListContainer.offsetHeight;
                    minScroll = this._offsetHeight - this._comboList.offsetHeight - this._comboPosition.y - 6;
                    if (this._scrollY > minScroll) {
                        if (this._scrollTo < this._scrollY) {
                            if (this._scrollTo < minScroll) {
                                this._scrollY = minScroll;
                                window.clearInterval(self._animationInterval);
                            } else {
                                this._scrollY = this._scrollTo;
                            }
                        }
                    }
                    if (this._scrollY < maxScroll) {
                        if (this._scrollTo > this._scrollY) {
                            if (this._scrollTo > maxScroll) {
                                this._scrollY = maxScroll;
                                window.clearInterval(self._animationInterval);
                            } else {
                                this._scrollY = this._scrollTo;
                            }
                        }
                    }
                    this._y = this._comboPosition.y + this._scrollY;
                    this._x = this._comboPosition.x - this._comboListWidth - 1;
                    if (this._x < 6) {
                        this._x = 6;
                    }
                }
            }
        }
    },

    draw: {
        enumerable: false,
        value: function () {
            var self = this;

            if (this._element.options.length && (this._comboLabel.textContent !== this._element.options[this._element.selectedIndex].textContent)) {
                this._comboLabel.textContent = this._element.options[this._element.selectedIndex].textContent;
            }
            this._comboElement.style.width = this._width + "px";
            if (this._showComboList) {
                // with this timeout I ensure it is ready on iPad
                window.setTimeout(function () {
                    self._showComboList = false;
                    self._comboListContainer.style.opacity = 1;
                    self._comboListContainer.style.visibility = "visible";
                    self.needsDraw = true;
                }, 0);
            }
            if (this._activeItem !== null) {
                if (this._previousActiveItem) {
                    this._previousActiveItem.classList.remove("pressed");
                    this._previousActiveItem = null;
                }
                if ((this._itemPressed) && (!this._isScrolling)) {
                    this._activeItem.classList.add("pressed");
                } else {
                    this._activeItem.classList.remove("pressed");
                    this._textBuffer = "";
                }
            }
            if (this._active) {
                if (this._comboListContainer === null) {
                    this._createComboList();
                    this._showComboList = true;
                    window.setTimeout(function () {
                        self.needsDraw = true;
                    }, 0);
                } else {
                    this._comboList.style.webkitTransform = "translate3d(" + this._x + "px, " + this._y + "px, 0)";
                    if (this._isWheelScrolling) {
                        this._comboList.style.webkitTransition = "all 200ms ease-in-out";
                        window.clearTimeout(this._wheelTimeout);
                        this._wheelTimeout = window.setTimeout(function () {
                            self._comboList.style.webkitTransition = "none";
                        }, 200);
                        this._isWheelScrolling = false;
                    }
                }
            }
            if (this._hideComboList) {
                this._hideComboList = false;
                document.removeEventListener("keydown", this, false);
                document.removeEventListener("keypress", this, false);
                // Using timeout instead of webkitTransitionEnd because it is buggy/not firing always
                window.setTimeout(function () {
                    self._deleteComboList = true;
                    self.needsDraw = true;
                }, this._valueUpdated ? 500 : 250);
                if (this._valueUpdated) {
                    this._comboListContainer.style.webkitTransitionDelay = "250ms";
                    this._valueUpdated = false;
                }
                this._comboListContainer.style.opacity = 0;
            }
            if (this._deleteComboList) {
                this._deleteComboList = false;
                this._comboListContainer.parentNode.removeChild(this._comboListContainer);
                this._comboListContainer = null;
                this._comboList = null;
                this._comboItems = null;
            }
            if (this._buttonPressed) {
                this._comboButton.classList.add("pressed");
                this._comboLabel.classList.add("pressed");
            } else {
                this._comboButton.classList.remove("pressed");
                this._comboLabel.classList.remove("pressed");
            }
            if (this._active) {
                this._comboIcon.classList.add("active");
                this._comboIconOn.classList.add("active");
            } else {
                this._comboIcon.classList.remove("active");
                this._comboIconOn.classList.remove("active");
            }
            this._blockEventsUntilDraw = false;
        }
    },

    _needsAnotherDraw: {
        enumerable: false,
        value: false
    },

    didDraw: {
        value: function() {
            if(this._needsAnotherDraw) {
                this._needsAnotherDraw = false;
                this.needsDraw = true;
            }
        }
    },
});
