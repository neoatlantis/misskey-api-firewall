const express = require("express");
const app = express();
const fetch = require("node-fetch");
const _ = require("lodash");

const get_decision = require("./decision");

const config = JSON.parse(require("fs").readFileSync("./config.json"));

function get_upstream_url(base, url){
    if(!_.endsWith(base, "/")) base += "/";
    return base + url.slice(1);
}


app.use(express.json());
app.use(express.text());

app.get("*", async (req, res)=>{
    if(true !== await get_decision({ config, req.path, method: "GET" })){
        return res.status(401).end();
    }

    let upstream_url = get_upstream_url(config.upstream, req.originalUrl);

    try{
        let result = await fetch(upstream_url, {
            method: "GET",
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

    let upstream_url = get_upstream_url(config.upstream, path);

    try{
        let result = await fetch(upstream_url, {
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
