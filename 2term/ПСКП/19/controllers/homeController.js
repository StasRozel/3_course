const path = require('path');

const getHome = (req, res) => {
  res.send('Welcome to the Home!');
};

const postHome = (req, res) => {
  const { name } = req.body;
  res.send(`Hello, ${name}!`);
};

const getAbout = (req, res) => {
  res.sendFile(path.join(__dirname, '../views/about.html'));
};

module.exports = {
  getHome,
  postHome,
  getAbout,
};