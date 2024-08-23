const express = require('express');
const cors = require('cors');
require('dotenv').config();

const homeRoutes = require('./website.js');
const userDataPath = './../data/userData.json';
const app = express();
const PASS = process.env.PASSWORD;

app.use(cors());

app.get('/getMacros', (req, res) =>{
    const json = require(userDataPath);
    const Macros = Object.keys(json.Macros);

    res.json({Macros:Macros});
});

app.get('/getUUIDs', (req, res) =>{
    const json = require(userDataPath);

    const uuid = json.Macros[req.headers.macro].uuid;
    if (req.query.pass != PASS){
        res.status(200);
        res.json({uuid:{"Wrong Passowrd :)":"L ratio"}})
        return;
    }
    
    res.status(200);
    res.json({uuid:uuid});
    return;
});

app.get('/userData.json', (req, res) => {
    if (req.query.pass == PASS){
        res.sendFile(userDataPath);
    }
});

app.get('/writeToJSON', (req, res) =>{
    const macro = req.headers.macro
    const uuid = req.headers.uuid
    const name = req.headers.name

    if (req.query.pass != PASS){
        res.status(200);
        res.json({uuid:{"Wrong Passowrd :)":"suck a dick bitch"}});
        return;
    }
    else if (uuid.length == 36 && uuid.split("-").length == 5){
        res.status(200)
    }
    else{
        res.status(200)
        res.json({reason:"Wrong UUID structure"});
        return;
    }

    if (JSON.stringify(json.Macros[macro].uuid).includes(uuid)){
        res.json({
            reason:`${macro} Already has UUID: ${uuid}`
        });
        return;
    }

    const json = require(userDataPath);
    json.Macros[macro].uuid[uuid] = name;

    const fs = require('fs');
    fs.writeFile(userDataPath , JSON.stringify(json, null, 4), (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.warn(`${uuid} removed from ${macro}`);
        }
    })
    res.json({
        reason:`UUID: ${uuid} added to ${macro}`
    });
});

app.get('/removeToJSON', (req, res) =>{
    const macro = req.headers.macro
    const uuid = req.headers.uuid

    if (req.query.pass != PASS){
        res.status(200);
        res.json({reason:"Wrong Password"});
        return;
    }
    else if (uuid.length == 36 && uuid.split("-").length == 5){
        res.status(200)
    }
    else{
        res.status(200)
        res.json({reason:"Wrong UUID structure"});
        return;
    }

    const json = require(userDataPath);
    delete json.Macros[macro].uuid[uuid]

    const fs = require('fs');
    fs.writeFile(userDataPath, JSON.stringify(json, null, 4), (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.warn(`${uuid} removed from ${macro}`);
        }
    })
    res.json({
        reason:`UUID: ${uuid} removed from ${macro}`
    });
});

function checkUUIDauth(macro, uuid){
    //Check if valid uuid
    if (uuid.length != 36 || uuid.split("-").length != 5){
        return false;
    }
    let data = require(__dirname + '/userData.json');

    //Check if macro exsists
    let pass = false;
    for (const real_macro in data.Macros){
        if (real_macro == macro){
            pass = true;
            break;
        }
    }
    if (!pass){
        return false;
    }

    //Check if uuid in macro
    if(JSON.stringify(Object.keys(data.Macros[macro].uuid)).includes(uuid)) {
        return true;
    }
    return false;
}

app.get('/chechAuth', (req, res) => {
    let [allowed] = '';
    try{
        uuid = req.headers.uuid;
        macro = req.headers.macro;
        allowed = checkUUIDauth(macro, uuid);
    }
    catch{
        console.warn('Invalid Headers')
        allowed = false;
    }

    if (allowed){
        res.status(200);
        res.json({
            status: true,
            msg: 'Success'
        });
        return;
    }
    res.status(200);
    res.json({
        status: false,
        msg: process.env.DISCORD
    });
    return;
});

app.get('/*', homeRoutes);

app.listen(process.env.PORT);