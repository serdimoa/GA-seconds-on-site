interface Activity {
  achieveTime: number;
  testPeriod: number;
  name: string;
  callback: (activity: Activity) => void;
}

interface Counter {
  cbStatus: boolean;
  test: number;
  achiev: number;
}

interface Counters {
  [key: string]: Counter;
}

interface LsData extends Counters {}

interface Timers {
  [key: string]: number;
}

interface Events {
  [key: string]: boolean;
}

interface IGaSecondsOnSite {
  activity: Activity[];
  lSkey?: string;
}
export default class GaSecondsOnSite {
  watchEvery: number = 1000;
  lSkey: string;
  activity: Activity[] = [];
  timers: Timers = {};
  counters: Counters = {};
  eventFlag: Events = {};
  eventList = [
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
  constructor({ activity, lSkey = "GaSecondsOnSite" }: IGaSecondsOnSite) {
    this.activity = activity;
    this.lSkey = lSkey;
  }
  addListenerMulti() {
    for (var i = 0, iLen = this.eventList.length; i < iLen; i++) {
      document.addEventListener(this.eventList[i], this.eventTrigger);
    }
  }

  eventTrigger = () => {
    this.eventFlag = this.activity.reduce((events: Events, item: Activity) => {
      return {
        ...events,
        [item.name]: true
      };
    }, {});
  };

  loadDataFromLS() {
    const lsData = window.localStorage.getItem(this.lSkey);
    if (lsData) {
      const data: LsData = JSON.parse(lsData);
      this.counters = data;
    } else {
      this.counters = this.activity.reduce(
        (counters: Counters, item: Activity) => {
          return {
            ...counters,
            [item.name]: { test: 0, achiev: 0, cbStatus: false }
          };
        },
        {}
      );
    }
  }

  process() {
    this.addListenerMulti();
    this.loadDataFromLS();
    this.eventTrigger();
    this.activity.forEach(item => {
      this.itemProcess(item);
    });
  }
  writeDataToLs() {
    window.localStorage.setItem(this.lSkey, JSON.stringify(this.counters));
  }
  itemProcess(item: Activity) {
    const counter = this.counters[item.name];
    counter.test += 1;
    if (counter.test === item.testPeriod) {
      if (this.eventFlag[item.name]) {
        this.eventFlag[item.name] = false;
        counter.achiev += item.testPeriod;
      }
      counter.test = 0;
    }
    if (!counter.cbStatus) {
      this.timers[item.name] = setTimeout(
        () => this.itemProcess(item),
        this.watchEvery
      );
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
  }
}
