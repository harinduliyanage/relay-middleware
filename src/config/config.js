/**
 * @file config
 * @summary application config file
 */
import * as dotenv from "dotenv";
import * as path from "path";
import * as Joi from "joi";

dotenv.config({ path: path.join(__dirname, "../../.env") });

process.env.ROOT_PATH = path.join(__dirname, "../../");

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "qa", "staging", "test")
      .required(),
    PORT: Joi.number().default(3001),
    HOST: Joi.string().required().description("Host address")
  })
  .unknown();

// requestValidator provided env with env schema
const { value: envVars, error } = envVarsSchema
  .prefs({
    errors: { label: "key" },
  })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: envVars.NODE_ENV,
  host: envVars.HOST,
  port: envVars.PORT
};
