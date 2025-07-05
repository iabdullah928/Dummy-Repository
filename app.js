// app.js (this is a blog capstone project)
import express from "express";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(express.static(join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

let posts = [];

app.get("/", (req, res) => {
  res.render("home", { posts });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const { title, content } = req.body;
  const post = {
    id: Date.now().toString(),
    title,
    content
  };
  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.render("post", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.get("/posts/:id/edit", (req, res) => {
  const post = posts.find(p => p.id === req.params.id);
  if (post) {
    res.render("edit", { post });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/posts/:id/edit", (req, res) => {
  const { title, content } = req.body;
  const index = posts.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    posts[index].title = title;
    posts[index].content = content;
    res.redirect("/posts/" + req.params.id);
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/posts/:id/delete", (req, res) => {
  posts = posts.filter(p => p.id !== req.params.id);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
