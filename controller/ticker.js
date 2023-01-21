const fetch = require('node-fetch-retry');

const getCoinPrice = async (coin) => {
  const url = `${process.env.TICKER_URL}/${coin}/`;
  try {
    const resp = await fetch(url, {
      method: 'GET',
      retry: 3,
      pause: 500,
      silent: true,
      callback: retry => { console.log(`Trying: ${retry}`) }
    });
    const { data } = await resp.json();
    return data;
  } catch(e) {
    console.warn(e, 'node-fetch error');
    return null;
  }
};

module.exports = {
  getCoinPrice
}
