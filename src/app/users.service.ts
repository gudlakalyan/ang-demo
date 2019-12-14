import { Injectable,Directive,Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError,pipe } from 'rxjs';
import { User } from './users/User';
import { retry, catchError } from 'rxjs/operators';
// import { JsonPipe } from '@angular/common';
// import { resolve } from 'path';
// import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  // baseurl = 'http://localhost:8080/Spring4MVCAngularJSExample/user/'
  baseurl : string = 'http://localhost:8080/Spring4MVCAngularJSExample/emp/'
  config = "assets/config.json"

  constructor(private http: HttpClient) { 
    console.info(JSON.stringify(this.getConfig()))
  }
  
  getConfig() {
    return this.http.get(this.config);
  }

  httpOptions = {
    headers : new HttpHeaders({
      'content-type' : 'application/json'
    })
  }

  /* GetUsersList():Observable<User>{
    console.info(">>>>>>>>>>>>>>>>")
    return this.http.get<User>(this.baseurl+"empList/0/Naveen").pipe(retry(1),catchError(this.errorHandle))
  } */


  addUser (user : User) : Observable<User>{
    return this.http.post<User>(this.baseurl+"newuser/",user,this.httpOptions).pipe(catchError(this.errorHandle))
    // return this.http.get<User>(this.baseurl+"newuser/",this.httpOptions).pipe(catchError(this.errorHandle))
  }

  GetUsersList () {
    // return this.http.post<User>(this.baseurl+"newuser/",user,this.httpOptions).pipe(catchError(this.errorHandle))
    // return this.http.get<User>(this.baseurl+"newuser/",this.httpOptions).pipe(catchError(this.errorHandle))

    let promise = new Promise((resolve,reject)=>{
      this.http.get(this.baseurl+"empList/0/Naveen").toPromise().then(data=>{
        console.info("PROMISE API CALL))))))))))))))"+JSON.stringify(data))
        console.info("resolveedddd ............. "+data)
        resolve(data);
      }, msg =>{
        console.info("Rejecteddddd ............. "+msg)
        reject(msg)
      }).catch((err)=>{
        console.error(err)
      })
    })
    return promise
  }

  updateUser (user : User) : Observable<User>{
    return this.http.post<User>(this.baseurl+"updateEmpDetails/",user,this.httpOptions).pipe(catchError(this.errorHandle))
  }

  


  

  private handleError(error: HttpErrorResponse,u : User) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message+  "   "+u.username);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`+  "   "+u.username);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.'+  "   "+u.username);
  };
  
  errorHandle(error){
    console.info("Error BLOCK")
    let errorMessage = '';
    if(error.error instanceof ErrorEvent){
      //Get Client side error
      errorMessage = error.error.message;
    }else{
      //Get Server side error
      errorMessage = 'Error Code : '+error.status+'\n Message : '+error.message+'';
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
