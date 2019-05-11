var restify = require('restify');
var dao = require('./dao');

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
  dao.inserir(data)
  .then((result) => res.json({ id: result.insertId }))
  .catch((error) => res.send(error));
  next();
}
server.post("/toddy", insertToddy);

// GET All
async function listToddy(req, res, next) {
  console.log('[LISTAR]')
  dao.listar()
  .then((result) => res.json(result))
  .catch(() => res.send(500));
  next();
}
server.get("/toddy", listToddy);

// GET One
function getToddy(req, res, next) {
  console.log('[SELECIONAR]')
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
}
server.get("/toddy/:id", getToddy);

// UPDATE
function updateToddy(req, res, next) {
  id = req.params.id;
  var data = {
    lote: req.body.lote,
    conteudo: req.body.conteudo,
    validade: req.body.validade
  };
  console.log('[ATUALIZAR]')
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
}
server.put("/toddy/:id", updateToddy);

// DELETE
function deleteToddy(req, res, next) {
  id = req.params.id;
  console.log('[APAGAR]')
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
}
server.del("/toddy/:id", deleteToddy);

// GET Due
function getDueToddy(req, res, next) {
  console.log('[VENCIDOS]')
  dao.listar()
  .then((result) => res.json(result
    .filter(toddy => new Date(toddy.validade) < new Date()))
  )
  .catch(() => res.send(500));
  next();
}
server.get("/toddy/due", getDueToddy);

// GET lotes
function listLot(req, res, next) {
  console.log('[LOTES]')
  dao.listar()
  .then((result) => res.json(
    Array.from(
      new Set(result.map(toddy => toddy.lote))
    ))
  )
  .catch(() => res.send(500));
  next();
}
server.get("/toddy/lot", listLot);

// GET toddy by lote
function getLot(req, res, next) {
  console.log('[LISTAR POR LOTE]')
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
}
server.get("/toddy/lot/:lot", getLot);

var port = process.env.PORT || 5000;

server.listen(port, function() {
  console.log("%s up", server.name);
});
