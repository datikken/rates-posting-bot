const {Markup} = require( "telegraf");
const {CallbackData} = require('@bot-base/callback-data');
const {Country, Task, Coin} = require("../models");

const deleteData = new CallbackData('delete', ['id']);
const countryData = new CallbackData('create_country', ['id', 'type']);
const coinData = new CallbackData('add_coin', ['id']);

const getAllCountryButtons = async (dataType) => {
  const countries = await Country.findAll();
  let res = [];
  for (let country in countries) {
    res.push([
      Markup.button.callback(`${countries[country].name} ${countries[country].iso} ${countries[country].flag}`,
          countryData.create({
            type: dataType,
            id: countries[country].id,
          })
      )]);
  }
  return res;
};

const getAllCoinButtons = async () => {
  const coins = await Coin.findAll();
  let res = [];
  coins.map(coin => {
    res.push([
      Markup.button.callback(`${coin.symbol} ${coin.name}`,
        coinData.create({
          type: 'add_coin',
          id: coin.id,
        })
      )]);
  })
  return res;
}

const getFinalButtons = async () => {
  return [
    Markup.button.callback('Reset', 'reset'),
    Markup.button.callback('Save', 'save'),
  ]
}

const getTimezonesButtons = (tz) => {
  let res = [];
  tz.map(tzStr => {
    res.push([Markup.button.callback(`${tzStr}`, `${tzStr}`)]);
  })
  return res;
}

const getAllTasksButtons = async () => {
  const tasks = await Task.findAll();
  return Promise.all(tasks.map(async task => {
      const country = await Country.findByPk(task.country_id);
      const coin = await Coin.findByPk(task.coin_id);
      return [
        Markup.button.callback(
          `${country.name} ${task.timezone} ${coin.symbol} at ${task.time} ❌`,
          deleteData.create({
            type: 'delete',
            id: task.id,
          }))
      ];
    })
  );
}

module.exports = {
  deleteData,
  countryData,
  coinData,
  getAllCountryButtons,
  getAllCoinButtons,
  getFinalButtons,
  getTimezonesButtons,
  getAllTasksButtons,
}
