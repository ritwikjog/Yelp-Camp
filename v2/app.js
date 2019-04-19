var express = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
Camp        = require("./models/campgrounds"),
mongoose    = require("mongoose"),
seedDB      = require("./seeds");


seedDB();

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser : true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
   res.render("landing"); 
});

app.get("/campsites", function(req,res){
    Camp.find({}, function(err, camps){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campsites.ejs", {camps:camps});
        }
    });
});

app.get("/campsites/new", function(req,res){
   res.render("new"); 
});

app.post("/campsites", function(req,res){
   var siteName = req.body.name;
   var image = req.body.image;
   var desc = req.body.desc;
   
   var campground = {
        name: siteName,
        image:image,
        description: desc
   };
   
   Camp.create(campground, function(err,camp){
       if(err){
           console.log(err);
       }
       else
       {
           res.redirect("/campsites");
       }
   });
});

app.get("/campsites/:id", function(req,res){
   Camp.findById(req.params.id).populate("comments").exec(function(err, camp){
      if(err){
          console.log(err);
      } 
      else
      {
          res.render("show",{camp:camp});
      }
   });
});

// app.get("/campsites/:id/comments/new", function(req,res){
//   res.render("new_comment"); 
// });

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is running"); 
});