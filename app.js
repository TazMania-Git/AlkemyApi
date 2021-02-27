const express = require('express');
const mysql = require('mysql');
var cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3050;

const app = express();

app.use(bodyParser.json());
app.use(cors());

// MySql // IMPORTANTE!! POR CUESTIONES DE SEGURIDAD Y PRIVACIDAD EL ACCESO A LA DB NO SE DEJO
const connection = mysql.createPool({
    host: '',
    user: '',
    password: '',
    database: ''
});

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


// SALUDO INICIAL AL SOLO SOLICITAR "/"
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
            res.send({ succcess: true, message: 'No Results' });
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
            res.send({ succcess: true, message: 'No Results' });
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
        res.send({ succcess: true, message: 'Form created!' });
    });
});

// update formulario with id
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { form_concepto, form_monto, form_fecha, form_tipo } = req.body;
    const sql = `UPDATE formularios SET form_concepto = '${form_concepto}',
                 form_monto='${form_monto}', form_fecha='${form_fecha}',    
                 form_tipo='${form_tipo}'  WHERE form_id =${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send({ succcess: true, message: 'Form updated!' });
    });
});

// delete formulario
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM formularios WHERE form_id= ${id}`;

    connection.query(sql, error => {
        if (error) throw error;
        res.send({ succcess: true, message: 'Delete Form' });
    });
});