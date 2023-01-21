const cron = require('node-cron');
const ct = require('countries-and-timezones');
const {postTasksToChannel} = require("./posting.js");
const _ = require("lodash");
const {Country, Task} = require("../models");

class ScheduleController {
  async getAllTimezonesForAllCountries()
  {
    const countries = await Country.findAll();
    let allTZ = [];
    for (let country in countries) {
      const tz = ct.getCountry(countries[country].iso);
      tz.timezones.map(tzVariant => allTZ.push(tzVariant))
    }
    return allTZ;
  }

  async stopAllTasks()
  {
    cron.getTasks().forEach(task => {
      task.stop();
    });

    global.scheduledTasks = new Map();
  }

  async runScheduledTasks(bot)
  {
    const tasks = await Task.findAll();
    const grouped = _.groupBy(tasks, el => [el.timezone, el.channel_id, el.time]);
    const preparedTasks = [];

    for (let group in grouped) {
      const groupTime = group.split(',')[2];
      const groupTimeZone = group.split(',')[0];
      if(!cron.validate(groupTime)) return;
      const singleTask = cron.schedule(groupTime, async () => {
        postTasksToChannel(grouped[group], bot);
      }, {
        scheduled: true,
        timezone: groupTimeZone
      });
      preparedTasks.push(singleTask);
    }

    preparedTasks.forEach(task => task.start());
  }
}

const scheduller = new ScheduleController();

module.exports = {
  scheduller
}
