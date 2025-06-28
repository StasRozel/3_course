const path = require('path');
exports.home = (req, res) => {
    console.log('/home');
    res.sendFile(path.join(__dirname, '../views/home.html'));
}

exports.home_index = (req, res) => {
    console.log('home/index');
    res.send('home/index');
};

exports.home_account = (req, res) => {
    console.log('home/account');
    res.send('home/account');
};

exports.calc_salary = (req, res) => {
    console.log('calc/salary');
    res.send('calc/salary');
};

exports.calc_trans = (req, res) => {
    console.log('calc/trans');
    res.send('calc/trans');
};
