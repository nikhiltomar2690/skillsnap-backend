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
import logger from "../logger.js";

const morganFormat = ":method :url :status :response-time ms";

// Morgan middleware to use Winston as the stream
const morganMiddleware = morgan(morganFormat, {
  stream: {
    write: (message) => {
      logger.info(message.trim()); // Log the request info
    },
  },
});

export default morganMiddleware;
