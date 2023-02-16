import https from 'https';

export function nightscoutGET() {
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