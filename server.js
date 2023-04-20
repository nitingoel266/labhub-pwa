const path = require('path');
const express = require('express');
const app = express();

const PORT  = 3000;

app.use(express.static(path.join(process.cwd(), 'build')));

app.use('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
