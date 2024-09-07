const express = require('express');
const app = express();
const db = require('./config/db');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const apiRoutes = require('./routes/apiRoutes');
const notFound = require('./middleware/not-found');

// 設置模板引擎
app.set('view engine', 'ejs');

app.use(express.static('public'));

// 轉化JSON資料
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/', routes);
app.use('/api/v1/', apiRoutes);
app.use(notFound);

const port = 3000;
const start = async () => {
    try {
        await db.getConnection();
        console.log('Connected to the database');
        app.listen(port, console.log(`Server is listening on port ${port}`));
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

start();