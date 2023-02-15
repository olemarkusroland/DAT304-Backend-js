import Realm from 'realm';

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

const Food = {
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

const FoodEntry = {
    name: "FoodEntry",
    properties: {
        //_id: "int",
        food: "Food",
        amount: "float",
    },
    //primaryKey: "_id",
};

const FoodEntries = {
    name: "FoodEntries",
    properties: {
        //_id: "int",
        timestamp: "string",
        entries: "FoodEntry[]",
    },
    //primaryKey: "_id",
};

const Configuration = {
    name: "Configuration",
    properties: {
        nightscoutAPI: "string",
        nightscoutSecret: "string",
        healthKitAPI: "string",
        healthKitSecret: "string",
        GPU: "bool"
    },
};

const ExercicesInfo = {
    name: "ExercicesInfo",
    properties: {
        caloriesBurned: "float",
        timestamp: "string"
    }
}

const GlucoseInfo = {
    name: "GlucoseInfo",
    properties: {
        glucose: "float",
        timestamp: "string"
    }
}

const InsulinInfo = {
    name: "InsulinInfo",
    properties: {
        insulin: "float",
        timestamp: "string"
    }
}

const realm = await Realm.open({
    path: "my.realm",
    schema: [User, Food, FoodEntry, FoodEntries, Configuration, ExercicesInfo, GlucoseInfo, InsulinInfo],
}); 

let bannana, apple;

let FoodEntry1;
realm.write(() => {
    bannana = realm.create("Food", {
        name: "Bannana",
        calories: 100,
        carbohydrates: 10,
        protein: 4,
        fat: 3
    });
    //apple = realm.create("Food", {
    //    name: "Apple",
    //    calories: 80,
    //    carbohydrates: 30,
    //    protein: 6,
    //    fat: 10
    //});
    FoodEntry1 = realm.create("FoodEntry", {
        food: bannana,
        amount: 10
    })
});