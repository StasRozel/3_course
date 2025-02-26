const express = require('express');

function staticFileHandler(rootDir) {
    const router = express.Router();
    
    router.get(`/${rootDir}/:file`, (req, res) => {
        const file = req.params.file
        res.sendFile(__dirname + '/static/' + file);
    })
    return router;
}

module.exports = staticFileHandler;