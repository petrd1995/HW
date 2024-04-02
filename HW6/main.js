import express from 'express'
import knex from 'knex'
import knexfile from './knexfile.js'

const port = 3000

const app = express()
const db = knex(knexfile)

let todos = [
  { 
    id: 1, 
    title: 'Learn JavaScript',
    done: true,
    priority: 1
  },
  { 
    id: 2,
    title: 'Learn Node.js',
    done: true,
    priority: 2
  },
  { 
    id: 3,
    title: 'Learn React',
    done: false,
    priority: 0
  }
]


app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))



app.get('/', async (req, res) => {

  const todos = await db().select('*').from('todos')

  res.render('index', {
    title: 'Todos',
    todos, // todos: todos

  })
})

app.post('/add-todo', async (req, res) => {
  const todo = {
    title: req.body.title,
    done: false,
    priority: req.body.priority
  }

  await db('todos').insert(todo)

  res.redirect('/')
})

app.get('/remove-todo/:id', async (req, res) => {
  const todo = await db('todos').select('*').where('id', req.params.id).first()

  if (!todo) return next()

  await db('todos').delete().where('id', todo.id)

  res.redirect('/')
})

app.get('/toggle-todo/:id', async (req, res) => {
  const todo = await db('todos').select('*').where('id', req.params.id).first()

  if (!todo) return next()

  const updatedTodo = {
    ...todo,
    done: !todo.done
  }

  await db('todos').update(updatedTodo).where('id', todo.id)

  res.render('todo', {
    todo: updatedTodo
  })
})

app.get('/edit-todo/:id', async (req, res) => {
  const todo = await db('todos').select('*').where('id', req.params.id).first()

  if (!todo) return next()

  res.render('todo', {
    todo,
  })
})

app.post('/update-todo/:id', async (req, res) => {
  const todo = await db('todos').select('*').where('id', req.params.id).first()
  
  if (!todo) return next()
  
  await db('todos').update({title: req.body.title}).where('id', todo.id)
  res.redirect('back')
})

app.post('/update-priority/:id', async (req, res, next) => {
    const todo = await db('todos').select('*').where('id', req.params.id).first();

    if (!todo) return next();

    await db('todos').update({ priority: req.body.priority }).where('id', todo.id);
    res.redirect('/');

});



app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something went wrong!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

