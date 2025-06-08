const express = require('express');
require('./container');
const userRoutes = require('./routes');

const PORT = process.env.PORT || '14000';

const app = express();

app.use(userRoutes());

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});