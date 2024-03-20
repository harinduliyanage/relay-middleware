import {catchAsync} from "../utils/catchAsync";
import {pick} from "../utils/pick";
import axios from "axios";

let state = "";

export const login = catchAsync(async (req, res) => {
    const {client_id, tab_id, session_code} = pick(req.query, ["client_id", "tab_id", "session_code"]);
    //
    const config = {
        headers: req.headers,
        maxRedirects: 0,
        validateStatus: status => {
            return status === 200 || status === 302 || status === 301;
        }
    };

    const response = await axios
        .get(`http://keycloak:8080/realms/phg/broker/PreferredNet/login?client_id=${client_id}&tab_id=${tab_id}&session_code=${session_code}`,
            config);

    const locationHeader = response.headers['location'];
    if (locationHeader) {
        const urlParams = new URLSearchParams(locationHeader.substring(locationHeader.indexOf('?') + 1));
        state = urlParams.get('RelayState');
    }
    console.log('current state:', state);
    res.redirect(301, locationHeader);
});


export const ssoCallBack = catchAsync(async (req, res) => {
    //
    console.log('req', req)
    const {SAMLResponse} = req.body;
    // Prepare form data payload for Axios request to Keycloak
    const formData = new URLSearchParams();
    formData.append('SAMLResponse', SAMLResponse);
    formData.append('RelayState', state);

    console.log('formData ', formData)
    try {
        const response = await axios.post('http://keycloak:8080/realms/phg/broker/PreferredNet/endpoint', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                ...req.headers
            }
        });

        // Forward Keycloak response to client
        res.status(response.status).send(response.data);
    } catch (e) {
        console.log('error', e);
        console.log('error data', e?.data);
        res.status(500).send("Something went wrong");
    }

});
