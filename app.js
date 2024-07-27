const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listings = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");


//this code is coppy from mongoose.js
main()
.then(()=>{
    console.log("connected to db");
})
.catch((err) =>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"views/data")));
app.use(express.urlencoded({ extended: true}));
app.use(methodoverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

//this is home page
app.get("/",(req,res)=>{
    res.render("data/home.ejs");
});

//index route show the list of title
app.get("/listings", async (req , res)=>{
   const alllistings = await Listings.find({});
   res.render("data/index.ejs",{alllistings});
});

//create new route
app.get("/listings/new", (req,res) =>{
    res.render("data/new.ejs")
});

//Show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id);
    res.render("data/show.ejs", { listing });
  });

  //show our new listing which we make
  app.post("/listings",async (req,res) =>{
    const newlisting =  new Listings(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
  });

  //edit route
app.get("/listings/:id/edit", async (req,res) => {
  let { id } = req.params;
  const listing = await Listings.findById(id);
  res.render("data/edit.ejs" , {listing});
});

//update route
app.put("/listings/:id", async (req,res) => {
  let { id } = req.params;
  await Listings.findByIdAndUpdate(id ,{...req.body.listing});
  res.redirect(`/listings/${id}`);
});

//deleting route
app.delete("/listings/:id", async (req,res) =>{
  let { id } = req.params;
  let deletedlisting = await Listings.findByIdAndDelete(id);
  console.log(deletedlisting);
  res.redirect("/listings");
});

// this is mongodb route
// app.get("/testListing", async (req,res)=>{
//    let sampleListing = new Listings({
//     title: "my new willa",
//     discription: "by near beatch",
//     price: 4000,
//     location: "himachal",
//     country: "india"
//    })
//    await sampleListing.save();
//    console.log("yes");
//    res.send("sucessfull testing");
// });


//this is port listing code
app.listen(8080, ()=>{
    console.log("server is lestining the port 8080");
})