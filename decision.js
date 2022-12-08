const _ = require("lodash");
const verify_i = require("./verify_i");

const WHITELIST = [
    "/api/meta",
    "/api/i",
    "/api/users/show",
    "/api/signin",
];

const BLACKLIST = [
    "/api/stats",
    "/api/active-users",
]

module.exports = async function({ config, path, json, method="POST" }){
    if(_.includes(BLACKLIST, path.toLowerCase().trim())){
        return false;
    }

    if(method == "GET") return true;

    if(_.includes(WHITELIST, path.toLowerCase().trim())){
        return true;
    }

    let i = _.get(json, "i");

    return await verify_i({config, i});

}
