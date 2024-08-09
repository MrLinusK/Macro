const express = require('express');
const router = express.Router()
const cors = require('cors');
const path = require('path');
require('dotenv').config()


const port = process.env.PORT;
const pass = process.env.PASSWORD;
const discord = process.env.DISCORD;
const app = express();

app.use(cors());

const publicPath = path.join(__dirname, './../public')
const userDataPath = path.join(__dirname, './../data', 'userData.json')
const json = require(userDataPath);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/adminpanel', (req, res) => {
    if (req.query.pass == pass){
        res.sendFile(path.join(publicPath, 'adminPanel/index.html'));
    }
    else{
        res.sendFile(path.join(publicPath, 'index.html'))
    }
});

app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(publicPath, 'adminPanel/styles.css'));
});

app.get('/index.js', (req, res) => {
    res.sendFile(path.join(publicPath, 'adminPanel/index.js'));
});

app.get('/userData.json', (req, res) => {
    if (req.query.pass == pass){
        res.sendFile(userDataPath);
    }
});

app.get('/getMacros', (req, res) =>{
    const Macros = Object.keys(json.Macros);

    res.json({Macros:Macros});
    return;
})

app.get('/getUUIDs', (req, res) =>{
    const uuid = json.Macros[req.headers.macro].uuid;
    if (req.query.pass != pass){
        res.status(200);
        res.json({uuid:{"Wrong Passowrd :)":"suck a dick bitch"}})
        return;
    }
    
    res.status(200);
    res.json({uuid:uuid});
    return;
})

app.get('/writeToJSON', (req, res) =>{
    const macro = req.headers.macro
    const uuid = req.headers.uuid
    const name = req.headers.name

    if (req.query.pass != pass){
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


    if (req.query.pass != pass){
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

// Slumber hotel ticket macro
app.get('/chechAuth', (req, res) => {
    let [uuid, macro, allowed] = '';
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
        msg: discord
    });
    return;
});

app.listen(port);