import { Component, OnInit } from '@angular/core';
import { PostService } from 'app/services/post.service';
import {ActivatedRoute, RouterModule, Routes} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-read-post',
  templateUrl: './read-post.component.html',
  styleUrls: ['./read-post.component.css']
})
export class ReadPostComponent implements OnInit {
  data: any;
  postinfo: any [];
  postid: any;
  user: any;
  content: String;
  commentData: any;

  constructor(private postService: PostService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

    //Help from https://stackoverflow.com/questions/48751557/how-to-get-id-query-params-in-angular2
  ngOnInit() {
    this.route.params.subscribe(res => {
      this.postid = res['id'];
    });
    this.getPostData(this.postid);
   // this.getComments(this.postid);
  }

  getPostData(postid){
    this.postService.getPostData(postid).subscribe(result => {
      this.data = result['data'];
    });
  }

  sendComment(){
    this.authService.getProfile().subscribe(user_data => {
      this.user = user_data.user
      console.log(this.user)

      const newComment={
        postid: this.postid,
        owner: this.user,
        content: this.content
      }

      this.postService.sendComment(newComment).subscribe(data => {
        console.log(data)
        if(data.success){
          
          this.flashMessage.show('Comment sent',{cssClass: 'alert-success', timeout: 3000});
          this.content = "";
          location.reload();
        }
        else {
          this.flashMessage.show(data.msg,{cssClass: 'alert-danger', timeout: 3000});
        }
      })
    })
  }
}


