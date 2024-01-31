const express = require('express');
const app = express();

const session = require('express-session');
const passport = require('passport');
const facebookPassport = require('passport-facebook').Strategy;
//      passport-facebook ke pass 1 strategy hota hia


const config = require('./config/config');
const router = require('./routes/userRoutes');

// ab hm ye batayenge ki kon sa view engine use karenge
app.set('view engine', 'ejs');

app.use('/api', router);

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));


// hm ab passport ko initialize kar rhe hia. Ab hm passport ko session me store karayenge.
app.use(passport.initialize())
app.use(passport.session());


// Jb FB se login hoga tb serializer user chalega. Ye internally chalta hai i.e. passport khud ise chala lega. Hme isko nhi chalana hia.
passport.serializeUser(function (user, cb) {
  // FB se login krne pr serializeUser() chala. Isme session me data save ho jata hia.
  cb(null, user);
})

// Hm deserializeUser() ka use kr rhe hia isme 1 function jayega jisme ki obj, cb pass hoga. cb(null, obj) i.e. callback me null jayega error aur hm wahan se object ko return kar denge.
passport.deserializeUser(function (obj, cb) {
  // Jb page etc ko refresh krte hia to jo session me data hai wo data ko deserailze karega
  cb(null, obj);
})





// Ab Hm FB se connectivity karenge Passport ka use karke 
passport.use(new facebookPassport({

  // facebookPassport() ka use hoga, hm isko as an object kaam karayenge
  clientID: config.facebookAuth.ClientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: config.facebookAuth.callbackURL
},

  // ek inner function hoga iske under hme access token, refresh token  chahiye. Jb mera user secretId, clientID se connect hua. Hme user ka sara data chahiye name, id, etc. without password

  function (accessToken, refreshToken, profile, done) {
    // hme jo v name etc aayega wo profile se hi aayeaga.
    /*  
      if profile.id --> already exists
      else save user data
    */
    console.log(profile);

    return done(null, profile);

    //     <!-- index.js me passport.use() ke under ke function me profile hai. To ye passport.use() hamara poora data ko save kar lega.
    // userRoutes.js me hm isko '/pages' ke saath bind karke bhej denge. -->


  }))


const PORT = 3000;

app.listen(PORT, () => {
  console.log("server Started");
})