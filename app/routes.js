module.exports = function(app, passport, db) {

// normal routes ===============================================================

    const multer = require("multer")
    const ObjectId = require('mongodb').ObjectId
    const path = require('path')
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "./public/img/uploaded/")
      },
      filename:(req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
      }
    })

    const upload = multer({storage: storage})

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    app.get('/profile', isLoggedIn, (req, res) => {
      db.collection('design').find(
        { 
          userId : req.user._id 
        }
        ).toArray((err, result) => { 
          console.log('result:', result)
          const imgData = result.length > 0 ? result[result.length-1].img.split('public/')[1] : ""
          console.log(imgData)
        if (err) return console.log(err)
        res.render('profile.ejs', {
          designEjsVar : result, 
          img : imgData
        })
      })
    })

    app.get('/designs', isLoggedIn, function(req, res) {
      db.collection('design').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.render('myDesigns.ejs', {
          user : req.user,
          design: result
        })
      })
  });
  
    app.post('/newEntry', isLoggedIn, upload.single("img"), (req, res) => {
      const imgLogic = req.file ? req.file.path : req.body.customImg

      const newDesign = {
        userId : req.user._id,
        size: req.body.size,
        shirtColor: req.body.color,
        art: req.body.art,
        accents: req.body.accent,
        img: imgLogic 
      }
      console.log('req.user:', req.user)
      db.collection('design').insert(
        newDesign,
      )
      .then(result => res.redirect('/designs'))
      .catch(error => console.error(error)) 
    })

    app.post('/emailList', (req, res) => {
      db.collection('emailList').save(
        {
          email: req.body.email 
        }, 
        (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/')
      })
    })

    app.delete('/deleteDesign', (req, res) => {
      console.log('req.body.designId:', req.body.designId)

      db.collection('design').deleteOne(
        {
          // _id : `ObjectId( "${req.body.designId}" )`
          _id : ObjectId( req.body.designId )
        }, 
        (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    // // PROFILE SECTION =========================
    // app.get('/profile', isLoggedIn, function(req, res) {
    //     db.collection('messages').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       res.render('profile.ejs', {
    //         user : req.user,
    //         messages: result
    //       })
    //     })
    // });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/messages', (req, res) => {
      db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/messages', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbUp:req.body.thumbUp + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.put('/down', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbUp:req.body.thumbUp - 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
