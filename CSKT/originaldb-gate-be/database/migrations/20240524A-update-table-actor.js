import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log("__dirname: ", __dirname);
export async function up(knex) {
  console.log("up");
  const sql = (
    await readFile(path.join(__dirname, "./updateTableActor.sql"))
  
  ).toString();
  console.log("sql: ",sql)
  if (sql) {
    const sqlUpdate = sql.split("\n");
    if (sqlUpdate && sqlUpdate.length > 0) {
      for (const sql of sqlUpdate) {
        console.log("sql sqlUpdate: ",sql)
        try {
          await knex.raw(sql);
        } catch (error) {
          console.log("error: ", error);
        }
      }
    }
  }
  // await knex.schema.createTable("test_collections", (table) => {
  //   table.increments(); // integer id

  //   // name
  //   table.string("name");

  //   //description
  //   table.string("description");
  // });
  // return await knex("test_collections").insert([
  //   { name: "A", description: "A" },
  //   { name: "B", description: "BB" },
  //   { name: "C", description: "CCC" },
  //   { name: "D", description: "DDDD" },
  // ]);
}

export async function down(knex) {
  console.log("Drop");
  // return await knex.schema.dropTable("test_collections");
}
