/**
 * @file index
 * @summary combined express routers for code abstraction
 */
import { Router } from 'express';
import docsRoute from './docs.route';
import globalRoute from './global.route';

const router = Router();
//
const defaultRoutes = [
    {
        path: '/',
        route: globalRoute,
    },
];
//
const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docsRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

devRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
//
export default router;
