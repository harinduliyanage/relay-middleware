import { catchAsync } from "../utils/catchAsync";
import { pick } from "../utils/pick";
import axios from "axios";
import { appendingRequestId, decodeAuthRequestId } from "../utils/saml-parser";

let state = "";
let requestId = "";

export const login = catchAsync(async (req, res) => {
  const { client_id, tab_id, session_code } = pick(req.query, [
    "client_id",
    "tab_id",
    "session_code",
  ]);
  //
  const config = {
    headers: req.headers,
    maxRedirects: 0,
    validateStatus: (status) => {
      return status === 200 || status === 302 || status === 301;
    },
  };

  const response = await axios.get(
    `http://keycloak:8080/realms/phg/broker/PreferredNet/login?client_id=${client_id}&tab_id=${tab_id}&session_code=${session_code}`,
    config
  );

  const locationHeader = response.headers["location"];
  if (locationHeader) {
    const urlParams = new URLSearchParams(
      locationHeader.substring(locationHeader.indexOf("?") + 1)
    );
    state = urlParams.get("RelayState");
    const authRequest = urlParams.get("SAMLRequest");
    requestId = await decodeAuthRequestId(authRequest);
  }
  console.log("current state:", state);
  console.log("current auth request id:", requestId);
  res.redirect(301, locationHeader);
});

export const ssoCallBack = catchAsync(async (req, res) => {
  //
  //   console.log("req - h", req.headers);
  //   console.log("req", req.body);
  const { SAMLResponse } = req.body;

  const amendedRes = await appendingRequestId(atob(SAMLResponse), requestId);
  //   console.log("amendedRes", amendedRes);
  //   console.log("amendedRes encoded", btoa(amendedRes));

  // Prepare form data payload for Axios request to Keycloak
  const formData = new URLSearchParams();
  formData.append("SAMLResponse", btoa(amendedRes));
  formData.append("RelayState", state);
  //
  const config = {
    headers: req.headers,
    maxRedirects: 0,
    validateStatus: (status) => {
      return status === 200 || status === 302 || status === 301;
    },
  };
  //   console.log("formData ", formData);
  try {
    const response = await axios.post(
      "http://keycloak:8080/realms/phg/broker/PreferredNet/endpoint",
      formData,
      config
    );
    console.log("==============");
    console.log(response.headers);
    console.log(response.headers.location);
    // console.log("response headers", response.headers);
    // console.log("response data", response.data);
    // Forward Keycloak response to client
    res.headers = response.headers;
    res.redirect(302, response.headers.location);
    // res.status(response.status).send(response?.data);
  } catch (e) {
    console.log("error", e);
    if (e?.response?.headers) {
      res.headers = e.response.headers;
    }
    res.redirect(301, response.response.headers["location"]);
    // res.redirect(e?.response.status).send(e.response.data);
  }
});
