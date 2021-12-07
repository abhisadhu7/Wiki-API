const express = require("express")
const axios = require("axios")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB")

const articleSchema={
    title:String,
    content: String
}
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get((req,res)=>{
    Article.find((err,art)=>{
        if(err){
            res.send(err);
        }else{
            res.send(art);
        }
    })
})
.post((req,res)=>{
    const newArticle = new Article({
       title: req.body.title,
       content:req.body.content
   });
   newArticle.save((err)=>{
       if(!err){
           res.send("Successfully added to the article")
       } else{
            res.send(err)
       }
   })
})
.delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(!err){
            res.send("Successfuly deleted all the articles")
        } else{
            res.send(err)
        }
    })
});
// //////////////////////////////////SPECIFIC REQUESTS//////////////////////
app.route("/articles/:articleTitle")
.get((req,res)=>{
    Article.findOne({title: req.params.articleTitle},(err,art)=>{
        if(!art){
            res.send("No Matching articles")
        } else{
            res.send(art)
        }
    })
})
.put((req,res)=>{
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite:true},
        (err)=>{
            if(!err){
                res.send("Successfully updated")
            }
    })
})
.patch((req,res)=>{
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set:req.body},
        (err)=>{
            if(!err){
                res.send("Successfully updated")
            }
    })
})
.delete((req,res)=>{
    Article.deleteOne(
        {title: req.params.articleTitle},
        (err)=>{
            if(!err){
                res.send("Successfully deleted")
            }
    })
})

app.listen(3000,()=>{
    console.log("The server has started on port 3000");
});