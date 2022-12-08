const express = require("express");
const app = express();
const fetch = require("node-fetch");

const get_decision = require("./decision");

const config = JSON.parse(require("fs").readFileSync("./config.json"));

app.use(express.json());

app.post("*", async (req, res)=>{
    let path = req.path;

    if(true !== await get_decision({
        config,
        path, json: req.body,
    })){
        res.status(401).end();
        return;
    }

    let upstream_url = new URL(config.upstream);
    upstream_url.pathname = path;

    try{
        let result = await fetch(upstream_url.href, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        let result_json = await result.json();
        res.status(result.status).json(result_json).end();
    } catch(e){
        console.log(e);
        res.status(500).end();
    }

});

app.listen(9000);
