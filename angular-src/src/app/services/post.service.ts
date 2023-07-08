import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class PostService {

  authToken: any;
  user: any;
  post: any;

  constructor(private http: Http) { }

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
}
