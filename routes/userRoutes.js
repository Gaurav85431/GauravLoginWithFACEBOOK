const passport = require('passport');
const express = require('express');

var router = express.Router();

router.get('/', function (req, res) {

  res.render('pages/index.ejs'); // index.ejs file is in page foler of views folder
})

// Jaise hi login karenge to hm profile per jayegna. To jo profile hm visit karte hia wo wala view v banana hai. 

router.get('/profile', isLoggedIn, function (req, res) {
  // isme inner function banayen hai
  // Yaha se hm profile view ko render karenge
  res.render('pages/profile.ejs', {
    user: req.user
  }); //pages folder me profile.ejs hai
})



router.get('/error', isLoggedIn, function (req, res) {
  res.render('pages/error.ejs');  // error page per chala jayega.
})



// hm isme authentication check karenge facebook ka. hm google, twitter etc. ka v authentication check kr skte hai. passport.authenticate('facebook') me fb ke gagah pr google etc. dekar
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email'] // isse pata chal jayega ki internally authenticated hua hai ya nhi. Internally facebook ko call karega.
}))



// hmne ye batana hoga ki error kab aayegi. Hmne callback router banaya hai jo ki config me laga hua hia. Hme ye call krana hoga otherwise hm check nhi kar paayenge
router.get('/Auth/facebook/callback', function () {

  passport.authenticate('facebook', {
    // agar success ho to 
    successRedirect: '/profile',
    // agar failure ho to 
    failureRedirect: '/error'
  })

})



router.get('/logout', function (req, res) {

  req.logout();    // logout
  res.redirect('/')  // redirect to login with  fb page
})



// check whether is the user is authenticated or not

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
    // yadi authenticated hai to next per jaye otherwise Login with fB wla page pr
  }
  else {
    res.redirect('/');

  }
}



module.exports = router;