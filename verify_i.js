const fetch = require("node-fetch");
const _ = require("lodash");

const cache = new Map();

function clear(){
    const now = new Date().getTime();
    const deadline = now - 30000;
    let delkeys = [];
    cache.forEach((cached_time, key)=>{
        if(cached_time < deadline){
            delkeys.push(key);
        }
    });
    delkeys.forEach((key)=>cache.delete(key));
}
setInterval(clear, 15000);


module.exports = async function({ config, i }){
    const now = new Date().getTime();
    if(!_.isString(i)) return false;

    if(cache.has(i)){
        return true;
    }

    let url = new URL(config.upstream);
    url.pathname = "/api/i";

    let result = await fetch(url.href, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ i }),
    });

    let ret = (result.status == 200);
    if(ret){
        cache.set(i, now);
    }
    return ret;
}
