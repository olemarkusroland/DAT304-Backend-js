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

function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

export async function glucoseGET(fromDate) {
    console.log(fromDate);
    const currentDate = new Date();
    
    const test = parseISOString(fromDate)
    console.log(test)

    const fromDatePlus = new Date(test + 5 * 60000);
    console.log(fromDatePlus);

    const order = "/api/v1/entries/sgv.json?find[dateString][$gte]=" + fromDatePlus + "&find[dateString][$lte]=" + currentDate.toISOString() + "&count=all";

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