const {Markup} = require("telegraf");
const {getAllCountryButtons, getAllTasksButtons} = require("../database/button.js");
const {cmmnds} = require("../config/commands.js");
const {security} = require("../controller/security.js");

const setBotCommands = (bot) => {
  bot.command('add_heading', (ctx) => {
    ctx.scene.leave();
    ctx.scene.enter('heading_country');
  });

  bot.start((ctx) => ctx.replyWithHTML(`
    Welcome!\n<em>Here what you can do:</em>
    ${cmmnds.map(el => `<pre>${el}</pre>\n`).join('')}
  `));

  bot.command('create_task', async ctx => {
    ctx.scene.leave();
    if(!security.checkId(
      ctx.message.chat.id.toString())
    ) return;
    try {
      await ctx.replyWithHTML(`<b>Select country:</b>`, Markup.inlineKeyboard([
        ... await getAllCountryButtons('add_country'),
      ]))
    } catch (e) {
      console.error(e)
    }
  })

  bot.command('get_tasks', async ctx => {
    if(!security.checkId(
      ctx.message.chat.id.toString())
    ) return;
    try {
      await ctx.replyWithHTML(`<b>Existing tasks:</b>`, Markup.inlineKeyboard([
        ... await getAllTasksButtons(),
      ]))
    } catch (e) {
      console.error(e)
    }
  })

  bot.command('health', async ctx => {
    try {
      await ctx.reply(`🥴`)
    } catch (e) {
      console.error(e)
    }
  })
}

module.exports = {
  setBotCommands
}
