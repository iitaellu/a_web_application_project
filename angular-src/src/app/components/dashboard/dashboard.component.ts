import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PostService } from 'app/services/post.service';
import {FlashMessagesService} from 'angular2-flash-messages';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [PostService]
})
export class DashboardComponent implements OnInit {
  topic: String;
  content: String;
  user: any;
  posts: any [];
  result: any [];

  constructor(private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private postService: PostService) { }

  ngOnInit() {

    this.getPost();
  }

  //Fetch all posts from database
  getPost(){
    this.postService.getPost().subscribe(result => {
      this.posts = result['posts'];
      console.log(result['posts'])
    });
  }

  //Send new post to backend
  sendPost(){
    this.authService.getProfile().subscribe(user_data => {
      this.user = user_data.user
      console.log(this.user)

      const newPost={
        owner: this.user,
        topic: this.topic,
        content: this.content
      }

      this.postService.sendPost(newPost).subscribe(data => {
        console.log(data)
        if(data.success){
          this.flashMessage.show('Message sent',{cssClass: 'alert-success', timeout: 3000});
          this.topic = "";
          this.content = "";
          location.reload();
        }
        else {
          this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout: 3000});
        }
      })
    })
  }

  //Sends search's keyword to postService
  searchPost(stopic){
    console.log(stopic)
    if(stopic == undefined){
      this.flashMessage.show("Type something",{cssClass: 'alert-danger', timeout: 3000});
      this.result = [{topic: "No results"}]
    }

    else{
        const msg = {
        topic: stopic
      }
      console.log(msg)
      this.postService.searchPost(msg).subscribe(search => {
        this.result = search['data'];
        console.log(this.result[0])
        if(this.result[0] == undefined){
          this.result = [{topic: "No results"}]
        }
        else{
          console.log(this.result);
        }
      
      })
      
    }
 }
    
}