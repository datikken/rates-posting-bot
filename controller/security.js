class Security {
  allowedManagers = ['1164935460', '34905662'];

  checkId(id)
  {
    return this.allowedManagers.includes(id);
  }
}

const security = new Security();

module.exports = {
  security
}
