const express = require("express");
const cors = require("cors");
var _ = require("lodash");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = _.find(repositories, { id: id });
  if(!repository) return response.status(400).json({ error: 'Repository not found.' });
  repositories[id] = _.merge(repository, { title, url, techs });
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repository = _.find(repositories, { id: id });
  if(!repository) return response.status(400).json({ error: 'Repository not found.' });

  _.remove(repositories, { id: id });
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = _.find(repositories, { id: id });
  if(!repository) return response.status(400).json({ error: 'Repository not found.' });

  repository.likes+=1;
  return response.json(repository);
});

module.exports = app;
