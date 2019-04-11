const getTitles = require('./getTitles')
const app = require('express')()

/* no need to set cors header but we'll log the req method and url input
   from this middleware and set the response header anyway */
app.use(function cors (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  console.log(req.method, req.originalUrl)
  next()
})

app.get('/', function(req, res){
  if ('input' in req.query){
    let {input} = req.query

    /* build mentions array */
    const mentions = (input
      .match(/@(.\w+)/g) || [])
      .map(i => i.replace(/@/,''))

    /* build emoticons array */
    const emoticons = (input
      .match(/\((.\w+)/g) || [])
      .filter(w => w.length <= 15)
      .map(i => i.replace(/\(/,''))

    /* build URL titles array and issue json response */
    return getTitles(input, links => res.json({
      mentions,
      emoticons,
      links,
    }))
  }
  res.send('please include an input= query')
})

app.listen(3000)
