module.exports = {
  assertEx : (condition, message) => {
      if(!condition) throw new Error(message);
  }
};