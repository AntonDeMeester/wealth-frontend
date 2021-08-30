import defaultConfig from "./default";

const overrideConfig = require(`./${process.env.REACT_APP_ENV}`).default;

const combinedConfig = { ...defaultConfig, ...overrideConfig };

export default combinedConfig;
