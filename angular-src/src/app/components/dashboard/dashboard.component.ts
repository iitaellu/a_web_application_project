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

  constructor(private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private postService: PostService) { }

  ngOnInit() {

    this.getPost();
  }

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
        }
        else {
          this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout: 3000});
        }
      })
    })
  }
}