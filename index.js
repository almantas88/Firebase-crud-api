const functions = require("firebase-functions");

var admin = require("firebase-admin");
var serviceAccount = require("./PermissionsToDB.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: false }));
const db = admin.firestore();
// Routes

app.get("/hello-world", (req, res) => {
  return res.status(200).send("HEllo");
});


//* Create a new product
// POST

app.post("/api/create", async (req, res) => {
  
      try{
         let ref = db.collection('products').doc('/' + req.body.id + '/');
         await ref.create({
              name: req.body.name,
              description: req.body.description,
              price: req.body.price
          })

          return res.status(200).send(ref);
      }
      catch(error){
          console.log(error);
          return res.status(500).send(error);
      }
 
});


//* Read a specific product by an id 
// GET

app.get("/api/read/:id", async (req, res) => {
  console.log("gere");
  
      try{
         
        const document = db.collection('products').doc(req.params.id);
        const product = await document.get();
        const response = product.data();

          return res.status(200).send(response);
      }
      catch(error){
          console.log(error);
          return res.status(500).send(error);
      }
 
});


//* Read all products
// GET

app.get("/api/read", async (req, res) => {
  console.log("gere");
  
      try{
         
        const query = db.collection('products');
        const response = [];

        await query.get()
        .then(querySnapshot => {
          const docs = querySnapshot.docs; // the result of the query
          console.log(docs);
          for (let doc of docs)
          {
            const selectedItem = {
              id: doc.id,
              name: doc.data().name,
              description: doc.data().description,
              price: doc.data().price
            };
            response.push(selectedItem);
          }

          return response;
        });
        return res.status(200).send(response);
      }
      catch(error){
          console.log(error);
          return res.status(500).send(error);
      }
 
});


//! Update
// PUT

app.put("/api/update/:id", async (req, res) => {
  
  try{
     const document = db.collection('products').doc(req.params.id);
     await document.update({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
     })

      return res.status(200).send("Update succesful");
  }
  catch(error){
      console.log(error);
      return res.status(500).send(error);
  }

});


//! Delete
// DELETE

app.delete("/api/delete/:id", async (req, res) => {
  
  try{
     const document = db.collection('products').doc(req.params.id);
     await document.delete();

      return res.status(200).send("Delete succesfull");
  }
  catch(error){
      console.log(error);
      return res.status(500).send(error);
  }

});
// Export the api to firebase cloud functions
exports.app = functions.https.onRequest(app);
