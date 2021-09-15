// Node import
const path = require('path');

const webpack = require('webpack');

require('dotenv').config();

module.exports = [
   plugins: [
    new webpack.EnvironmentPlugin([
      'NODE_ENV', 
      'ENV',
      'REACT_APP_ENABLE_REDUX_DEV_TOOLS',
      'REACT_APP_AUTH0_CLIENT_ID',
      'REACT_APP_AUTH0_DOMAIN',
      'REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID',
      'REACT_APP_AWS_COGNITO_REGION',
      'REACT_APP_AWS_PROJECT_REGION',
      'REACT_APP_AWS_USER_POOLS_ID',
      'REACT_APP_AWS_USER_POOLS_WEB_CLIENT_ID',
      'REACT_APP_FIREBASE_API_KEY',
      'REACT_APP_FIREBASE_APP_ID',
      'REACT_APP_FIREBASE_AUTH_DOMAIN',
      'REACT_APP_FIREBASE_DATABASE_URL',
      'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
      'REACT_APP_FIREBASE_PROJECT_ID',
      'REACT_APP_FIREBASE_STORAGE_BUCKET',
      'REACT_APP_GTM_ID',
  ])
  ],
]