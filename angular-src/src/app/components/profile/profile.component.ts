import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { DH_UNABLE_TO_CHECK_GENERATOR } from 'constants';
import { PostService } from 'app/services/post.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;

  constructor(private authService: AuthService, 
    private router: Router,
    private postService: PostService) { }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });
  }

  saveBio(bio){
    this.authService.getProfile().subscribe(user_data => {
      this.user = user_data.user
      console.log(this.user)

      const bioData={
        owner: this.user,
        bio: bio
      }
    this.postService.saveBio(bioData).subscribe(bio=> {
      //location.reload();
    })
  })

  }
}
