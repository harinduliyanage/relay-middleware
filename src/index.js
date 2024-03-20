/**
 * @file index
 * @summary application entry point
 */
import config from './config/config';
import logger from './config/logger';
import app from './app';
//

let server;

server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
    let url;
    if (config.host === 'localhost') {
        url = `http://${config.host}:${config.port}/api/v1/docs`;
    } else {
        url = `https://${config.host}/api/v1/docs`;
    }
    logger.info(`Run on ${url}`);
});


const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
