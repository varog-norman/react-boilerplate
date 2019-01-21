const production = process.env.NODE_ENV === "production"

module.exports = production
  ? require("./webpack.prod")
  : require("./webpack.dev")
