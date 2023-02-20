import Realm from 'realm';
import { glucoseGET } from './nightscoutAPI.js'

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
    glucoseInfos = glucoseInfos.sorted("timestamp", true);

    return glucoseInfos[0];
};

export async function updateGlucose() {
    const fromDate = readLatestGlucose().timestamp;
    var result = await glucoseGET(fromDate);

    realm.write(() => {
        for (const glucoseInfo of result)
            realm.create("GlucoseInfo", { glucose: glucoseInfo.glucose, timestamp: glucoseInfo.timestamp });
    });
};