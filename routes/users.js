const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/database');
const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const moment = require('moment');

//Register
router.post("/register", (req, res, next)=>{
    let date = moment().format('DD/MM/YYYY HH:mm')
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        registerDate: date,
        bio: "",
        bioEditDate: "Never"
    });
    console.log(newUser)

    User.addUser(newUser, (err, user) => {
        if(err) {
            res.json({success: false, msg: "Failed to register user"});
        } else {
            res.json({success: true, msg: "User registered"});
        }
    })
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user) {
        return res.json({success: false, msg: 'User not found'});
        }
    
    User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch) {
        const token = jwt.sign({data: user}, config.secret, {
            expiresIn: 604800 // 1 week
        });
        res.json({
            success: true,
            token: 'JWT '+token,
            user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
            }
        })
        } else {
            return res.json({success: false, msg: 'Wrong password'});
            }
        });
    });
});

// Profile
router.get("/profile", passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    res.json({user: req.user});
});

//send new post to mongoDB
router.post('/sendNewPost', function(req, res, next) {

    let date = moment().format('DD/MM/YYYY HH:mm')
    Post.create(
      {
        owner: req.body.owner.username,
        topic: req.body.topic,
        content: req.body.content,
        comments: [],
        commentsNUM: 0,
        liked: [],
        votes: 0,
        date: date
      },
      (err, ok) => {
        if(err) throw err;
      }
     
    ); return res.json({success: true})
  });

  // Help from https://code.tutsplus.com/creating-a-blogging-app-using-angular-mongodb-show-post--cms-30140t
  router.get('/getAllPost', (req,res) => {
    Post.find({},(err,data) => {
        if(err) throw err;
        else{
            return res.json({posts: data});
        }
    })
  })

  router.get('/getPostData/:id', (req, res) => {
    Post.findById((req.params.id), (err, post) => {
        if(err) throw err;
        else{
            return res.json({data: post})
        }
    });
})

//Send Comment to post
router.post('/sendComment', (req, res) => {
    Post.findById(req.body.postid, (err, post) => {
        if(err) throw err;
        else{
            let comments = post.comments;
            //console.log(comments)
            let date = moment().format('DD/MM/YYYY HH:mm')
            let id = comments.length;
            newComment = [id ,req.body.owner.username, req.body.content, [] , 0, date]
            comments.push(newComment)
              Post.findByIdAndUpdate(req.body.postid, {$set:{comments:comments, commentsNUM:comments.length}}, (err, doc) => {
                if(err) throw err;
                return res.json({success: true})
              })
        }
    })
})

// Like current post
router.post('/likePost', (req,res) => {
    //Find right post
    Post.findById(req.body.postid, (err, post) => {
        if(err) throw err;
        else{
            let exisist = 0;
            let liked = post.liked;
            let likedwithout= [];

            //checking if user is already liked post
            for (let i = 0; i < liked.length; i++){
                if (liked[i] == req.body.user._id){
                    exisist = 1;
                }
                else {
                    likedwithout.push(liked[i]);
                }
            }

            let likes, msg;
            // if not liked, user will be added to liked list and number will rise
            if (exisist == 0){
                likedwithout.push(req.body.user._id)
                likes = post.votes + 1;
                msg = "Liked"
            }
            //if already liked user will be deleted from liked list and likes down grades 
            if (exisist == 1){
                likes = post.votes -1;
                msg = "Unliked"
            }
            //Save changes
            Post.findByIdAndUpdate(req.body.postid, {$set:{liked: likedwithout, votes: likes}}, (err, doc) => {
                    if(err) throw err;
                    return res.json({success: true, msg: msg})
                })            

        }
    })
})

router.post('/likeComment', (req,res) => {
    //Find current post
    Post.findById(req.body.postid, (err, post) => {
        if(err) throw err;
        else{
            let comments = post.comments;
            let current = comments[req.body.comment[0]];

            let likesOfCommet = current[3];

            let exisist = 0;
            let updatedLikesOfComment= [];

            //checking if user is already liked comment
             for (let i = 0; i < likesOfCommet.length; i++){
                if (likesOfCommet[i] == req.body.user.username){
                    exisist = 1;
                }
                else {
                    updatedLikesOfComment.push(likesOfCommet[i]);
                }
            }

            // if not liked, user will be added to liked list and number will rise
            if (exisist == 0){
                updatedLikesOfComment.push(req.body.user.username)
                current[4] = updatedLikesOfComment.length;
                msg = "Liked comment"
            }
            //if already liked user will be deleted from liked list and likes down grades 
            if (exisist == 1){
                current[4] = updatedLikesOfComment.length;
                msg = "Unliked comment"
            }
            
            //save to right plase in all comments list of post
            current[3] = updatedLikesOfComment;
            comments[req.body.comment[0]]= current;
            console.log(comments)
            
            //update post
            Post.findByIdAndUpdate(req.body.postid, {$set:{comments: comments}}, (err, doc) => {
                    if(err) throw err;
                    return res.json({success: true, msg: msg})
                })       

        }
    })
})

//Go to wanted users profile (by username)
router.get('/profile/:username', (req, res) => {
    console.log(req.params.username)
    User.findOne({username: req.params.username}, (err, user) => {
        if(err) throw err;
        else{
            console.log(user)
            return res.json({data: user})
        }    
    });

})

//Search topics with keyword
router.post('/search', (req, res) => {
    console.log(req.body)
    Post.find({topic: {'$regex': (req.body.topic)}}, (err, post) => {
        if(err) throw err;
        else{
            return res.json({success: true, data: post})
        }
    })
})

//Save edited BIO tu user data
router.post('/saveBio', (req, res) => {
    console.log(req.body)
    let date = moment().format('DD/MM/YYYY HH:mm')
    
    User.findByIdAndUpdate(req.body.owner._id, {$set:{bio: req.body.bio, bioEditDate: date}}, (err, user) => {
        if (err) throw err;
        else{
            return res.json({User: user});
        }
    })
})

module.exports = router;