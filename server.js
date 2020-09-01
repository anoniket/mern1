const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const path = require("path");




app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/todos', todoRoutes);
app.use(express.static(path.join(__dirname, "client/build")));



mongoose.connect("mongodb+srv://admin-aniket:Admin123@cluster0-z81iv.mongodb.net/mern1",{ useNewUrlParser: true,useUnifiedTopology: true , useFindAndModify: false });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Einates have captured mongoose");
});



let todoSchema = new mongoose.Schema({
  todo_description:String,
  todo_responsible:String,
  todo_priority:String,
  todo_completed:Boolean
});


const Todo = new mongoose.model("Todo",todoSchema);




todoRoutes.route('/').get(function(req, res) {
  Todo.find(function(err, todos) {
      if (err) {
          console.log(err);
      } else {
          res.json(todos);
      }
  });
});

todoRoutes.route('/:id').get(function(req, res) {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
      res.json(todo);
  });
});

todoRoutes.route('/update/:id').post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
      if (!todo)
          res.status(404).send("data is not found");
      else
          todo.todo_description = req.body.todo_description;
          todo.todo_responsible = req.body.todo_responsible;
          todo.todo_priority = req.body.todo_priority;
          todo.todo_completed = req.body.todo_completed;

          todo.save().then(todo => {
              res.json('Todo updated!');
          })
          .catch(err => {
              res.status(400).send("Update not possible");
          });
  });
});

todoRoutes.route('/add').post(function(req, res) {
  let todo = new Todo(req.body);
  todo.save()
      .then(todo => {
          res.status(200).json({'todo': 'todo added successfully'});
      })
      .catch(err => {
          res.status(400).send('adding new todo failed');
      });
});



app.post("/dd",function(req,res){
  var a = req.body;
  res.send(a);
})


app.listen(5000,function(){
    console.log("Einates at your service!");
  });
  