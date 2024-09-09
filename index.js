const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Middleware para analisar JSON no corpo das requisições
app.use(express.json());

// Função auxiliar para salvar dados no arquivo db.json
function saveDataToFile(data) {
  const filePath = "db.json";

  if (fs.existsSync(filePath)) {
    // Lê o conteúdo atual do arquivo
    const fileData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileData);

    jsonData.users.push(data);

    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");
  } else {
    // Se o arquivo não existir, cria um novo com a estrutura inicial
    const jsonData = {
      users: [data],
    };

    fs.writeFileSync(filePath.JSON.stringify(jsonData, null, 2), "utf8");
  }
}

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  const newUser = {
    id: Date.now(),
    username,
    password,
  };

  saveDataToFile(newUser);

  return res
    .status(201)
    .json({ message: "Usuário cadastrado com sucesso!", username });
});

app.get("/", (req, res) => {
  const filePath = "db.json";
  const fileData = fs.readFileSync(filePath, "utf8");
  const jsonData = JSON.parse(fileData);
  console.log(jsonData);
  res.send(jsonData);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Preencha todos os campos!" });
  }

  const filePath = "db.json";
  let fileData;
  try {
    fileData = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao ler o arquivo!" });
  }

  const jsonData = JSON.parse(fileData);

  const userIndex = jsonData.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  jsonData.users[userIndex] = {
    ...jsonData.users[userIndex],
    username,
    password,
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao escrever no arquivo!" });
  }

  return res.status(200).json({
    message: "Usuário atualizado com sucesso!",
    user: jsonData.users[userIndex],
  });
});

app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);

  const filePath = "db.json";
  let fileData;
  try {
    fileData = fs.readFileSync(filePath, "utf8");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao ler o arquivo!" });
  }

  const jsonData = JSON.parse(fileData);

  const userIndex = jsonData.users.findIndex((user) => user.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado!" });
  }

  jsonData.users.splice(userIndex, 1);

  try {
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), "utf8");
  } catch (error) {
    return res.status(500).json({ message: "Erro ao escrever no arquivo!" });
  }

  return res.status(200).json({
    message: "Usuário deletado com sucesso!",
    user: jsonData.users[userIndex],
  });
});
