authorizeUser = (req, res) => {
  console.log("req:", req)
  res.status(200).json({ data: "authorized user!" })
}

module.exports = { authorizeUser }
