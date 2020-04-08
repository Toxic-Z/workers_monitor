var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// router.get('/employees', function (req, res) {
//   dbo.collection('employees').find({}).toArray(function(err, result) {
//     res.send(result ? result : []);
//     if (err) throw err;
//     console.log(result);
//     db.close();
//   });
// });

module.exports = router;
