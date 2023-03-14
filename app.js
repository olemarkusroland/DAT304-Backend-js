import { glucoseGET, insulinGET } from './nightscoutAPI.js'
import { realmTest, readLatestGlucose, updateGlucose, readLatestInsulin, updateInsulin } from './realm.js'
import  server  from './localAPI.js';

//console.log(updateGlucose());
//cosole.log(readLatestInsulin());
//console.log(updateInsulin());

console.log("hei")

server();
