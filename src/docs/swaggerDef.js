/**
 * @file swagger def
 * @summary use to provide a api definition for swagger
 */
import {version} from '../../package.json';
import config from '../config/config';

let url;
if (config.host === 'localhost') {
    url = `http://${config.host}:${config.port}/api/v1`;
} else {
    url = `https://${config.host}/api/v1`;
}
export const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'PHG API documentation',
        version,
    },
    servers: [
        {
            url: url,
        },
    ],
};

