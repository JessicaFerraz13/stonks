// Função para buscar e exibir conselhos aleatórios usando uma API externa
async function fetchAdvices()
{
    const adviceText = document.getElementById('advice-text'); // Seleciona o elemento onde o conselho será exibido

    try
    {
        const response = await fetch('https://api.adviceslip.com/advice'); // Faz uma requisição à API e espera a resposta
        const content = await response.json(); // Converte a resposta em JSON

        adviceText.innerText = `${content.slip.advice}`; // Exibe o conselho no elemento HTML
    }
    catch (err)
    {
        adviceText.innerText = 'Nothing to say today.'; // Caso haja erro, exibe uma mensagem padrão
    }
}

// Função para buscar a taxa de câmbio USD -> BRL usando uma API externa
async function fetchExchangeRate()
{
    try
    {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD'); // Faz a requisição à API de taxas de câmbio
        const data = await response.json(); // Converte a resposta em JSON
        return data.rates.BRL;  // Retorna a taxa de câmbio de USD para BRL
    }
    catch (err)
    {
        console.error("Erro ao obter a taxa de câmbio:", err); // Exibe o erro no console
        return null; // Retorna um valor nulo em caso de erro
    }
}

// Função para buscar dados de criptomoedas usando uma API externa e exibi-los em uma tabela
async function fetchCryptos() {
    try
    {
        const exchangeRate = await fetchExchangeRate(); // Obtém a taxa de câmbio USD -> BRL
        const response = await fetch('https://api.coincap.io/v2/assets'); // Requisição à API de criptomoedas
        const content = await response.json(); // Converte a resposta em JSON

        // Verifica se os dados foram carregados e se a taxa de câmbio está disponível
        if (content && content.data && exchangeRate)
        {
            const tableBody = document.getElementById('cryptos-tbody'); // Seleciona o corpo da tabela
            tableBody.innerHTML = ''; // Limpa o conteúdo atual da tabela

            // Percorre cada criptomoeda recebida da API
            content.data.forEach(index => {
                const rank = index.rank;
                const name = index.name;
                const symbol = index.symbol;
                const explorer = index.explorer;
                const changePercent24Hr = parseFloat(index.changePercent24Hr).toFixed(2);
                
                const priceUsd = parseFloat(index.priceUsd).toFixed(2); // Preço em Dólar
                const volumeUsd24Hr = parseFloat(index.volumeUsd24Hr).toFixed(2);
                const marketCapUsd = parseFloat(index.marketCapUsd).toFixed(2);

                const priceBrl = (parseFloat(priceUsd) * exchangeRate).toFixed(2); // Converte o valor de USD para BRL usando a taxa de câmbio

                const change = changePercent24Hr >= 0 ? 'positive' : 'negative'; // Define a cor da variação dependendo se é positiva ou negativa

                const tableRow = document.createElement('tr'); // Cria o item da tabela com os dados de cada criptomoeda

                tableRow.innerHTML = `
                    <td class="crypto-rank">${rank}</td>
                    <td class="crypto-name">${name}</td>
                    <td class="crypto-symbol">${symbol}</td>
                    <td class="crypto-price">USD$ ${priceUsd}</td>
                    <td class="crypto-price">BRL R$ ${priceBrl}</td>
                    <td class="crypto-change ${change}">${changePercent24Hr}%</td>
                    <td class="crypto-volume">USD$ ${volumeUsd24Hr}</td>
                    <td class="crypto-marketcap">USD$ ${marketCapUsd}</td>
                    <td>${explorer ? `<a href="${explorer}" target="_blank">Link</a>` : '-'}</td>
                `;

                tableBody.appendChild(tableRow); // Adiciona a linha à tabela
            });
        }
    }
    catch (err)
    {
        const table = document.getElementById('cryptos-table'); // Seleciona o corpo da tabela
        table.innerHTML = '<p>This API is really bad!</p>'; // Exibe uma mensagem de erro caso não seja possível carregar os dados da API
    }
}

// Função executada ao carregar o DOM
function DOMContentLoaded()
{
    fetchAdvices(); // Chama a função para buscar conselhos
    fetchCryptos(); // Chama a função para buscar dados de criptomoedas

    setInterval(fetchAdvices, 60000); // Define um intervalo para atualizar os conselhos a cada 60 segundos
    setInterval(fetchCryptos, 10000); // Define um intervalo para atualizar os dados de criptomoedas a cada 10 segundos
}

// Adiciona o evento de carregamento do DOM para iniciar as funções
document.addEventListener("DOMContentLoaded", DOMContentLoaded);
