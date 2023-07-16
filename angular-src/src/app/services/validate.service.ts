import { Injectable } from '@angular/core';

//Service tp chec validation of data
@Injectable()
export class ValidateService {

  constructor() { }

  validatRegister(user){
    if(user.name == undefined || user.username == undefined || user.password == undefined){
      return false;
    } else{
      return true;
    }
  }

  validateEmail(email){
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
  }

}
