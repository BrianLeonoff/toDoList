import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "del1ixir",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

async function getItems() {
  const result = await db.query("SELECT * FROM items")
  let items = [];
  result.rows.forEach((item) => {
    items.push(item);
  });  
  return items;
}

app.get("/", async (req, res) => {
  const items = await getItems();  
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
}); 

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  
  try{
      await db.query("INSERT INTO items (title) VALUES ($1)",
      [item]
      );
      res.redirect("/");
  }catch(e){
    console.log(e);
    res.redirect("/");
  } 
});

app.post("/edit", async (req, res) => {
  const updatedId = req.body.updatedItemId
  const updatedTitle = req.body.updatedItemTitle
  try{
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2)",
    [updatedTitle, updatedId]
    );
    res.redirect("/");
}catch(e){
  console.log(e);
  res.redirect("/");
} 

});

app.post("/delete", async (req, res) => {
  const deleted = req.body.deleteItemId
  try{
    await db.query("DELETE FROM items WHERE id = ($1)",
    [deleted]
    );
    res.redirect("/");
}catch(e){
  console.log(e);
  res.redirect("/");
} 
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
