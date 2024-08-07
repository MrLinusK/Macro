const express = require('express');

const app = express();

const discord = 'https://discord.gg/EcTmMB7Scz';

// Slumber hotel ticket macro
const sht_macro_ids = [
    '0d9c0578-07bc-4094-9971-9ee5b825da16',
    '89c34eb6-5164-481d-8cba-31d7b11f21ed'
];

app.get('/sht-ticket-macro', (req, res) => {
    if(sht_macro_ids.includes(req.query.uuid)) {
        res.status(200);
        res.json({
            status: true,
            msg: 'Success'
        });
        return;
    }

    res.status(403);
    res.json({
        status: false,
        msg: discord
    });
    return;
});

app.listen(4200);