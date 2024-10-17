deployment_id = `AKfycbxKsMvPhROohu0qApti-VARO-CggV3KsxHfreO1AfvFuj9QP3lXfGDGiWMWnlVXTqXi`
gapi_url = `https://script.google.com/macros/s/${deployment_id}/dev`
zerodha_url = `https://console.zerodha.com/api/reports/holdings/portfolio?date=${new Date().toISOString().split('T')[0]}&children=LQT791&children=GXT264`
fetch(zerodha_url, {
    method: 'GET',
    headers: {
        'authority': 'console.zerodha.com',
        'accept': 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.6',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'priority': 'u=1, i',
        'referer': 'https://console.zerodha.com/',
        'sec-ch-ua': '"Brave";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'sec-gpc': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'Cookie': document.cookie,
        'x-csrftoken': document.cookie.split(';').find(x=>x.indexOf('public_token=')!=-1).split('=')[1]
    }
})
    .then(response => response.json())
    .then(data => {
        eqDataArray = data.data.result.eq
        if (data.data.state != "SUCCESS") {
            console.log('No data fetched!');
            console.log(data)
            return;
        }
        fetch(gapi_url, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eqDataArray)
        })
            .then(response => {
                console.log('data dumped successfully!');
            })
            .catch(error => {
                console.error('Error making POST request:', error);
            });
    })
    .catch(error => console.error('Error:', error));