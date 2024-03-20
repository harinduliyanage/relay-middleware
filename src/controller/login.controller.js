import {catchAsync} from "../utils/catchAsync";
import {pick} from "../utils/pick";

export const login = catchAsync(async (req, res) => {
    //
    const filter = pick(req.query, ["username", "eventName", "from", "to"]);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    console.log("hi login request")
    console.log(req)

    res.send(options);
});


export const ssoCallBack = catchAsync(async (req, res) => {
    //
    const filter = pick(req.query, ["username", "eventName", "from", "to"]);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    console.log("hi sso call back")
    console.log(req)

    res.send(options);
});
