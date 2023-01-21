const ct = require('countries-and-timezones');
const {Country, Coin, Channel, Task} = require("../models");

class QueryBuilder {
  constructor() {
    this.query = {};
  }

  async getChannelByCountry(id) {
    return await Channel.findOne({
      where: {
        country_id: id
      }
    });
  }

  async getCountry() {
    return this.query.country;
  }

  async addCountry(id) {
    this.query.country = await Country.findByPk(id);
  }

  async addCoin(coin) {
    this.query.coin = await Coin.findByPk(coin);
  }

  async addTime(hour) {
    this.query.time = await this.getCronFormatedTimeString(hour);
  }

  async addTimezone(tz) {
    this.query.tz = tz;
  }

  async getTotal() {
    return `${this.query.country.iso} ${this.query.country.flag} ${this.query.tz ?? ''} ${this.query.coin.symbol} at ${this.query.time}`;
  }

  async getCronFormatedTimeString(hour) {
    if(process.env.ENV === 'production') {
      return `0 ${hour} * * *`;
    } else {
      return `* * * * *`;
    }
  }

  async getTimeZoneByCountry(country) {
    return ct.getCountry(country).timezones;
  }

  async save() {
    const defaultTz = await this.getTimeZoneByCountry(this.query.country.iso);
    const channel = await this.getChannelByCountry(this.query.country.id);
    Task.create({
      time: this.query.time,
      channel_id: channel.id,
      coin_id: this.query.coin.id,
      country_id: this.query.country.id,
      timezone:  this.query.tz ?? defaultTz[0]
    })
    await this.reset();
    return 'Saved!';
  }

  async deleteTask(id) {
    return Task.destroy({
      where: {
        id
      }
    });
  }

  async reset() {
    this.query = {};
  }
}

const qb = new QueryBuilder();

module.exports = {
  qb
}
