# Google analytics seconds on site counter

## Usage
```ts
import {GaSecondsOnSite} from "ga-seconds-on-site";

const firstActivity = {
  achieveTime: 10, // The time (in seconds) at which achievement will be counted (caused by the callBack function)
  testPeriod: 10, // Time (in seconds) - the frequency of checking events on the page
  name: "first", // Uniq Activity time name 
  callback: () => {ga('send', 'event', 'Activity', '10_sec');} // Calback function
};

const gaSecondsOnSite = new GaSecondsOnSite({
  activity: [firstActivity], // List of activity what we call
  lSkey: "xena" // Local storage name of key for store params 
});

gaSecondsOnSite.process();

```
