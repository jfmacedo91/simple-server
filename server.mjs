import fs from "node:fs/promises";
import { createServer } from "node:http";
import { Router } from "./router.mjs";
import { customRequest } from "./cutom-request.mjs";
import { customResponse } from "./custom-response.mjs";

const router = new Router();

router.get("/produtos", async (req, res) => {
  try {
    const listaArquivos = await fs.readdir("./produtos", { recursive: true });
    const arquivosJson = listaArquivos.filter(produto => produto.endsWith(".json"));
    const promises = arquivosJson.map(arquivo => fs.readFile(`./produtos/${arquivo}`, "utf-8"));
    const conteudos = await Promise.all(promises);
    const produtos = conteudos.map(JSON.parse);
    res.status(200).json(produtos);
  } catch {
    res.status(500).json("Erro!");
  }
});

router.get("/produto", async (req, res) => {
  const categoria = req.query.get("categoria");
  const slug = req.query.get("slug");
  try {
    const conteudo = await fs.readFile(`./produtos/${categoria}/${slug}.json`, "utf-8");
    const produto = JSON.parse(conteudo);
    res.status(200).json(produto);
  } catch {
    res.status(404).json("Produto não encontrado!");
  }
});

router.post("/produtos", async (req, res) => {
  const { categoria, nome, slug } = req.body;

  try {
    await fs.mkdir("./produtos");
  } catch(err) {
    console.error("Pasta produtos já existe!");
  }

  try {
    await fs.mkdir(`./produtos/${categoria}`);
  } catch(err) {
    console.error(`A pasta ${categoria} já existe!`);
  }

  try {
    await fs.writeFile(`./produtos/${categoria}/${slug}.json`, JSON.stringify(req.body));
    res.status(201).json(`Produto ${nome} criado na categoria ${categoria}!`);
  } catch(err) {
    res.status(500).json("Erro!")
  }
});

const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = await customResponse(response);

  const handler = router.find(req.method, req.pathname);
  if(handler) {
    handler(req, res);
  } else {
    res.statusCode = 404;
    res.end("Página não encontrada!")
  }
});

server.listen("3000", () => {
  console.log("Server running: http://localhost:3000")
});