const {Scenes} = require("telegraf");
const {headingState} = require('../state/heading');
const {headingController} = require("../controller/heading");

const headingScene = new Scenes.BaseScene('heading_content');

headingScene.enter(async (ctx) => {
  ctx.reply('Send a heading please');
});

headingScene.on('message', async (ctx) => {
  if(ctx.message.text.startsWith('/')) {
    ctx.reply('Heading can not be started with /');
    ctx.scene.leave();
    return;
  }
  headingState.content = ctx.message.text;
  headingController.createOrUpdateHeading();
  ctx.reply('Heading accepted');
  ctx.scene.leave();
})

headingScene.leave((ctx) => ctx.reply('Bye'));

module.exports = {
  headingScene
};
