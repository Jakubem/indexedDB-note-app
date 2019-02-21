const express = require('express');
const app = express();
const port = 5500;
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static('./public/src'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/src/index.html'));
});

app.listen(port, () => console.log(`listening on ${port}`))