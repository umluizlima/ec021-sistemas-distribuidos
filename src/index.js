var restify = require('restify');
var dao = require('./dao');

var server = restify.createServer({
    name: "Activity 1"
});

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    return next();
});

// POST
server.post("/toddy", (req, res, next) => {
  var data = {
    lote: req.body.lote,
    conteudo: req.body.conteudo,
    validade: req.body.validade
  };
  dao.inserir(data)
  .then((result) => res.json({ id: result.insertId }))
  .catch((error) => res.send(error));
  next();
});

// GET All
server.get("/toddy", (req, res, next) => {
  dao.listar()
  .then((result) => res.json(result))
  .catch(() => res.send(500));
  next();
});

// GET One
server.get("/toddy/:id", (req, res, next) => {
  dao.ler(req.params.id)
  .then((result) => {
    if (result.length == 0) {
      res.send(404);
    } else {
      res.json(result[0]);
    }
  })
  .catch(() => res.send(500));
  next();
});

// UPDATE
server.put("/toddy/:id", (req, res, next) => {
  id = req.params.id;
  var data = {
    lote: req.body.lote,
    conteudo: req.body.conteudo,
    validade: req.body.validade
  };
  dao.atualizar(id, data)
  .then((result) => {
    if (result.affectedRows == 0) {
      res.send(404);
    } else {
      res.send(200);
    }
  })
  .catch(() => res.send(400));
  next();
});

// DELETE
server.del("/toddy/:id", (req, res, next) => {
  id = req.params.id;
  dao.apagar(id)
  .then((result) => {
    if (result.affectedRows == 0) {
      res.send(404);
    } else {
      res.send(204);
    }
  })
  .catch(() => res.send(500));
  next();
});

// GET Due
server.get("/toddy/due", (req, res, next) => {
  dao.listar()
  .then((result) => res.json(result
    .filter(toddy => new Date(toddy.validade) < new Date()))
  )
  .catch(() => res.send(500));
  next();
});

// GET lotes
server.get("/toddy/lot", (req, res, next) => {
  dao.listar()
  .then((result) => res.json(
    Array.from(
      new Set(result.map(toddy => toddy.lote))
    ))
  )
  .catch(() => res.send(500));
  next();
});

// GET toddy by lote
server.get("/toddy/lot/:lot", (req, res, next) => {
  lote = req.params.lot;
  dao.listar()
  .then((result) => {
    const lots = result.filter(toddy => toddy.lote == lote);
    if (lots.length == 0) {
      res.send(404);
    } else {
      res.json(lots);
    }
  })
  .catch(() => res.send(500));
  next();
});

const port = 5000;

server.listen(port, function() {
  console.log("%s up", server.name);
});
