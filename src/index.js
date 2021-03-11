const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
    const { username } = request.headers;

    const user = users.find((users) => users.username === username);

    if(!user) {

      return response.status(400).json({
        error: 'User not found'


      })
    }

   request.user = user;
   
   return next()
}

app.post('/users',  (request, response) => {
  // Complete aqui

   const { name, username } = request.body;

   const userExists = users.some((user) => user.username === username);

   if(userExists) {
     return response.status(400).json({
      error: 'User Already exists'
    });
   } 

   const user = {

    id: uuidv4(),
    name,
    username,
    todos:[]
      
   } ;

   users.push(user)

   return response.status(201).json(user)

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  

console.log(user)

return response.json(user.todos)
 
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
   const { title, deadline} = request.body;
   const { username } = request.headers
   

   const todoList = {
      id: uuidv4(),
      title,
      done: false,
      deadline: new Date(deadline),
      created_at: new Date()
      
   }
 
  user.todos.push(todoList)
   
   return response.status(201).json(todoList)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const {id} = request.params;

  const todosExists = user.todos.findIndex((todo)=> todo.id === id);

  if(todosExists < 0){

     return response.status(404).json({error: 'Id does not found'})
  }

  const tudoUpdated =  user.todos.find(todo => todo.id === id)
  tudoUpdated.title = title;
  tudoUpdated.deadline = new Date(deadline)

  return response.status(201).json(tudoUpdated)
  

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const { id } = request.params;

  

  const doneExists = user.todos.findIndex(done => done.id === id)

  if(doneExists < 0) {

        return response.status(404).json({error:"id does not exists"});
  }


  const doneMarkedTrue = user.todos.find(done => done.id === id)

  doneMarkedTrue.done = true
 
  return response.status(201).json(doneMarkedTrue)

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { user } = request;
  const { id } = request.params;
  const todoExists  = user.todos.find((todos) => todos.id === id)

  if(!todoExists) {

    return response.status(404).json({error: 'Id does not'})
  }


user.todos.splice(todoExists, 1);

return response.status(204).json(user.todos)
});

module.exports = app;