var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.DB_URI || 'localhost',
  database: process.env.DB_NAME || 'ec021',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
});

const executar = (strQuery) => {
  return new Promise((resolve, reject) => {
    connection.query(strQuery, (error, rows, fields) => {
      if (error) reject(error);
      resolve(rows);
    });
  });
}

const inserir = (data) => {
  const query = `INSERT INTO toddy (lote, conteudo, validade)
    VALUES ('${data.lote}', ${data.conteudo}, '${data.validade}');`;
  return executar(query);
};

const listar = () => {
  const query = "SELECT * FROM toddy;";
  return executar(query);
};

const ler = (id) => {
  const query = `SELECT * FROM toddy WHERE id = ${id};`;
  return executar(query);
};

const atualizar = (id, data) => {
  const query = `UPDATE toddy
    SET
      lote = '${data.lote}',
      conteudo = ${data.conteudo},
      validade = '${data.validade}'
    WHERE id = ${id};`;
  return executar(query);
};

const apagar = (id) => {
  const query = `DELETE FROM toddy WHERE id = ${id};`;
  return executar(query);
};

module.exports = {
  inserir,
  listar,
  ler,
  atualizar,
  apagar,
};
