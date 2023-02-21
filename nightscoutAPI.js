import https from 'https';

const url = "https://oskarnightscoutweb1.azurewebsites.net";

export function nightscoutTest() {
    const url = "https://oskarnightscoutweb1.azurewebsites.net";
    const order = "/api/v1/entries/sgv.json?find[dateString][$gte]=2023-01-28&find[dateString][$lte]=2023-02-1";

    https.get(url + order, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const jsonData = JSON.parse(data);
            console.log(jsonData);
        });
    }).on('error', (err) => {
        console.error(err);
    });
}



export async function glucoseGET(fromDate) {
    const currentDate = new Date();

    let fromDatePlus = new Date(fromDate);
    fromDatePlus.setMinutes(fromDatePlus.getMinutes() + 5);

    const order = "/api/v1/entries/sgv.json?find[dateString][$gte]=" + fromDatePlus.toISOString() + "&find[dateString][$lte]=" + currentDate.toISOString() + "&count=all";
    console.log(order);

    return new Promise(function (resolve, reject) {
        https.get(url + order, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const jsonData = JSON.parse(data);
                let glucoseList = [];

                for (const entry of jsonData) {
                    glucoseList.push({ glucose: entry.sgv, timestamp: entry.dateString });
                };

                resolve(glucoseList);
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}