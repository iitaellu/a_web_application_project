import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterModule, Routes} from '@angular/router';
import { PostService } from 'app/services/post.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private postService: PostService,) { }

  username: any;
  user: any;

  ngOnInit() {

    this.route.params.subscribe(res => {
      this.username = res['username'];
    });
    this.getUserdata();
  }

  getUserdata() {
    this.postService.getUserData(this.username).subscribe(result => {
      this.user = result['data'];
      console.log(this.user)
    });
  }

}
