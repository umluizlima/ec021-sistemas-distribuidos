var restify = require("restify");

var server = restify.createServer({
    name: "Activity 1"
});

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

var toddyStore = [
  { lote: 'ABC', conteudo: 150, validade: '28/05/2019'},
  { lote: 'ABB', conteudo: 200, validade: '01/03/2019'}
];

// POST
function insertToddy(req, res, next) {
  var data = {
    lote: req.body.lote,
    conteudo: req.body.conteudo,
    validade: req.body.validade
  };
  if(data && data != null) {
    data.id = toddyStore.push(data);
    res.send(201, data);
  } else {
    res.send(400);
  }
  next();
}
server.post("/toddy", insertToddy);

// GET All
function listToddy(req, res, next) {
  var data = [];
  for (const [index, item] of toddyStore.entries()) {
    item.id = index+1;
    data.push(item);
  }
  res.send(200, data);
  next();
}
server.get("/toddy", listToddy);

// GET One
function getToddy(req, res, next) {
  index = req.params.id;
  data = toddyStore[index-1];
  if(!data) {
    return res.send(404);
  }
  data.id = index;
  res.send(200, data);

  next();
}
server.get("/toddy/:id", getToddy);

// UPDATE
function updateToddy(req, res, next) {
  index = req.params.id-1;
  if(!toddyStore[index]) {
    return res.send(404);
  }
  var data = {
    id: index,
    lote: req.body.lote,
    conteudo: req.body.conteudo,
    validade: req.body.validade
  };
  toddyStore[index] = data
  return res.send(200, data);

  next();
}
server.put("/toddy/:id", updateToddy);

// DELETE
function deleteToddy(req, res, next) {
  index = req.params.id;
  if(!toddyStore[index-1]) {
    return res.send(404);
  }
  toddyStore = toddyStore.splice(req.params.id-1, 1);
  return res.send(204);

  next();
}
server.del("/toddy/:id", deleteToddy);

var port = process.env.PORT || 5000;

server.listen(port, function() {
  console.log("%s up", server.name);
});
