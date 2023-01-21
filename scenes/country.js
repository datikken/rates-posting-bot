const {Scenes, Markup} = require("telegraf");
const {getAllCountryButtons} = require("../database/button");

const countryScene = new Scenes.BaseScene('heading_country');

countryScene.enter(async (ctx) => {
  await ctx.replyWithHTML(`<b>Select country:</b>`, Markup.inlineKeyboard([
    ... await getAllCountryButtons('heading_country')
    ]));
});

module.exports = {
  countryScene
};
