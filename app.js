const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());

// MySql
const connection = mysql.createPool({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b98e6178785873',
    password: '9cbabb56',
    database: 'heroku_88f042983371ef6'
});
// const connection = mysql.createConnection({
//     host: 'us-cdbr-east-03.cleardb.com',
//     user: 'b98e6178785873',
//     password: '9cbabb56',
//     database: 'heroku_88f042983371ef6'
// });

// module.exports = connection;

// Check connect

connection.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
        } else {
            console.error(err.code);
        }
    }

    if (connection) {
        connection.release();
        console.log('DB is conected');
    }
});

module.exports = connection;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// connection.connect(error => {
//     if (error) throw error;
//     console.log('Database server running!');
// });


// Route
app.get('/', (req, res) => {
    res.send('Welcome to Alkemy API!');
});

// all formularios
app.get('/formularios', (req, res) => {
    const sql = 'SELECT * FROM formularios';

    connection.query(sql, (error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Not result');
        }
    });
});

// select one formularios with id
app.get('/formularios/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM formularios WHERE form_id = ${id}`;
    connection.query(sql, (error, result) => {
        if (error) throw error;

        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Not result');
        }
    });
});

// add formulario
app.post('/formularios/add', (req, res) => {
    const sql = 'INSERT INTO formularios SET ?';

    const customerObj = {
        form_concepto: req.body.form_concepto,
        form_monto: req.body.form_monto,
        form_fecha: req.body.form_fecha,
        form_tipo: req.body.form_tipo
    };

    connection.query(sql, customerObj, error => {
        if (error) throw error;
        res.send('Form created!');
    });
});

// update formulario with id
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { form_concepto, form_monto, form_fecha, form_tipo } = req.body;
    const sql = `UPDATE formularios SET form_concepto = '${form_concepto}', form_monto='${form_monto}', form_fecha='${form_fecha}',form_tipo='${form_tipo}'  WHERE form_id =${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Form updated!');
    });
});

// delete formulario
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM formularios WHERE form_id= ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send('Delete Form');
    });
});