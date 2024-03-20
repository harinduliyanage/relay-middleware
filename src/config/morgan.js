/**
 * @file morgan
 * @summary use to log request details
 */
import * as morgan from 'morgan';
import logger from './logger';

morgan.token('message', (req, res) => res.locals.errorMessage || '');
morgan.token('remote-addr', (req) => req.headers['x-forwarded-for'] || req?.connection?.remoteAddress);

const getIpFormat = () => ':remote-addr - ';
const successResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms`;
const errorResponseFormat = `${getIpFormat()}:method :url :status - :response-time ms - message: :message`;

export const successHandler = morgan(successResponseFormat, {
  skip: (req, res) => res.statusCode >= 400,
  stream: { write: (message) => logger.info(message.trim()) },
});

export const errorHandler = morgan(errorResponseFormat, {
  skip: (req, res) => res.statusCode < 400,
  stream: { write: (message) => logger.error(message.trim()) },
});

