var restify = require('restify');
var mysql = require('mysql');

var con = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'ec021',
};

var server = restify.createServer({
    name: "Activity 1"
});

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

// POST
function insertToddy(req, res, next) {
  var data = {
    lote: req.body.lote,
    conteudo: req.body.conteudo,
    validade: req.body.validade
  };
  var connection = mysql.createConnection(con);
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
  })

  const strQuery = `INSERT INTO toddy (lote, conteudo, validade)
      VALUES ('${data.lote}', ${data.conteudo}, '${data.validade}');`;

  connection.query(strQuery, function (err, rows, fields) {
    if (err) {
      res.json(400, err)
    } else {
      res.json(201, rows.insertId);
    }
  });

  connection.end();
  next();
}
server.post("/toddy", insertToddy);

// GET All
function listToddy(req, res, next) {
  console.log('[LISTAR]')
  var connection = mysql.createConnection(con);
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
  })

  const strQuery = `SELECT * FROM toddy;`;

  connection.query(strQuery, function (err, rows, fields) {
    if (err) {
      res.json(err)
    } else {
      res.json(rows);
    }
  });

  connection.end();
  next();
}
server.get("/toddy", listToddy);

// GET One
function getToddy(req, res, next) {
  index = req.params.id;
  console.log('[SELECIONAR]')
  var connection = mysql.createConnection(con);
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
  })

  const strQuery = `SELECT * FROM toddy WHERE id = ${index};`;

  connection.query(strQuery, function (err, rows, fields) {
    if (err) {
      res.json(404, err)
    } else {
      res.json(200, rows);
    }
  });

  connection.end();
  next();
}
server.get("/toddy/:id", getToddy);

// GET Due
function getDueToddy(req, res, next) {
  console.log('[VENCIDOS]')
  var connection = mysql.createConnection(con);
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
  })

  const strQuery = `SELECT * FROM toddy;`;

  connection.query(strQuery, function (err, rows, fields) {
    if (err) {
      res.json(404, err)
    } else {
      res.json(200, rows.filter(toddy => new Date(toddy.validade) < new Date()));
    }
  });

  connection.end();
  next();
}
server.get("/toddy/due", getDueToddy);

// UPDATE
function updateToddy(req, res, next) {
  index = req.params.id;
  var data = {
    lote: req.body.lote,
    conteudo: req.body.conteudo,
    validade: req.body.validade
  };
  console.log('[ATUALIZAR]')
  var connection = mysql.createConnection(con);
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
  })

  const strQuery = `UPDATE toddy
    SET (
      lote = '${data.lote}',
      conteudo = ${data.conteudo},
      validade = '${data.validade}'
    ) WHERE id = ${index};`;

  connection.query(strQuery, function (err, rows, fields) {
    if (err) {
      res.json(404, err)
    } else {
      res.json(202, rows);
    }
  });

  connection.end();
  next();
}
server.put("/toddy/:id", updateToddy);

// DELETE
function deleteToddy(req, res, next) {
  index = req.params.id;
  console.log('[APAGAR]')
  var connection = mysql.createConnection(con);
  connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected');
  })

  const strQuery = `DELETE FROM toddy WHERE id = ${index};`;

  connection.query(strQuery, function (err, rows, fields) {
    if (err) {
      res.json(404, err)
    } else {
      res.json(204, rows);
    }
  });

  connection.end();
  next();
}
server.del("/toddy/:id", deleteToddy);

var port = process.env.PORT || 5000;

server.listen(port, function() {
  console.log("%s up", server.name);
});
