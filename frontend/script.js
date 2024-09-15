// Circle Countdown Timer
const totalDuration = 60; 
let timeLeft = totalDuration; // Initialize timeLeft here
const countdownCircle = document.getElementById('timer-circle');
const timerText = document.getElementById('timer-text');
const circumference = 2 * Math.PI * 20;  

countdownCircle.style.strokeDasharray = circumference;

function updateCountdown() {
  if (timeLeft >= 0) {
    const percentage = timeLeft / totalDuration;
    const offset = circumference - (percentage * circumference);

    countdownCircle.style.strokeDashoffset = offset;
    timerText.textContent = timeLeft;

    timeLeft--;
  } else {
    clearInterval(countdownInterval);
  }
}

// Start the countdown timer, updating every second
const countdownInterval = setInterval(updateCountdown, 1000);






// Telegram Connect Button
const telegramConnectBtn = document.getElementById('telegramConnectBtn');
if (telegramConnectBtn) {
  telegramConnectBtn.addEventListener('click', function() {
    window.location.href = "./telegram.html"; 
  });
}
// buy button 
const buyBtn = document.getElementById('buyBtn');
if (buyBtn) {
  buyBtn.addEventListener('click', function() {
    window.location.href = "https://wazirx.com/signup"; 
  });
}






// Dark/Light Mode Toggle
const toggleCheckbox = document.getElementById('toggle-checkbox');
const toggleIndicator = document.getElementById('toggle-indicator');
const navBar = document.getElementById('nav-bar');
const body = document.body;

if (toggleCheckbox) {
  toggleCheckbox.addEventListener('change', function() {
    if (this.checked) {
      // Switch to dark mode
      body.classList.add('bg-gray-900', 'text-white');
      body.classList.remove('bg-white', 'text-black');
      toggleIndicator.classList.add('translate-x-4');  
      toggleIndicator.classList.remove('translate-x-0');
      navBar.classList.add('bg-gray-900', 'text-white'); 
      navBar.classList.remove('bg-white', 'text-black');
    } else {
      // Switch to light mode

      body.classList.add('bg-white', 'text-black');
      body.classList.remove('bg-gray-900', 'text-white');
      toggleIndicator.classList.add('translate-x-0');  
      toggleIndicator.classList.remove('translate-x-4'); 
      navBar.classList.add('bg-white', 'text-black'); 
      navBar.classList.remove('bg-gray-900', 'text-white');
    }
  });
}




// Fetching Crypto Data
document.addEventListener('DOMContentLoaded', () => {
  const cryptoTableBody = document.getElementById('crypto-table-body');
  const bestPriceToTradeElements = {
    '5min': document.getElementById('best-price-5min'),
    '1hour': document.getElementById('best-price-1hour'),
    '1day': document.getElementById('best-price-1day'),
    '1month': document.getElementById('best-price-1month')
  };

  fetch('http://localhost:3001/api/cryptos') // Updated URL with port
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Log the fetched data

      // Filter and sort the data
      const topCryptos = data
        .filter(crypto => crypto.lastprice > 0) 
        .sort((a, b) => b.lastprice - a.lastprice) 
        .slice(0, 10);
      cryptoTableBody.innerHTML = '';
      let bestPrices = {
        '5min': 0,
        '1hour': 0,
        '1day': 0,
        '1month': 0,
      };

      topCryptos.forEach(crypto => {
        const row = document.createElement('tr');
        row.className = 'text-gray-400 bg-gray-700 rounded-2xl hover:bg-gray-600';
        row.innerHTML = `
          <td class="px-4 py-2">${crypto.platform}</td>
          <td class="px-4 py-2">${crypto.lastprice}</td>
          <td class="px-4 py-2">${crypto.buyprice}/${crypto.sellprice}</td>
          <td class="px-4 py-2">${crypto.diff}</td>
          <td class="px-4 py-2">${crypto.saving}</td>
        `;
        cryptoTableBody.appendChild(row);

        // Assume you have a function to get price changes for different time intervals
        // Replace the following lines with actual price calculations
        const priceChange5min = getPriceChange(crypto, '5min'); 
        const priceChange1hour = getPriceChange(crypto, '1hour');
        const priceChange1day = getPriceChange(crypto, '1day');
        const priceChange1month = getPriceChange(crypto, '1month');

        // Update best prices
        bestPrices['5min'] = Math.max(bestPrices['5min'].toFixed(2), priceChange5min);
        bestPrices['1hour'] = Math.max(bestPrices['1hour'].toFixed(2), priceChange1hour);
        bestPrices['1day'] = Math.max(bestPrices['1day'].toFixed(2), priceChange1day);
        bestPrices['1month'] = Math.max(bestPrices['1month'].toFixed(2), priceChange1month);
      });

      // Update the UI with best prices
      bestPriceToTradeElements['5min'].textContent = `${bestPrices['5min'].toFixed(2)}`;
      bestPriceToTradeElements['1hour'].textContent = `${bestPrices['1hour'].toFixed(2)}`;
      bestPriceToTradeElements['1day'].textContent = `${bestPrices['1day'].toFixed(2)}`;
      bestPriceToTradeElements['1month'].textContent = `${bestPrices['1month'].toFixed(2)}`;
    })
    .catch(error => console.error('Error fetching data:', error));
});


function getPriceChange(crypto, interval) {

  return Math.random() * 100;
}





// Fetching Crypto Data
document.addEventListener('DOMContentLoaded', () => {
  const cryptoTableBody = document.getElementById('crypto-table-body');
  fetch('http://localhost:3001/api/cryptos') // Updated URL with port
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Log the fetched data

      const topCryptos = data
        .filter(crypto => crypto.lastprice > 0) // Only include cryptocurrencies with a last price greater than 0
        .sort((a, b) => b.lastprice - a.lastprice) // Sort in decreasing order by lastprice
        .slice(0, 10).toFixed(2); // Get the top 10 cryptocurrencies
      cryptoTableBody.innerHTML = '';

      topCryptos.forEach(crypto => {
        const row = document.createElement('tr');
        row.className = 'text-gray-400 mb-5 bg-gray-700 rounded-5xl hover:bg-gray-600 ';
        row.innerHTML = `
          <td class="px-4 py-2  ">${crypto.platform}</td>
          <td class="px-4 py-2  ">${crypto.lastprice}</td>
          <td class="px-4 py-2 y">${crypto.buyprice}/${crypto.sellprice}</td>
          <td class="px-4 py-2  ">${crypto.diff}</td>
          <td class="px-4 py-2  ">${crypto.saving}</td>
        `;
        cryptoTableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
});
