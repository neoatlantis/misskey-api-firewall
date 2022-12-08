const express = require("express");
const app = express();
const fetch = require("node-fetch");

const get_decision = require("./decision");

const config = JSON.parse(require("fs").readFileSync("./config.json"));

app.use(express.json());
app.use(express.text());

app.post("*", async (req, res)=>{
    let path = req.path;

    let req_json = {};
    try{
        req_json = JSON.parse(req.body);
    } catch(e){
        return res.status(400).end();
    }

    if(true !== await get_decision({
        config,
        path, json: req_json,
    })){
        return res.status(401).end();
    }

    let upstream_url = new URL(config.upstream);
    upstream_url.pathname = path;

    try{
        let result = await fetch(upstream_url.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req_json),
        });

        let res_headers = result.headers;
        let res_body = new Uint8Array(await result.arrayBuffer());

        res.status(result.status);
        res_headers.forEach((value, key)=>res.set(key, value));
        res.end(res_body);
    } catch(e){
        console.log(e);
        res.status(500).end();
    }

});

app.listen(9000);
