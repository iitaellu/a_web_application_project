import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ActivatedRoute } from '@angular/router';

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

  getPostData(postid){
    return this.http.get('http://localhost:3000/users/getPostData/'+postid, {})
    .map(function (res) { return res.json(); });
  }

  sendComment(comment){
      let headers = new Headers();
      this.loadToken();
      headers.append('Authorization', this.authToken);
      headers.append('Content-Type', 'application/json');
      return this.http.post('http://localhost:3000/users/sendComment', comment, { headers: headers })
              .map(function (res) { return res.json(); });
  }

  likePost(msg){
    return this.http.post('http://localhost:3000/users/likePost', msg)
    .map(function (res) { return res.json(); });
  }

  likeComment(msg){
    return this.http.post('http://localhost:3000/users/likeComment', msg)
    .map(function (res) { return res.json(); });
  }

  getUserData(username){
    return this.http.get('http://localhost:3000/users/profile/'+username, {})
    .map(function (res) { return res.json(); });
  }
}
