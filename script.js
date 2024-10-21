// API keys and URLs
const API_KEY = 'cs2ekq1r01qpjum5u4m0cs2ekq1r01qpjum5u4mg';
const apiUrl = 'https://finnhub.io/api/v1/quote?symbol=';
const overviewUrl = 'https://finnhub.io/api/v1/stock/profile2?symbol=';
const alphaVantageKey = 'UU60XX68KCC8KVFD';

function fetchStockData() {
    const symbol = document.getElementById('stock-symbol').value;
    const url = `${apiUrl}${symbol}&token=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            if (data.c) { 
                document.getElementById('stock-info').innerHTML = `
                    <p>Symbol: ${symbol}</p>
                    <p>Current Price: $${data.c}</p>
                    <p>High Price: $${data.h}</p>
                    <p>Low Price: $${data.l}</p>
                    <p>Previous Close: $${data.pc}</p>
                `;
            } else {
                document.getElementById('stock-info').innerHTML = '<p>Stock information not available. Please check the symbol.</p>';
            }
        })
        .catch(error => console.error('Error fetching stock data:', error));
}

function fetchHistoricalData() {
    const symbol = document.getElementById('history-symbol').value;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${alphaVantageKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const timeSeries = data['Time Series (Daily)'];
            if (timeSeries) {
                const labels = [];
                const prices = [];

                const recentDays = Object.keys(timeSeries).slice(0, 30);
                recentDays.forEach(date => {
                    labels.push(date);
                    prices.push(parseFloat(timeSeries[date]['4. close']));
                });

                const ctx = document.getElementById('stockChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels.reverse(),
                        datasets: [{
                            label: `${symbol} Historical Price`,
                            data: prices.reverse(),
                            borderColor: 'rgba(75, 192, 192, 1)',
                            fill: false,
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: { title: { display: true, text: 'Date' }},
                            y: { title: { display: true, text: 'Price (USD)' }}
                        }
                    }
                });
            } else {
                alert(`Historical data not available for symbol: ${symbol}`);
            }
        })
        .catch(error => console.error('Error fetching historical data:', error));
}

function addStockToPortfolio() {
    const symbol = document.getElementById('portfolio-symbol').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);
    
    if (!symbol || isNaN(quantity)) {
        alert('Please fill in all fields to add to your portfolio.');
        return;
    }

    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.c) { 
                const price = data.c;
                const totalCost = (price * quantity).toFixed(2);
                
                const portfolioList = document.getElementById('portfolio-list');
                const newStock = document.createElement('p');
                newStock.textContent = `${symbol} - Current Price: $${price}, Quantity: ${quantity}, Total Cost: $${totalCost}`;
                portfolioList.appendChild(newStock);
                
               
                document.getElementById('portfolio-symbol').value = '';
                document.getElementById('quantity').value = '';
            } else {
                alert('Unable to fetch the current stock price. Please check the symbol and try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching stock data:', error);
            alert('Error fetching stock data. Please try again later.');
        });
}
