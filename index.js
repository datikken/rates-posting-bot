require("dotenv/config");
const {Telegraf, Scenes, session} = require('telegraf');
const {setBotActions} = require("./action/index.js");
const {setBotCommands} = require("./command/index.js");
const {scheduller} = require('./controller/schedule.js');
const {countryScene} = require("./scenes/country");
const {headingScene} = require("./scenes/heading");

const bot = new Telegraf(process.env.BOT_TOKEN);
const stage = new Scenes.Stage([countryScene, headingScene], {
  ttl: 60,
});

bot.use(session());
bot.use(stage.middleware());

scheduller.runScheduledTasks(bot);

bot.launch();

setBotCommands(bot);
setBotActions(bot);

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

module.exports = {
  bot
}
