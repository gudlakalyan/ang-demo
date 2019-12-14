import { Component, OnInit, NgModule, ViewChild, OnDestroy } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from '../users.service';
import { Observable, Subscription } from 'rxjs';
import { User } from './User';
import { JsonPipe } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
// import { resolve } from 'dns';
// import { reject } from 'q';

@NgModule({
  imports:[
    HttpClientModule
  ]
})
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit,OnDestroy{
  
  
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private paramsSubscription : Subscription;
  private httpSubscription : Subscription;

  userlist;
  dataSource;
  displayedColumns: string[] = ['id', 'username'];
  
  registrationForm : FormGroup

  loginUser = "Admin";
  registerBtn = "Register"
  Roles : string[] = ["Admin","Employee","Public"]

  constructor(public userservice:UsersService){
    // console.info(userservice.baseurl)
    
    this.userservice.GetUsersList().then((res)=> {
      console.log("**********"+res);
      this.userlist = res
      // this.dataSource = res

     

      this.refreshPaganator()
      

    }).catch((err)=>{
      console.error(">>>>>>>>>>>"+JSON.stringify(err)+"   "+err.status)
    })
    // console.info(">>> " + this.tiles)
    // console.info(">>> " + userservice.GetUsersList())
  }

  ngOnInit(): void {
    this.loginUser = "Kalyan (Admin)"
    // throw new Error("Method not implemented.");
    this.registrationForm = new FormGroup({
      userName : new FormControl('',[Validators.required,Validators.maxLength(23)]),
      employeeID : new FormControl('',[Validators.required,Validators.maxLength(60)])
    })

  }
  ngOnDestroy(): void {
    this.paramsSubscription.unsubscribe();
    this.httpSubscription.unsubscribe();
  }

  doUserNameFilter = (val:string)=> {
    // this.loginUser = val
  }

  tableFilter = (val:string)=>{
    
  }

  
  public hasEmployeeID = () => {
    if(this.loginUser == "AdminUser")
      return true;
    else
      return true;
  }

  onSubmit() {
    if (this.registrationForm.invalid) {

      alert("Something went wrong")
    }
    else{
      if(this.registerBtn == "Update"){
        let usr : User = {id : this.registrationForm.get("employeeID").value , username : this.registrationForm.get("userName").value}
        this.httpSubscription = this.userservice.updateUser(usr).subscribe((res)=>{
          console.info(JSON.stringify(res))
          this.userservice.GetUsersList().then((res)=> {
            console.log("**********"+res);
            this.userlist = res
          }).catch((err)=>{
            console.error(">>>>>>>>>>>"+JSON.stringify(err)+"   "+err.status)
          })
        })
      }else{
        let usr: User = { "id": this.registrationForm.get("employeeID").value, "username" : this.registrationForm.get("userName").value }
        this.userservice.addUser(usr).subscribe((res) => {
          console.log("***" + JSON.stringify(res));
          this.userservice.GetUsersList().then((res)=> {
            console.log("**********"+res);
            this.userlist = res

            this.refreshPaganator();
          
          }).catch((err)=>{
            console.error(">>>>>>>>>>>"+JSON.stringify(err)+"   "+err.status)
          })
        })
      }
    }
      
  }

  

  viewDetails(a,b){
    this.registrationForm.get("userName").setValue(b)
    this.registrationForm.get("employeeID").setValue(a)
    this.registerBtn = "Update"
  }

  public hasError = (controlName : string, errorName : string) =>{
    return this.registrationForm.controls[controlName].hasError(errorName)
  }

  refreshPaganator(){
    this.userlist = new MatTableDataSource(this.userlist);
    // Assign the paginator *after* dataSource is set
    this.userlist.paginator = this.paginator;

    this.userlist.sort = this.sort;
  }




}

