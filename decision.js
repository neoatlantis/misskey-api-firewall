const _ = require("lodash");
const verify_i = require("./verify_i");

const NO_AUTH = [
    "/api/meta",
    "/api/i",
    "/api/signin",
];

module.exports = async function({ config, path, json }){
    if(_.includes(NO_AUTH, path.toLowerCase().trim())){
        return true;
    }

    let i = _.get(json, "i");

    return await verify_i({config, i});

}
