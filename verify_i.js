const fetch = require("node-fetch");
const _ = require("lodash");

module.exports = async function({ config, i }){
    if(!_.isString(i)) return false;

    let url = new URL(config.upstream);
    url.pathname = "/api/i";

    console.log(url.href);

    let result = await fetch(url.href, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ i }),
    });

    return result.status == 200;
}
