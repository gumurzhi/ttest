module.exports = {
  assertEx : (condition, message, code) => {
      if(!condition) throw {code: code || 500, message};
  }
};