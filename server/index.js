const { createServer } = require("http")
const express = require("express")
const next = require("next")
const { parse } = require("url")

const dev = process.env.NODE_ENV !== "production"
const HOSTNAME = "localhost"
const PORT = 8000

// intialize next app
const app = next({ dev, HOSTNAME, PORT })
const handle = app.getRequestHandler()

// Routes
const authorizationRouter = require("./src/routes/authorization.route")

app.prepare().then(() => {
  // create server once nextjs app is ready
  // initialize express app
  const server = express()

  // for handling JSON from reqs
  server.use(express.json())

  // example custom route to handle authorization
  server.use("/authorization", authorizationRouter)

  // else let nextjs' own method handle the rest of the application's routes (passing them the final req, res)
  server.get("*", async (req, res) => {
    const parsedUrl = parse(req.url ? req.url : "", true)
    return await handle(req, res, parsedUrl)
  })

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log(`>>>> Custom Server is Ready on http://${HOSTNAME}:${PORT}`)
  })
})
