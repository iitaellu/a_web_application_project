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
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

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

router.post('/sendComment', (req, res) => {
    Post.findById(req.body.postid, (err, post) => {
        if(err) throw err;
        else{
            let comments = post.comments;
            //console.log(comments)
            let date = moment().format('DD/MM/YYYY HH:mm')

            newComment = [req.body.owner.username, req.body.content,0, date]
            comments.push(newComment)
              Post.findByIdAndUpdate(req.body.postid, {$set:{comments:comments, commentsNUM:comments.length}}, (err, doc) => {
                if(err) throw err;
                return res.json({success: true})
              })
            //console.log(comments)
        }
    })
   //return res.json({msg: "error with sending comment"})
})



// Messages
/*router.get("/messages",passport.authenticate('jwt', {session:false}), (req, res, next)=>{
    Message.find({ $or: [{sender: req.user.username},{recipient: req.user.username}]}, (err, data)=> {
        if (err) throw err;
        else{
            let msg = []
            for (let i = 0; i < data.length; i++){
                msg.push(data[i]);
            }
            return res.json({message: msg});
        }
    })
});

//SEND NEW MESSAGE
router.post('/sendNewMessage', (req, res, next) => {

    User.getUserByUsername(req.body.username, (err, user) => {
        if(err) throw err;
        if(!user) {
            return res.json({success: false, msg: 'No user with username '+ req.body.username});
            }
        if(user.username == req.body.sender.username){
            return res.json({success: false, msg: "Can't send letter to yourself "+ req.body.username});
        }
        let newMessage = new Message ({
            sender: req.body.sender.username,
            recipient: req.body.username,
            topic: req.body.topic,
            message: req.body.msg
        })

        newMessage.save();
        return res.json({success: true});
        }
    )     

    
})

//Send messsage in old message
router.post('/sendMessage', (req, res, next) => {

    const id = req.body.messageID;
    Message.findById(id, (err, message) => {
        if(err) throw err;
        if(message){
            msg = message.msg;

            newMsg= [msg.length, req.body.sender, req.body.message, false]
            msg.push(newMsg)
            //msg.add(req.body.message)
            //FROM https://www.youtube.com/watch?v=qrDlIiq9zAc
            Message.findByIdAndUpdate(req.body.messageID, {$set:{ msg: msg}}, (err, doc)=> {
                if(err) throw err;
                res.json(doc)
            })
        }
        else{
            return res.json({success: false, msg: 'messages not found'});
        }
    })
})*/


module.exports = router;