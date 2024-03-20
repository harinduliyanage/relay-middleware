/**
 * @file docs route
 * @summary express router for swagger ui API documentations
 */
import {Router} from 'express';
import * as swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import * as definition from '../../docs/swaggerDef';

const router = Router();

const specs = swaggerJsdoc({
    swaggerDefinition: definition.swaggerDef,
  apis: ['src/docs/*.yml','src/docs/v1/*.yml'],
});

router.use('/', swaggerUi.serve);
router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

export default router;
