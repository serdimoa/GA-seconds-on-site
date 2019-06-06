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
export declare class GaSecondsOnSite {
    watchEvery: number;
    lSkey: string;
    activity: Activity[];
    timers: Timers;
    counters: Counters;
    eventFlag: Events;
    eventList: string[];
    constructor({ activity, lSkey }: IGaSecondsOnSite);
    addListenerMulti(): void;
    eventTrigger: () => void;
    loadDataFromLS(): void;
    process(): void;
    writeDataToLs(): void;
    itemProcess(item: Activity): void;
}
export {};
