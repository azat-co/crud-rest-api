const express = require('express')
const logger = require('morgan')
let app = express()
const mongodb= require('mongodb')
const url = 'mongodb://localhost:27017/local'
const bodyParser = require('body-parser')
app.use(bodyParser.json())

mongodb.MongoClient.connect(url, (error, db)=>{
  if (error) {
    console.error(error)
    return process.exit(1)
  }

  app.get('/accounts', (req, res)=>{
    console.log(req.query)
    db.collection('accounts')
      .find({}, {limit: req.query.limit || 10, skip: req.query.skip, sort: {_id: -1}})
      .toArray((error, accounts)=>{
        if (error) return next(error)
        res.send(accounts)
    })
  })
  app.post('/accounts', (req, res, next)=>{
    let newAccount = req.body
    // validation!!!
    db.collection('accounts').insert(newAccount, (error, results)=>{
      if (error) return next(error)
      res.send(results)
    })
  })
  app.put('/accounts/:id', (req, res, next)=>{
   db.collection('accounts')
     .update({_id: mongodb.ObjectID( req.params.id)}, {$set: req.body}, (error, results)=>{
    if (error) return next(error)
    res.send(results)
   })

  })
  app.delete('/accounts/:id', (req, res, next)=>{
   db.collection('accounts').remove({_id:mongodb.ObjectID( req.params.id)}, (error, results)=>{
    if (error) return next(error)
    res.send(results)
   })
  })
  app.use(function(error, req, res, next){
    res.send(error)
  })
  app.listen(3000)
})