import { catchAsync } from "../utils/catchAsync";
import { pick } from "../utils/pick";
import axios from "axios";
import { appendingRequestId, decodeAuthRequestId } from "../utils/saml-parser";

let state = "";
let requestId = "";

// Login route handler
export const login = catchAsync(async (req, res) => {
  // Extract required parameters from the request query
  const { client_id, tab_id, session_code } = pick(req.query, [
    "client_id",
    "tab_id",
    "session_code",
  ]);

  // Configure axios request
  const config = {
    headers: req.headers,
    maxRedirects: 0,
    validateStatus: (status) => {
      return status === 200 || status === 302 || status === 301;
    },
  };

  // Perform GET request to Keycloak login endpoint
  const response = await axios.get(
    `http://keycloak:8080/realms/phg/broker/PreferredNet/login?client_id=${client_id}&tab_id=${tab_id}&session_code=${session_code}`,
    config
  );

  // Extract required data from response headers
  const locationHeader = response.headers["location"];
  if (locationHeader) {
    const urlParams = new URLSearchParams(
      locationHeader.substring(locationHeader.indexOf("?") + 1)
    );
    state = urlParams.get("RelayState");
    const authRequest = urlParams.get("SAMLRequest");
    requestId = await decodeAuthRequestId(authRequest);
  }

  // Redirect to the obtained location
  res.redirect(301, locationHeader);
});

// Single Sign-On callback route handler
export const ssoCallBack = catchAsync(async (req, res) => {
  // Extract SAMLResponse from the request body
  const { SAMLResponse } = req.body;

  // Append request ID to SAMLResponse
  const amendedRes = await appendingRequestId(atob(SAMLResponse), requestId);

  // Prepare form data payload for Axios request to Keycloak endpoint
  const formData = new URLSearchParams();
  formData.append("SAMLResponse", btoa(amendedRes));
  formData.append("RelayState", state);

  // Configure axios request
  const config = {
    headers: req.headers,
    maxRedirects: 0,
    validateStatus: (status) => {
      return status === 200 || status === 302 || status === 301;
    },
  };

  try {
    // Perform POST request to Keycloak endpoint
    const response = await axios.post(
      "http://keycloak:8080/realms/phg/broker/PreferredNet/endpoint",
      formData,
      config
    );

    // Set response headers and redirect
    res.headers = response.headers;
    res.redirect(302, response.headers.location);
  } catch (error) {
    // If an error occurs, handle it and redirect accordingly
    if (error?.response?.headers) {
      res.headers = error.response.headers;
    }
    res.redirect(302, res.headers.location);
  }
});
