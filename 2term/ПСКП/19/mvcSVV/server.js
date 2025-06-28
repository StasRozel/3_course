const app = require('express')();
const myrouter = new (require('./17-11m').MVCRouter)(
    '/:controller/:action',
    '/api/:controller/:action/:p',
    '/loc/lex/:controller/:m/:action'
);

const handlers = require('./17-11mc');
const mycontrollers = new (require('./17-11m')).MVCControllers({
    home: {
        home: handlers.home,
        index: handlers.home_index,
        account: handlers.home_account,
    },
    calc: {
        salary: handlers.calc_salary,
        trans: handlers.calc_trans,
    }
});

const mvc = new (require('./17-11m')).MVC(myrouter, mycontrollers);

app.get(mvc.router.uri_templates, mvc.use);

var server = app.listen(3000);
