// Node import
const path = require('path');

const webpack = require('webpack');

require('dotenv').config();

module.exports = [
   plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'ENV'])
  ],
]