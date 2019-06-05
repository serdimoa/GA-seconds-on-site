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
    eventFlag: boolean;
    eventList: string[];
    constructor({ activity, lSkey }: IGaSecondsOnSite);
    addListenerMulti(): void;
    eventTrigger: () => void;
    loadDataFromLS(): void;
    process(): void;
    writeDataToLs(item: Counter, name: string): void;
    itemProcess(item: Activity): void;
}
export {};
