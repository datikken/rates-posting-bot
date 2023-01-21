const {getCoinPrice} = require("../controller/ticker.js");
const {Coin, Country, Heading} = require("../models");

const getCurrencySign = async (sign) => {
  switch(sign) {
    case "USD":
      return '$'
    case "EUR":
      return '€'
    case "CNY":
      return "¥"
    case "JPY":
      return "¥"
    case "KRW":
      return "₩"
    case "BRL":
      return "R$"
    case "TRY":
      return "₺"
  }
};

const formatMessage = async (data) => {
  const flag = data[data.country.currency].day >= 0 ? "🟢":"🔴";
  const name = data.coin.name;
  const sign = await getCurrencySign(data.country.currency);
  const price = data[data.country.currency].price;
  const mathSign = data[data.country.currency].day > 0 ? "+": "";
  const day = `${data[data.country.currency].day}%`;

  return `${flag} ${name} (${data.coin.symbol}) - ${sign}${price} (${mathSign}${day})`;
}

const prepareMessageByTaskArr = async arr => {
  return Promise.all(arr.map(async el => {
    const coin = await Coin.findByPk(el.coin_id);
    const country = await Country.findByPk(el.country_id);
    const data = await getCoinPrice(coin.symbol);

    if(!data) return;
    if(!data[country.currency]) return;

    data.country = country;
    data.coin = coin;

    return await formatMessage(data);
  }));
};

const prepareMessageHeading = async (country) => {
  const heading = await Heading.findOne({
    where: {
      country_id: country
    }
  });
  if(heading) {
    return `<b>${heading.content}</b>\n`;
  } else {
    return '';
  }
}

const getPreparedPost = async (tasksArr) => {
  const coinsData = await prepareMessageByTaskArr(tasksArr);
  const heading = await prepareMessageHeading(tasksArr[0].country_id);

  if(coinsData.every(el => typeof el === 'undefined')) return null;

  return `${heading}${coinsData.join('\n')}`;
}

module.exports = {
  getPreparedPost
}
