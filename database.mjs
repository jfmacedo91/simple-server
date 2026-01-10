import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./db.sqlite");

db.exec(/*sql*/`
  PRAGMA foreign_keys = ON;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  PRAGMA cache_size = 2000;
  PRAGMA busy_timeout = 5000;
  PRAGMA temp_store = MEMORY;
`);

db.exec(/*sql*/`
  CREATE TABLE IF NOT EXISTS "products" (
    "slug" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL
  );
`);

const insert = db.prepare(/*sql*/`
  INSERT OR IGNORE INTO "products"
    ("slug", "name", "category", "price")
  VALUES
    (?, ?, ?, ?);
`);

insert.run('notebook', 'Notebook', 'eletronicos', 4000);
insert.run('mouse', 'Mouse', 'eletronicos', 200);
insert.run('mesa', 'Mesa', 'moveis', 2000);
const item5 = insert.run('smartphone', 'Smartphone', 'eletronicos', 3000);
console.log(item5);

const products = db.prepare(/*sql*/`
  SELECT * FROM "products";
`).all();
console.log(products[4].name);

const mouse = db.prepare(/*sql*/`
  SELECT * FROM "products" WHERE "slug" = ?;
`).get('mouse');
console.log(mouse.name);