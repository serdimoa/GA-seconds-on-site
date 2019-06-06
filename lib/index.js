"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var GaSecondsOnSite = /** @class */ (function () {
    function GaSecondsOnSite(_a) {
        var _this = this;
        var activity = _a.activity, _b = _a.lSkey, lSkey = _b === void 0 ? "GaSecondsOnSite" : _b;
        this.watchEvery = 1000;
        this.activity = [];
        this.timers = {};
        this.counters = {};
        this.eventFlag = {};
        this.eventList = [
            "touchmove",
            "blur",
            "focus",
            "focusin",
            "focusout",
            "load",
            "resize",
            "scroll",
            "unload",
            "click",
            "dblclick",
            "mousedown",
            "mouseup",
            "mousemove",
            "mouseover",
            "mouseout",
            "mouseenter",
            "mouseleave",
            "change",
            "select",
            "submit",
            "keydown",
            "keypress",
            "keyup",
            "error"
        ];
        this.eventTrigger = function () {
            _this.eventFlag = _this.activity.reduce(function (events, item) {
                var _a;
                return __assign({}, events, (_a = {}, _a[item.name] = true, _a));
            }, {});
        };
        this.activity = activity;
        this.lSkey = lSkey;
    }
    GaSecondsOnSite.prototype.addListenerMulti = function () {
        for (var i = 0, iLen = this.eventList.length; i < iLen; i++) {
            document.addEventListener(this.eventList[i], this.eventTrigger);
        }
    };
    GaSecondsOnSite.prototype.loadDataFromLS = function () {
        var lsData = window.localStorage.getItem(this.lSkey);
        if (lsData) {
            var data = JSON.parse(lsData);
            this.counters = data;
        }
        else {
            this.counters = this.activity.reduce(function (counters, item) {
                var _a;
                return __assign({}, counters, (_a = {}, _a[item.name] = { test: 0, achiev: 0, cbStatus: false }, _a));
            }, {});
        }
    };
    GaSecondsOnSite.prototype.process = function () {
        var _this = this;
        this.addListenerMulti();
        this.loadDataFromLS();
        this.eventTrigger();
        this.activity.forEach(function (item) {
            _this.itemProcess(item);
        });
    };
    GaSecondsOnSite.prototype.writeDataToLs = function () {
        window.localStorage.setItem(this.lSkey, JSON.stringify(this.counters));
    };
    GaSecondsOnSite.prototype.itemProcess = function (item) {
        var _this = this;
        var counter = this.counters[item.name];
        counter.test += 1;
        if (counter.test === item.testPeriod) {
            if (this.eventFlag[item.name]) {
                this.eventFlag[item.name] = false;
                counter.achiev += item.testPeriod;
            }
            counter.test = 0;
        }
        if (!counter.cbStatus) {
            this.timers[item.name] = setTimeout(function () { return _this.itemProcess(item); }, this.watchEvery);
        }
        if (counter.achiev >= item.achieveTime) {
            if (!counter.cbStatus) {
                counter.cbStatus = true;
                item.callback.call(this, item);
            }
            if (this.timers[item.name]) {
                clearTimeout(this.timers[item.name]);
            }
        }
        this.writeDataToLs();
    };
    return GaSecondsOnSite;
}());
exports.default = GaSecondsOnSite;
