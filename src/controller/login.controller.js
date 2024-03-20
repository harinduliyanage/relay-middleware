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
    console.log('Location Header:', locationHeader);
    console.log('res headers:', response.headers);
    res.redirect(301, locationHeader);
});


export const ssoCallBack = catchAsync(async (req, res) => {
    //
    console.log("hi sso call back")
    console.log(req)
    console.log(req.body)

    res.send({});
});
