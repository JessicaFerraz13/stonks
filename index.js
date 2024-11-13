async function fetchAdvices()
{
    const adviceText = document.getElementById('advice-text');

    try
    {
        const response = await fetch('https://api.adviceslip.com/advice');
        const content = await response.json();

        adviceText.innerText = `${content.slip.advice}`;
    }
    catch (err)
    {
        adviceText.innerText = 'Nothing to say today.';
    }
}

async function fetchExchangeRate() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        return data.rates.BRL;  // Retorna a taxa de câmbio de USD para BRL
    } catch (err) {
        console.error("Erro ao obter a taxa de câmbio:", err);
        return null;
    }
}

async function fetchCryptos() {
    try {
        const exchangeRate = await fetchExchangeRate(); // Obtém a taxa de câmbio USD -> BRL
        const response = await fetch('https://api.coincap.io/v2/assets');
        const content = await response.json();

        if (content && content.data && exchangeRate) {
            const tableBody = document.getElementById('cryptos-tbody');
            tableBody.innerHTML = '';

            content.data.forEach(index => {
                const rank = index.rank;
                const name = index.name;
                const symbol = index.symbol;
                const explorer = index.explorer;
                const changePercent24Hr = parseFloat(index.changePercent24Hr).toFixed(2);
                
                // Valores em Dólar (USD)
                const priceUsd = parseFloat(index.priceUsd).toFixed(2);
                const volumeUsd24Hr = parseFloat(index.volumeUsd24Hr).toFixed(2);
                const marketCapUsd = parseFloat(index.marketCapUsd).toFixed(2);

                // Converte o valor de USD para BRL
                const priceBrl = (parseFloat(priceUsd) * exchangeRate).toFixed(2);

                // Define a cor da variação dependendo se é positiva ou negativa
                const change = changePercent24Hr >= 0 ? 'positive' : 'negative';

                // Cria o item da tabela com os dados
                const tableRow = document.createElement('tr');

                tableRow.innerHTML = `
                    <td class="crypto-rank">${rank}</td>
                    <td class="crypto-name">${name}</td>
                    <td class="crypto-symbol">${symbol}</td>
                    <td class="crypto-price">USD$ ${priceUsd}</td>
                    <td class="crypto-price">BRL R$ ${priceBrl}</td> <!-- Adiciona coluna em BRL -->
                    <td class="crypto-change ${change}">${changePercent24Hr}%</td>
                    <td class="crypto-volume">USD$ ${volumeUsd24Hr}</td>
                    <td class="crypto-marketcap">USD$ ${marketCapUsd}</td>
                    <td>${explorer ? `<a href="${explorer}" target="_blank">Link</a>` : 'N/A'}</td>
                `;

                tableBody.appendChild(tableRow);
            });
        }
    } catch (err) {
        const table = document.getElementById('cryptos-table');
        table.innerHTML = '<p>This API is really bad!</p>';
    }
}

function DOMContentLoaded()
{
    fetchAdvices();
    fetchCryptos();

    setInterval(fetchAdvices, 60000);
    setInterval(fetchCryptos, 10000);
}

document.addEventListener("DOMContentLoaded", DOMContentLoaded);
