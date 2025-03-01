import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/signup', (c) => {
  return c.text("Welcome to the signup page!");
})

app.post('/api/v1/login', (c) => {
  return c.text("Welcome to the login page!");
})

app.get('/api/v1/feed', (c) => {
  return c.text("Welcome to the homepage!");
})


export default app
