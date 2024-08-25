const path = require('path');
const fs = require('fs');

const BASE_DIRECTORY = path.join(__dirname, '../public');

function isSafePath(userInput) {
    const normalizedPath = path.normalize(userInput);
    let absolutePath = path.join(BASE_DIRECTORY, normalizedPath);
    

    if (!absolutePath.startsWith(BASE_DIRECTORY)) {
        throw new Error('1Access denied');
    }

    if (normalizedPath.includes('..')) {
        throw new Error('2Access denied');
    }
    if (!absolutePath.includes('.')) absolutePath = `${absolutePath}${absolutePath.split('').at(-1)=='\\'?'':'\\'}index.html`
    return absolutePath;
}


module.exports = function(req, res) {
    let _path;
    try {
        _path = isSafePath(req.path)
    } catch(err) {
        console.log(err)
        res.status(404);
        res.send();
        return;
    }
    
    if(_path.toLowerCase().includes("\\admin\\") && _path.endsWith("index.html")) {
        if (req.query.pass != process.env.PASSWORD){
            res.status(307);
            res.redirect("/");
            return;
        }
    }

    if(!fs.existsSync(_path)) {
        res.status(404);
        res.send();
        return;
    }
    

    const contentType = {
        "js": "text/javascript",
        "css": "text/css",
        "html": "text/html"
    }[_path.split('.').at(-1)];
    
    res.status(200);


    res.setHeader('content-type', contentType);
    res.send(fs.readFileSync(_path).toString());
}