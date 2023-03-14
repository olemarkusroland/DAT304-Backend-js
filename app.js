import { glucoseGET, insulinGET } from './nightscoutAPI.js'
import { realmTest, readLatestGlucose, updateGlucose, readLatestInsulin, updateInsulin } from './realm.js'
import  server  from './localAPI.js';

//console.log(updateGlucose());
//cosole.log(readLatestInsulin());
//console.log(updateInsulin());
setInterval(updateGlucose, 5 * 60 * 1000);
setInterval(updateGlucose, 5 * 60 * 1000);
console.log("hei")

server();
