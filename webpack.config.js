// Node import
const path = require('path');

const webpack = require('webpack');

require('dotenv').config();

module.exports = [
   plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV', 
      'ENV',
      'ENABLE_REDUX_DEV_TOOLS',
      'AUTH0_CLIENT_ID',
      'AUTH0_DOMAIN',
      'AWS_COGNITO_IDENTITY_POOL_ID',
      'AWS_COGNITO_REGION',
      'AWS_PROJECT_REGION',
      'AWS_USER_POOLS_ID',
      'AWS_USER_POOLS_WEB_CLIENT_ID',
      'FIREBASE_API_KEY',
      'FIREBASE_APP_ID',
      'FIREBASE_AUTH_DOMAIN',
      'FIREBASE_DATABASE_URL',
      'FIREBASE_MESSAGING_SENDER_ID',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_STORAGE_BUCKET',
      'GTM_ID',
  ])
  ],
]