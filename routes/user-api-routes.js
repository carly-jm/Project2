// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const uploadprofile = require("../config/middleware/uploadprofile");
const uploadimagemulter = require("../config/middleware/imageware");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    
    db.User.create(req.body)
    .then(() => {
      res.redirect(307, "/api/login");
    })
    .catch(err => {
      res.status(401).json(err);
    });
  });


  //Route for saving a new profile image
  app.post("/uploadProfile", uploadimagemulter.single("file"), uploadprofile.uploadProfileImage);
  

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });


  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        displayName: req.user.displayName,
        profileImage: req.user.profileImage,
        favorites: req.user.favorites,
        location: req.user.location,
        birthday: req.user.birthday,
        id: req.user.id
      });
    }
  });

  // Route for getting data on all members
  app.get("/api/members", (req, res) => {
    
    db.User.findAll({})
    .then(function(data) {
     
      const userData =  data.map(data => {
      return Object.assign({}, {
        displayName: data.displayName,
        id: data.id
     })
     })
      res.json(userData);
    });
  })

  app.get("/api/members/:id", (req, res) => {
    
    db.User.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.Image,
      include: [{
        model: db.Comment
      },{
        model: db.Like
      }]
      }]
      })
      .then(function(user){
      
        var object = {
          user: {
            userId: user.id,
            username: user.displayName,
            posts: user.Images
          }
        }
        res.json(object);
      })
  })

  app.put('/uploadProfile', (req,res) => {
    const idUser = req.user.id
    db.User.update(
      {
          displayName: req.body.displayName,
          favorites: req.body.favorites,
          location: req.body.location,
          birthday: req.body.birthday
      },
      {
        where: {
          id: req.user.id
        }
    
      }).then(() => {
        res.redirect("/members/" + idUser);
      });
  })
};
