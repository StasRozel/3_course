const express = require('express');
const app = express();
app.use(express.json());

app.post('/jsonrpc', (req, res) => {
    console.log(req.body);
    const { jsonrpc, method, params, id } = req.body;

    // Валидация JSON-RPC 2.0 запроса
    if (jsonrpc !== '2.0') {
        return res.json({
            jsonrpc: '2.0',
            error: { code: -32600, message: 'Invalid Request' },
            id: null
        });
    }

    if (typeof method !== 'string' || id === undefined) {
        return res.json({
            jsonrpc: '2.0',
            error: { code: -32600, message: 'Invalid Request' },
            id: id || null
        });
    }

    if (!Array.isArray(params)) {
        return res.json({
            jsonrpc: '2.0',
            error: { code: -32602, message: 'Invalid params' },
            id
        });
    }

    try {
        let result;
        switch (method) {
            case 'sum':
                validateNumbers(params, { minLength: 1 });
                result = params.reduce((acc, num) => acc + num, 0);
                break;
            case 'mul':
                validateNumbers(params, { minLength: 1 });
                result = params.reduce((acc, num) => acc * num, 1);
                break;
            case 'div':
                validateNumbers(params, { exactLength: 2 });
                if (params[1] === 0) throw { code: -32602, message: 'Division by zero' };
                result = params[0] / params[1];
                break;
            case 'proc':
                validateNumbers(params, { exactLength: 2 });
                if (params[1] === 0) throw { code: -32602, message: 'Division by zero in proc' };
                result = (params[0] / params[1]) * 100;
                break;
            default:
                return res.json({
                    jsonrpc: '2.0',
                    error: { code: -32601, message: 'Method not found' },
                    id
                });
        }
        res.json({ jsonrpc: '2.0', result, id });
    } catch (error) {
        const errorResponse = {
            jsonrpc: '2.0',
            id,
            error: error.code ? { code: error.code, message: error.message } : { code: -32603, message: error.message }
        };
        res.json(errorResponse);
    }
});

function validateNumbers(params, { minLength, exactLength }) {
    if (exactLength !== undefined && params.length !== exactLength) {
        throw { code: -32602, message: `Exactly ${exactLength} parameters required` };
    }
    if (minLength !== undefined && params.length < minLength) {
        throw { code: -32602, message: `At least ${minLength} parameter(s) required` };
    }
    if (!params.every(num => typeof num === 'number')) {
        throw { code: -32602, message: 'All parameters must be numbers' };
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));