const express = require("express")
const bodyParser = require("body-parser")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()
    server.use(bodyParser.json())
    server.use(bodyParser.urlencoded({ extended: true }))

    server.get("/api/todolist", (req, res) => {
      return res.send({ list: [] })
    })

    server.get("*", (req, res) => {
      return handle(req, res)
    })

    server.listen(3005, (err) => {
      if (err) throw err
      console.log("> Ready on http://localhost:3005")
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })
