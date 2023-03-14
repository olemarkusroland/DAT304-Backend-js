import https from 'https';

const url = "https://oskarnightscoutweb1.azurewebsites.net";

export async function glucoseGET(fromDate) {
    const currentDate = new Date();

    let fromDatePlus = new Date(fromDate);
    fromDatePlus.setMinutes(fromDatePlus.getMinutes() + 5);

    const order = "/api/v1/entries/sgv.json?find[dateString][$gte]=" + fromDatePlus.toISOString() + "&find[dateString][$lte]=" + currentDate.toISOString() + "&count=all";
    
    return new Promise(function (resolve, reject) {
        https.get(url + order, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const jsonData = JSON.parse(data);
                let glucoseList = [];

                for (const entry of jsonData)
                    glucoseList.push({ glucose: entry.sgv, timestamp: entry.dateString });

                resolve(glucoseList);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

export async function insulinGET(fromDate) {
    const currentDate = new Date();

    let fromDatePlus = new Date(fromDate);
    fromDatePlus.setMinutes(fromDatePlus.getMinutes() + 5);

    const order = "/api/v1/treatments.json?find[created_at][$gte]=" + fromDatePlus.toISOString() + "&find[created_at][$lte]=" + currentDate.toISOString() + "&count=all"

    return new Promise(function (resolve, reject) {
        https.get(url + order, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const jsonData = JSON.parse(data);
                let insulinList = [];

                for (const entry of jsonData) {
                    if (entry.eventType != "Exercise" && entry.insulin != null) {
                        insulinList.push({ insulin: entry.insulin, timestamp: entry.created_at });
                    }
                }
                console.log(insulinList[0].timestamp);
                resolve(insulinList);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}