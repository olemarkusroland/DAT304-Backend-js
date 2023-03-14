import Realm from 'realm';
import { glucoseGET, insulinGET } from './nightscoutAPI.js'

const User = {
    name: "User",
    properties: {
        id: "int",
        name: "string",
        email: "string",
        Age: "int",
    },
    primaryKey: "id",
};

class Food extends Realm.Object {
    static schema = {
        name: "Food",
        properties: {
            name: "string",
            calories: "float",
            carbohydrates: "float",
            protein: "float",
            fat: "float",
        },
        primaryKey: "name",
    };
}

class FoodEntry extends Realm.Object {
    static schema = {
        name: "FoodEntry",
        properties: {
            //_id: "int",
            food: "Food",
            amount: "float",
        },
        //primaryKey: "_id",
    };
}

class FoodEntries extends Realm.Object {
    static schema = {
        name: "FoodEntries",
        properties: {
            //_id: "int",
            timestamp: "string",
            entries: "FoodEntry[]",
        },
        //primaryKey: "_id",
    };
}

class Configuration extends Realm.Object {
    static schema = {
        name: "Configuration",
        properties: {
            nightscoutAPI: "string",
            nightscoutSecret: "string",
            healthKitAPI: "string",
            healthKitSecret: "string",
            GPU: "bool"
        },
    };
}

class ExercicesInfo extends Realm.Object {
    static schema = {
        name: "ExercicesInfo",
        properties: {
            caloriesBurned: "float",
            timestamp: "string"
        }
    }
}

export class GlucoseInfo extends Realm.Object {
    static schema = {
        name: "GlucoseInfo",
        properties: {
            glucose: "float",
            timestamp: "string"
        }
    }
}

class InsulinInfo extends Realm.Object {
    static schema = {
        name: "InsulinInfo",
        properties: {
            insulin: "float",
            timestamp: "string"
        }
    }
}

const realm = await Realm.open({
    path: "my.realm",
    schema: [User, Food, FoodEntry, FoodEntries, Configuration, ExercicesInfo, GlucoseInfo, InsulinInfo],
});

export function realmTest() {
    const foods = realm.objects("Food");
    for (const food of foods) {
        console.log(food.name);
    }
};

export function readLatestGlucose() {
    let glucoseInfos = realm.objects("GlucoseInfo");

    if (glucoseInfos.isEmpty())
        return null;

    glucoseInfos = glucoseInfos.sorted("timestamp", true);

    return glucoseInfos[0];
};

export function readLatestInsulin() {
    let insulinInfos = realm.objects("InsulinInfo");

    if (insulinInfos.isEmpty())
        return null;

    insulinInfos = insulinInfos.sorted("timestamp", true);

    return insulinInfos[0];
};

export async function updateGlucose() {
    const latestGlucose = readLatestGlucose()
    
    if (latestGlucose == null) {  // Checks if database is empty
        const currentDate = new Date();
        const fromDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        var result = await glucoseGET(fromDate);
    }
    else {
        const fromDate = latestGlucose.timestamp;
        var result = await glucoseGET(fromDate);
    }
        
        realm.write(() => {
            for (const glucoseInfo of result)
                realm.create("GlucoseInfo", { glucose: glucoseInfo.glucose, timestamp: glucoseInfo.timestamp });
        });
    
    console.log("Database: Glucose updated")
};

export async function updateInsulin() {
    const latestInsulin = readLatestInsulin();

    if (latestInsulin == null) {  // Checks if database is empty
        const currentDate = new Date();
        const fromDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        var result = await insulinGET(fromDate);
    }
    else {
        const fromDate = latestInsulin.timestamp;
        var result = await insulinGET(fromDate);
    }

    realm.write(() => {
        for (const insulinInfo of result)
            realm.create("InsulinInfo", { insulin: insulinInfo.insulin, timestamp: insulinInfo.timestamp });
    });

    console.log("Database: Insulin updated")
}