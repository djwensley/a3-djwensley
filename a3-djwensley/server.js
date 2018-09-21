var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , sql  = require('sqlite3')
  , port = 8080
  , debug = true

// db setup
var db = new sql.Database('hospital.sqlite')

// server setup
var server = http.createServer (function (req, res) {
  var uri = url.parse(req.url)
  console.log(uri.pathname)
  switch( uri.pathname ) {
    case '/':
      send_file(res, 'index.html')
      break
    case '/index.html':
      send_file(res, 'index.html')
      break
    case '/read':
      read(res)
      break
    case '/update':
      update(res, req)
      break
	case '/create':
      create(res, req)
      break
	case '/del':
	  del(res,req)
	  break
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port)
console.log('listening on 8080')

function send_file(res, filename) {
  fs.readFile(
    filename, 
    function(error, content) {
      res.writeHead(200, {'Content-type': 'text/html'})
      res.end(content, 'utf-8') 
    }
  )
}

function new_id() {
  return Date.now().toString(36)
}

function read(res){
  var hospital = []
  console.log("Reading")
  db.each(
    "SELECT id, Name, Birthdate, Room FROM hospital",
    function(err, row) { hospital.push(row) },
    function() { res.end( JSON.stringify(hospital) ) }
  )
  console.log(hospital)
}

function update(res, req) {
  let body = []
  req.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    process( JSON.parse(body) )
    res.end()
	console.log(body)
  })
  function process( row ) {
    if(debug) console.log(row)
    var query = `
      UPDATE hospital 
      SET Room = '${row.Room}'
      WHERE Name = '${row.Name}'
	  AND Birthdate = '${row.Birthdate}'
	  
    `
    if(debug) console.log(query)
    db.run( 
      query,
      function(err) { res.end('movie updated') }
    )
  }
}

function create(res, req){
  let body = []
  req.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    process( JSON.parse(body) )
    res.end()
  })
  function process( row ) {
    if(debug) console.log(row)
    var query = `
      INSERT INTO hospital(id,Name,Birthdate,Room)
  VALUES('${new_id()}','${row.Name}','${row.Birthdate}','Lobby')
    `
	console.log(query)
    db.run(
      query,
      function(err) { res.end('Patient Registered') }
    )
  }
}

function del(res,req){
  let body = []
  req.on('data', (chunk) => {
    body.push(chunk)
  }).on('end', () => {
    body = Buffer.concat(body).toString()
    process( JSON.parse(body) )
    res.end()
  })
  function process( row ) {
    if(debug) console.log(row)
    var query = `
      DELETE FROM hospital
	  WHERE Name='${row.Name}'
	  AND Birthdate='${row.Birthdate}'
	`
	console.log('Deleting', query)
    db.run(
      query,
      function(err) { res.end('movie updated') }
    )
  }
}