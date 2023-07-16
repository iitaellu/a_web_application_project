import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

//Service for posts and commenting thingss

@Injectable()
export class PostService {

  authToken: any;
  user: any;
  post: any;
  id: any;
  comment: any;

  constructor(private http: Http,
    private route: ActivatedRoute,) { }

// Help from https://code.tutsplus.com/creating-a-blogging-app-using-angular-mongodb-show-post--cms-30140t
  getPost(){
    return this.http.get('http://localhost:3000/users/getAllPost', {})
    .map(function (res) { return res.json(); });
}

  //Send new post to backend server
  sendPost(post){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/sendNewPost', post, { headers: headers })
            .map(function (res) { return res.json(); });
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  //Get wanted post's data from backend
  getPostData(postid){
    return this.http.get('http://localhost:3000/users/getPostData/'+postid, {})
    .map(function (res) { return res.json(); });
  }

  //send new comment data to backend
  sendComment(comment){
      let headers = new Headers();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      headers.append('Content-Type', 'application/json');
      return this.http.post('http://localhost:3000/users/sendComment', comment, { headers: headers })
              .map(function (res) { return res.json(); });
  }

  //like or dislike current post
  likePost(msg){
    return this.http.post('http://localhost:3000/users/likePost', msg)
    .map(function (res) { return res.json(); });
  }

  //like or dislike current comment
  likeComment(msg){
    return this.http.post('http://localhost:3000/users/likeComment', msg)
    .map(function (res) { return res.json(); });
  }

  //get wanted userdata from backend
  getUserData(username){
    return this.http.get('http://localhost:3000/users/profile/'+username, {})
    .map(function (res) { return res.json(); });
  }

  //Send  search data to backend
  searchPost(topic){
    return this.http.post('http://localhost:3000/users/search', topic)
    .map(function (res) { return res.json(); });
  }

  //Send bio data to backend
  saveBio(bio){
    return this.http.post('http://localhost:3000/users/saveBio', bio)
    .map(function (res) { return res.json(); });
  }
}
