import {catchAsync} from "../utils/catchAsync";
import {pick} from "../utils/pick";
import axios from "axios";

export const login = catchAsync(async (req, res) => {
    const {client_id, tab_id, session_code} = pick(req.query, ["client_id", "tab_id", "session_code"]);

    //
    const config = {
        headers: req.headers
    };

    const response = await axios
        .get(`http://keycloak:8080/realms/phg/broker/PreferredNet/login?client_id=${client_id}&tab_id=${tab_id}&session_code=${session_code}`,
            config);

    const locationHeader = response.headers['location'];
    console.log('Location Header:', locationHeader);
    res.send(locationHeader);
});


export const ssoCallBack = catchAsync(async (req, res) => {
    //
    const filter = pick(req.query, ["username", "eventName", "from", "to"]);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    console.log("hi sso call back")
    console.log(req)

    res.send(options);
});
