import { LightningElement, track, wire } from 'lwc';
import fchRec from '@salesforce/apex/employee.response';
import empDat from '@salesforce/schema/Employee__c';
 import eName_f from '@salesforce/schema/Employee__c.Name';
 import email_f from '@salesforce/schema/Employee__c.Email__c';
import eCert_f from '@salesforce/schema/Employee__c.Certification__c';
import eComp_f from '@salesforce/schema/Employee__c.Company_Name__c';
import ePSkill_f from '@salesforce/schema/Employee__c.Primary_Skill__c';
import eSSkill_f from '@salesforce/schema/Employee__c.Secondary_Skill__c';
import eId_f from '@salesforce/schema/Employee__c.Emp_ID__c';
import ePhoto_f from '@salesforce/schema/Employee__c.Photo__c';
import eExp_f from '@salesforce/schema/Employee__c.Experience__c';
import eFinal_f from '@salesforce/schema/Employee__c.Final_result__c';
import eSend_f from '@salesforce/schema/Employee__c.Send_result_of_certification_course__c';
import eReq_f from '@salesforce/schema/Employee__c.Request_for_voucher__c';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class Employee extends LightningElement {
    ep=false;
    searchEmp;
    allData=[];
    totalRec
    totalPage
    data1
    pageSize=4
    curPage=1
   
     colm=[
            {label:'Name',fieldName:'Name',type:'text'},
            {label:'Email',fieldName:'Email__c',type:'email'},
            {label:'Id',fieldName:'Emp_ID__c',type:'number'},
            {label:'Company',fieldName:'Company_Name__c',type:'text'}

     ];

    objectApiName=empDat;
    fieldNames=[eName_f,eId_f,email_f,eComp_f,ePSkill_f,eSSkill_f,eExp_f,ePhoto_f,eCert_f,eReq_f,eFinal_f,eSend_f];


@wire(fchRec)
wRecs({data,error}){
    if(data){
        this.data1=data;
        console.log(data);
        this.totalRec=this.data1.length;
        this.totalPage=Math.ceil(this.totalRec/this.pageSize);
        this.updateEmp();
    }
    else if(error){
        console.error(error);
    }
}


// put data

 myEmp(event){
const q=new ShowToastEvent({
        title:'Employee Added'
    });  
    this.dispatchEvent(q);
    location.reload();
 }

 closemp(event){
     this.ep=false;

 }
 opemp(event){
     this.ep=true;
 }

// pagination

preEmp(event){
    if(this.curPage>1){
        this.curPage=this.curPage-1;
        this.updateEmp();
}}
nextEmp(event){
    if(this.curPage<this.totalPage){
        this.curPage=this.curPage+1;
       this.updateEmp();
    }
}

get dispre(){
    return this.curPage<=1;

}
get disnex(){
   return this.curPage>=this.totalPage;

}

updateEmp(){
    const start=(this.curPage-1)*this.pageSize;
    const end=this.pageSize*this.curPage;
    this.allData=this.data1.slice(start,end);

}

}
