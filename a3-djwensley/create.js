var sql = require('sqlite3');

// create database
var db = new sql.Database('hospital.sqlite');

db.serialize(function() {

  db.run("DROP TABLE hospital")
  // making the table
  db.run("CREATE TABLE hospital (id varchar(100), Name varchar(100), Birthdate varchar(100), Room varchar(100))");

  db.run("INSERT INTO hospital VALUES ('asdf123', 'Joe Schmoe', '1/5/57', 'Lobby')");
  db.run("INSERT INTO hospital VALUES ('bsdf123', 'Jane Doe', '2/29/04', 'Lobby')");  
  
  db.each("SELECT id, Name, Birthdate, Room FROM hospital", function(err, row) {
      console.log( JSON.stringify(row) );
  });
});

db.close();