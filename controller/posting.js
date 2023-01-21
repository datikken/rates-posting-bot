const {getPreparedPost} = require("../util/index.js");
const {qb} = require('../database/qb.js');

const postTasksToChannel = async (tasksArr, bot) => {
  const message = await getPreparedPost(tasksArr);

  if(!message) return;

  if(process.env.ENV === 'production') {
    const channel = await qb.getChannelByCountry(tasksArr[0].country_id);
    bot.telegram.sendMessage(channel.chat_id, message, {
      parse_mode: "HTML"
    });
  } else {
    bot.telegram.sendMessage('-1001628239642', message, {
      parse_mode: "HTML"
    });
  }
};

module.exports = {
  postTasksToChannel
}
