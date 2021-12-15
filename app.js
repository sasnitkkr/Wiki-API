const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const mongoose = require('mongoose')
const { route } = require('express/lib/application')
const PORT = 3000

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended : true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser : true})

const articleSchema = {
    title : String,
    content : String
}

const Article = mongoose.model('Article', articleSchema)

app.get("/", function(req, res){
    res.send("Welcome");
});

////////////////////// All Articles ///////////////////////

// chainable route handlers
app.route("/articles")

.get(function(req, res){
    // read all articles
    Article.find({}, function(err, articles){
        if(err){
            console.log(err);
        }else{
            res.send(articles);
        }
    });
})

.post(function(req, res){
    // save new article entry
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });
    newArticle.save(function(err){
        if(err){
            res.send(err);
        }else{
            res.send("Successfully saved the article"); 
        }
    });
})

.delete(function(req, res){
    // delete all articles from articles route
    Article.deleteMany({},function(err){
        if(err){
            res.send(err);
        }else{
            res.send("Successfully deleted articles");
        }
    });
});

////////////////////// Specific Articles ///////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
    Article.findOne({title : req.params.articleTitle}, function(err, foundArticle){
        if(err){
            res.send(err);
        }else{
            if(foundArticle){
                res.send(foundArticle);
            }else{
                res.send("Article not found");
            }
        }
    })
})

.put(function(req, res){
    // replaces the current article by brand new article
    Article.replaceOne(      
        {title : req.params.articleTitle},
        {
            title : req.body.title,
            content : req.body.content
        },
        {overwrite : true},
        function(err){
            if(!err){
                res.send("Article Updated Successfully");
            }else{
                console.log(err);    
            }
        }
    )
})

.patch(function(req, res){
    // Replace only specified field of a particular article
    Article.updateOne(
        {title : req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Updated Successfully");
            }else{
                console.log(err);
                res.send("Error");
            }
        }
    )
})

.delete(function(req, res){
    Article.deleteOne(
        {title : req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Deleted Successfully");
            }else{
                console.log(err);
                res.send("Error");
            }
        }
    );
});


////////////////////// Listening ///////////////////////
app.listen(PORT, ()=>{
    console.log("App started at port " + PORT);
});