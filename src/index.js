// Libaries
const express = require('express');
const cors = require('cors');

// Loading Libaries
const homeRoutes = require('./website.js');
const path = require('path');
const app = express();
require('dotenv').config();
app.use(cors());

// Creating important Vars
const userDataPath = path.resolve('./data/userData.json');
const PASS = process.env.PASSWORD;

function logSend(res, inp, lvl){
    res.json({reason:inp})
    if(lvl == 0){
        return;
    }
    if(lvl == 1){
        console.log(inp);
    }
    if(lvl == 2){
        console.warn(inp);
    }
    if(lvl == 3){
        console.error(inp);
    }

}

//For GUI
app.get('/getMacros', (req, res) =>{
    const json = require(userDataPath);
    const Macros = Object.keys(json);

    res.json({Macros:Macros});
});

//For GUI
app.get('/getUUIDs', (req, res) =>{
    const json = require(userDataPath);

    const uuid = json[req.headers.macro].uuid;
    if (req.query.pass != PASS){
        res.status(200);
        res.json({uuid:{"Wrong Passowrd :)":"L ratio"}})
        return;
    }
    
    res.status(200);
    res.json({uuid:uuid});
    return;
});

//Validating data
function validate(pass, uuid, macro, res){
    // 401 Unauth, 422 Unprocessable entity
    // Check password
    
    if (pass != PASS){
        res.json({reason:`Wrong Password`});
        res.status(401);
        return;
    }
    
    // Check UUID
    if (uuid.length != 36 || uuid.split("-").length != 5){
        res.json({reason:`Invalid UUID`});
        res.status(422);
        return;
    }

    // Check if macro is valid
    const json = require(userDataPath);
    if (!JSON.stringify(json).includes(macro)){
        res.json({reason:`Invalid macro`});
        res.status(422);
        return;
    }
}

//For editing Json
app.get('/writeToJSON', (req, res) =>{
    const pass = req.query.pass;
    const uuid = req.headers.uuid;
    const macro = req.headers.macro;
    const name = req.headers.name;
    
    //modifies res
    validate(pass, uuid, macro, res)
    if (res.statusCode != 200){
        return;
    }

    // Create a modified dataset
    const json = require(userDataPath);

    if (JSON.stringify(json[macro].uuid).includes(uuid)){
        logSend(res, `${name} Already Added`, 2);
        return;
    }


    json[macro].uuid[uuid] = name;

    // write to (path, formating, print err/result)
    const fs = require('fs');
    
    fs.writeFile(userDataPath , JSON.stringify(json, null, 4), (err) => {
        if (err) {
            logSend(res, `Error writing JSON file: ${err}`, 3);
        } else {
            logSend(res, `Name: ${name} \nUUID: ${uuid} \nAdded to ${macro}.\n`, 2);
        }
    });
});

//For editing Json
app.get('/removeToJSON', (req, res) =>{
    const pass = req.query.pass;
    const uuid = req.headers.uuid;
    const macro = req.headers.macro;
    const name = req.headers.name;

    //modifies res
    validate(pass, uuid, macro, res)
    if (res.statusCode != 200){
        return;
    }

    
    // Create a modified dataset
    const json = require(userDataPath);

    if (!JSON.stringify(json[macro].uuid).includes(uuid)){
        logSend(res, `${name} Already Removed`, 2);
        return;
    }

    delete json[macro].uuid[uuid]

    // write to (path, formating, print err/result)
    const fs = require('fs');
    fs.writeFile(userDataPath, JSON.stringify(json, null, 4), (err) => {
        if (err) {
            logSend(res, `Error writing JSON file: ${err}`, 3);
        } else {
            logSend(res, `Name: ${name} \nUUID: ${uuid} \nRemoved from ${macro}.\n`, 2);
        }
    });
});

//For editing Json
app.get('/chechAuth', (req, res) => {
    //Modifies Res
    const uuid = req.headers.uuid;
    const macro = req.headers.macro;

    req.headers.pass = PASS;
    validate(PASS, uuid, macro, res)
    if (res.statusCode != 200){
        return;
    }
    
    //Check if UUID in macro
    const json = require(userDataPath);
    

    if (res.statusCode != 200 || !JSON.stringify(json[macro].uuid).includes(uuid)){
        res.json({"status": false, "msg": process.env.DISCORD});
        res.status(401);
        return;
    }

    res.json({"status": true, "msg": process.env.DISCORD});
});


app.get('/*', homeRoutes);

PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log("Listening at port: " +PORT)
});