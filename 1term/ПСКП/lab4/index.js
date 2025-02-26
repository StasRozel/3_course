import express from "express";
import Database from "./db.js";

const app = express();

app.use(express.json());

const DB = new Database([
  { id: 1, name: "Alice", bday: "1990-01-15" },
  { id: 2, name: "Bob", bday: "1985-03-22" },
  { id: 3, name: "Charlie", bday: "1992-07-09" },
  { id: 4, name: "David", bday: "1988-11-30" },
  { id: 5, name: "Eva", bday: "1995-05-14" },
  { id: 6, name: "Frank", bday: "1991-02-18" },
  { id: 7, name: "Grace", bday: "1989-09-27" },
  { id: 8, name: "Hannah", bday: "1993-12-05" },
  { id: 9, name: "Ian", bday: "1987-06-16" },
  { id: 10, name: "Judy", bday: "1994-08-21" },
]);

app.get('/', (req, res) => {
  res.sendFile('E:/Универ/3 курс/ПСКП/lab4/index.html');
})

app.get("/get", (req, res) => {
  res.json(DB.select()); 
});

app.post("/post", (req, res) => {
  res.json(DB.insert(req.body.obj));
});

app.put("/put", (req, res) => {
  res.json(DB.update(req.body.obj)); 
});

app.delete("/delete", (req, res) => {
  const id = req.query.id;
  res.json(DB.delete(id)); 
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
