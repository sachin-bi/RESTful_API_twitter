const express = require('express');
const app = express();
const path = require('path'); // to get folders public and views
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override'); //to covert req to patch
const port = 8080;

//
app.use(express.static(path.join(__dirname,"public")));

//to parse data coming from client
app.use(express.urlencoded({ extended: true }));

//to get the correct method , eg..patch,delete
app.use(methodOverride('_method'));



app.set("views engine", "ejs");  //setting views engine to read ejs
app.set("views", path.join(__dirname, "views"));


let dataHub = [
    {
        id: "1a",
        user: "sachin2",
        content: "keep doing good things to Environment",
    }, {
        id: "2b",
        user: "raj",
        content: "don't drink alcohol",
    }, {
        id: "3b",
        user: "ayush",
        content: "solve at least 1 dsa daily",
    },
];



app.get("/posts", (req, res) => {
    console.log("accessed to index.ejs,", dataHub.length);
    res.render("index.ejs", { dataHub });
});

app.post("/posts", (req, res) => {
    let { user, content } = req.body;
    let id = uuidv4();

    dataHub.push({ id, user, content });

    console.log("submitted post ", { id, user, content });
    res.redirect("/posts");
});

app.get("/posts/new", (req, res) => {
    console.log("/posts/new -- accessed ");
    res.render("new.ejs");
});

app.get("/posts/:id", (req, res) => {
    let {id} = req.params;
    // let post = "not foundd"; 
    let post = dataHub.find((obj) => obj.id === id);
    console.log("search by id----",{post} );
    res.render("show.ejs", {post});
});

app.get("/posts/:id/edit", (req,res) => {
    let {id} = req.params;
    let post = dataHub.find((obj) => obj.id === id);
    console.log("/posts/:id/edit----search by id----",{post} );
    res.render("edit.ejs", {post});
});

app.patch("/posts/:id", (req,res) =>{
    let {id} = req.params;
    let newContent = req.body.content;
    let post = dataHub.find((obj) => obj.id === id);
    post.content = newContent;

    console.log('newContent app.patch:---',newContent );
    res.redirect("/posts");

});

app.delete("/posts/:id", (req,res) =>{
    let {id} = req.params;
    dataHub = dataHub.filter((obj) => obj.id !== id);
    res.redirect("/posts");

});

app.listen(port, (err) => {
    if (err) console.log("error in server setup");
    console.log("Server is listening at --", port);
});