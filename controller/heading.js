const {Heading} = require("../models");
const {headingState} = require("../state/heading");

class HeadingController {
  async createOrUpdateHeading() {
    const heading = await Heading.findOne({
      where: {
        country_id: headingState.country_id,
      }
    })
    if (heading) {
      await Heading.update({content: headingState.content},
        {
          where: {
            country_id: headingState.country_id,
          }
        });
    } else {
      await Heading.create({
        content: headingState.content,
        country_id: headingState.country_id,
      })
    }
  }
}

const headingController = new HeadingController();

module.exports = {
  headingController
}
