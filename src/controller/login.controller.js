import {catchAsync} from "../utils/catchAsync";
import {pick} from "../utils/pick";

export const login = catchAsync(async (req, res) => {
    //
    const filter = pick(req.query, ["username", "eventName", "from", "to"]);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    console.log("hi")

    res.send(options);
});


export const ssoCallBack = catchAsync(async (req, res) => {
    //
    const filter = pick(req.query, ["username", "eventName", "from", "to"]);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    console.log("hi")

    res.send(options);
});
