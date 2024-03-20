/**
 * @file app
 * @summary node express app
 */
import * as express from "express";
//
import routes from "./routes/v1";
import helmet from "helmet";
import * as xss from "xss-clean";
import * as compression from "compression";
import * as cors from "cors";
import * as httpStatus from "http-status";
import config from "./config/config";
import * as morgan from "./config/morgan";
import ApiError from "./utils/ApiError";
import { errorConverter, errorHandler } from "./middlewares/controller-advisor";
import * as loginController from "./controller/login.controller";


const app = express();
// set security HTTP headers
if (config.NODE_ENV === "production") {
  app.use(helmet());
}
//
app.use(morgan.successHandler);
app.use(morgan.errorHandler);
// parse json request body
app.use(express.json({ limit: "50mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());


app.set("trust proxy", true);

// v1 api routes
app.use("/api/v1", routes);
app.get("/realms/phg/broker/PreferredNet/login", loginController.login)
app.post("/realms/phg/broker/PreferredNet/endpoint", loginController.ssoCallBack)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);


export default app;
