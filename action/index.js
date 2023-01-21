const {qb} = require("../database/qb.js");
const ct = require("countries-and-timezones");
const {
  deleteData,
  countryData,
  coinData,
  getAllCoinButtons,
  getFinalButtons,
  getTimezonesButtons
} = require("../database/button.js");

const {TimePicker} = require("telegraf-time-picker");
const {scheduller} = require("../controller/schedule.js");
const {Markup, deunionize} = require('telegraf');
const {security} = require("../controller/security.js");
const {headingState} = require('../state/heading');

const setBotActions = async (bot) => {
  const timePicker = new TimePicker(bot);
  const allTimezones = await scheduller.getAllTimezonesForAllCountries();

  bot.action(
    deleteData.filter({
      action: 'delete'
    }),
    async (ctx) => {
      const {id} = deleteData.parse(
        deunionize(ctx.callbackQuery).data
      );
      if (security.checkId(ctx.update.callback_query.from.id.toString())) {
        await qb.deleteTask(id);
        await scheduller.stopAllTasks();
        await scheduller.runScheduledTasks(bot);
        await ctx.reply('Deleted');
      } else {
        await ctx.reply('Access restricted though.');
      }
    }
  );

  bot.action(
    countryData.filter({
      type: 'add_country'
    }),
    async ctx => {
      const {id} = countryData.parse(
        deunionize(ctx.callbackQuery).data
      );
      await qb.addCountry(id);
      const selectedCountry = await qb.getCountry();
      const tz = ct.getCountry(selectedCountry.iso);

      ctx.reply('Country accepted!');

      if (tz.timezones.length > 1) {
        try {
          await ctx.replyWithHTML(`<b>Select timezone:</b>`,
            Markup.inlineKeyboard([
              ...getTimezonesButtons(tz.timezones),
            ]))
        } catch (e) {
          console.error(e)
        }
      } else {
        try {
          await ctx.replyWithHTML(`<b>Select coins:</b>`,
            Markup.inlineKeyboard([
              ...await getAllCoinButtons(),
            ]))
        } catch (e) {
          console.error(e)
        }
      }
    }
  )

  bot.action(
    countryData.filter({
      type: 'heading_country'
    }), async ctx => {
      const {id} = countryData.parse(
        deunionize(ctx.callbackQuery).data
      );
      headingState.country_id = id;
      ctx.scene.enter('heading_content');
    });

  allTimezones.map(tz => {
    bot.action(tz, async ctx => {
      qb.addTimezone(ctx.match.input);
      ctx.reply('Timezone accepted!');
      try {
        await ctx.replyWithHTML(`<b>Select coins:</b>`, Markup.inlineKeyboard([
          ...await getAllCoinButtons(),
        ]))
      } catch (e) {
        console.error(e)
      }
    })
  })

  bot.action(
    coinData.filter({
      action: 'add_coin'
    }),
    async (ctx) => {
      const {id} = coinData.parse(
        deunionize(ctx.callbackQuery).data
      );
      await qb.addCoin(id);
      await ctx.reply('Coin accepted!');
      try {
        await ctx.reply('Choose the hour:', timePicker.getTimePicker('0'));
      } catch (e) {
        console.error(e)
      }
    }
  );

  bot.action('reset', async ctx => {
    await qb.reset();
    ctx.replyWithHTML(`<b>Jobs done.</b>`)
  })

  bot.action('save', async ctx => {
    await qb.save();
    await scheduller.stopAllTasks();
    await scheduller.runScheduledTasks(bot);
    ctx.replyWithHTML(`<b>Jobs done.</b>`);
  })

  timePicker.setTimePickerListener(async (context, time) => {
    await qb.addTime(time);
    await context.reply(`${await qb.getTotal()}`, Markup.inlineKeyboard([
      ...await getFinalButtons()
    ]));
  });
}

module.exports = {
  setBotActions
}
