const express = require('express');
const cors = require('cors');

const pass = '0605040';
const app = express();

app.use(cors());

const discord = 'https://discord.gg/EcTmMB7Scz';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/adminpanel', (req, res) => {
    if (req.query.pass == pass){
        res.sendFile(__dirname + '/adminPanel/index.html');
    }
    else{
        res.sendFile(__dirname + '/index.html')
    }
});

app.get('/styles.css', (req, res) => {
    res.sendFile(__dirname + '/adminPanel/styles.css');
});

app.get('/index.js', (req, res) => {
    res.sendFile(__dirname + '/adminPanel/index.js');
});

app.get('/userData.json', (req, res) => {
    if (req.query.pass == pass){
        res.sendFile(__dirname + '/userData.json');
    }
});

app.get('/getMacros', (req, res) =>{
    const json = require(__dirname + '/userData.json');
    const Macros = Object.keys(json.Macros);

    res.json({Macros:Macros});
    return;
})

app.get('/getUUIDs', (req, res) =>{
    const json = require(__dirname + '/userData.json');
    const uuid = json.Macros[req.headers.macro].uuid;
    
    console.warn(uuid)

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

    let data = require(__dirname + '/userData.json');

    if (JSON.stringify(data.Macros[macro].uuid).includes(uuid)){
        res.json({
            reason:`${macro} Already has UUID: ${uuid}`
        });
        return;
    }
    data.Macros[macro].uuid[uuid] = name;

    const fs = require('fs');
    fs.writeFile(__dirname + '/userData.json', JSON.stringify(data, null, 4), (err) => {
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

    let data = require(__dirname + '/userData.json');
    delete data.Macros[macro].uuid[uuid]

    const fs = require('fs');
    fs.writeFile(__dirname + '/userData.json', JSON.stringify(data, null, 4), (err) => {
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

app.listen(4200);