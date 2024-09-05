// import morgan from "morgan";
// import logger from "../logger.js";

// const morganFormat = ":method :url :status :response-time ms";

// // Morgan middleware to use Winston as the stream
// const morganMiddleware = morgan(morganFormat, {
//   stream: {
//     write: (message) => {
//       logger.info(message.trim()); // Log the request info
//     },
//   },
// });

// export default morganMiddleware;

import morgan from "morgan";

// Create a custom token for the current timestamp
morgan.token("timestamp", () => {
  return new Date().toISOString(); // Returns the current timestamp in ISO format
});

// Custom Morgan format with timestamp
const morganFormat = ":timestamp :method :url :status :response-time ms";

// Morgan middleware for logging with a timestamp
const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      console.log(message.trim()); // Log to console
    },
  },
});

export default morganMiddleware;
