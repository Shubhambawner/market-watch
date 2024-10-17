deployment_id = `AKfycbxKsMvPhROohu0qApti-VARO-CggV3KsxHfreO1AfvFuj9QP3lXfGDGiWMWnlVXTqXi`
gapi_url = `https://script.google.com/macros/s/${deployment_id}/exec`

dev_used_key = `498BDDE747614DD8BA4E011DB381BF82`
var keys = []
key_to_use = 0
function createStockChartDiv(exchange, tradingsymbol, quantity, holdings_buy_value) {
    key_to_use = (key_to_use + 1) % keys.length
    stockdio_api_key = keys[key_to_use]

    // Create a new div element
    var newDiv = document.createElement("div");
    newDiv.classList.add('mycontainer');

    newDiv.onmouseleave = function () {
        // Scroll the div to top=0 and left=0
        newDiv.scrollTop = 0;
        newDiv.scrollLeft = 0;
    };

    // Create a label for the quantity
    var quantityLabel = document.createElement("div");
    quantityLabel.id = `${tradingsymbol}/${quantity}`;  // Assign the ID
    quantityLabel.classList.add('quantity-label');

    // Set the initial content for the label (only quantity)
    quantityLabel.innerHTML = `${tradingsymbol}/${quantity}`;;

    quantityLabel.onmouseenter = function () {
        quantityLabel.innerHTML = `${tradingsymbol}/${quantity}@${holdings_buy_value} <button id="btn_${tradingsymbol}/${quantity}@${holdings_buy_value}">(⟳)</button>`;;
        document.getElementById(`btn_${tradingsymbol}/${quantity}@${holdings_buy_value}`).onclick = function () {
            iframe = document.getElementById(`iframe_${tradingsymbol}/${quantity}@${holdings_buy_value}`)
            // .contentWindow.location.reload();
            iframe.src = iframe.src;  // This will reload the iframe
        }
    }
    quantityLabel.onmouseleave = function () {
        quantityLabel.innerHTML = `${tradingsymbol}/${quantity}`;;
    }
    quantityLabel.ontouchstart = quantityLabel.onmouseenter
    quantityLabel.ontouchend = quantityLabel.onmouseleave
    // Set up the Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Load the iframe when the div becomes visible
                var newDivChild = document.createElement("div");
                newDivChild.classList.add('mycontainerChild');

                // Create and load the iframe when the div becomes visible
                var iframe = document.createElement("iframe");
                iframe.id = `iframe_${tradingsymbol}/${quantity}@${holdings_buy_value}`
                iframe.frameBorder = '0';
                iframe.scrolling = 'yes';
                iframe.width = '110%';
                iframe.height = '140%';
                iframe.src = `https://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=${stockdio_api_key}&indicators=ExponentialMovingAverage(50);SimpleMovingAverage(200);WeightedMovingAverage(10);&stockExchange=${exchange}&symbol=${tradingsymbol}&intraday=false&displayPrices=Candlestick&dividends=true&splits=true&showUserMenu=false&palette=Financial-Light&showBorderAndTitle=false`;

                // Append the iframe to the div
                newDiv.appendChild(newDivChild);
                // Append the iframe to the div
                newDivChild.appendChild(iframe);

                // Stop observing once the iframe has been loaded
                observer.unobserve(newDiv);
            }
        });
    });

    // Start observing the new div
    observer.observe(newDiv);

    // Append the label to the new div
    newDiv.appendChild(quantityLabel);

    // Append the new div to the div with id 'idChartsContainer'
    var container = document.getElementById("idChartsContainer");
    if (container) {
        container.appendChild(newDiv);
    } else {
        console.error("Element with id 'idChartsContainer' not found.");
    }
}

function fetchAndDisplayIframes() {
    // Fetch the data from someapi.com (mocked here for illustration)
    const urlParams = new URLSearchParams(window.location.search);
    const subsheet = urlParams.get('subsheet');  // Gets the 'subsheet' query param

    fetch(gapi_url + `?subsheet=${subsheet || "data_holdings"}`, {
        method: 'GET',  // We're fetching the data, so use GET method
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();  // Parse the response as JSON
        })
        .then(data => {
            // data = data.filter(x => x.isin != '')
            console.log('Data from Google Sheets:', data);  // Print the fetched data to the console
            // Get the parent container

            i = 0
            // Loop through the data and append the iframes
            for (stock of data) {

                // if (i == 20) {
                //     return
                // }
                // i++
                const { tradingsymbol, exchange, total_quantity, holdings_buy_value } = stock;

                createStockChartDiv(exchange, tradingsymbol, total_quantity, holdings_buy_value / total_quantity)
            };
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function encodedPassKey(passkey) {
    return passkey; // Base64 encoding
}

async function authenticateFetchKeys() {
    // Prompt the user for the passkey
    const passkey = prompt("Please enter your passkey:");

    // Encrypt the passkey (Base64 encoding in this case)
    const encryptedPasskey = encodedPassKey(passkey);

    // Build the API URL with the encrypted passkey as a query parameter
    const apiUrl = `${gapi_url}?authKeys=${encodeURIComponent(encryptedPasskey)}`;

    // Send the fetch request
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to authenticate and fetch keys:", error);
    }
}
// Call the function to fetch data and display iframes
authenticateFetchKeys()
    .then((stockido_keys) => {
        if (stockido_keys) {
            console.log(stockido_keys);
            keys = stockido_keys
            fetchAndDisplayIframes();
        }else{
            console.log('unauthorised~');
            
        }
    })
