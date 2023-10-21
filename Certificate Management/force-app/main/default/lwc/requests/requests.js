import { LightningElement,wire } from 'lwc';
import allReq from '@salesforce/apex/request.getRe';
import {deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import IdField from '@salesforce/schema/Certification_Request__c.Id';
import name_f from '@salesforce/schema/Certification_Request__c.Name';
import  crt_f from '@salesforce/schema/Certification_Request__c.Certification__c';
import emp_f from '@salesforce/schema/Certification_Request__c.Employee__c';
import vouc_f from '@salesforce/schema/Certification_Request__c.Voucher__c';
import due_f from '@salesforce/schema/Certification_Request__c.Due_Date__c';
import stat_f from '@salesforce/schema/Certification_Request__c.Status__c';
import email_f from '@salesforce/schema/Certification_Request__c.Email_of_Emp__c';
import comm_f from '@salesforce/schema/Certification_Request__c.Comments__c';

const actions = [
    { label: 'View', name: 'View' },
   { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
  ];

  const columns = [ 
  { label: 'Certification Request Name', fieldName: 'Name' },
    { label: 'Certification', fieldName: 'Certification__c' },
     { label: 'Employee', fieldName: 'Employee__c'  },
    { label: 'Voucher', fieldName: 'Voucher__c'  },
    { label: 'Status', fieldName: 'Status__c', type: 'text'},
     { label: 'Employee email id', fieldName: 'Email_of_Emp__c' ,type:'email'},
  { label: 'Due Date', fieldName: 'Due_Date__c',type:'date' },
    {
          type: 'action',
          typeAttributes: {
              rowActions: actions,
          }
      }
  ]

export default class Requests extends LightningElement {

status=false;
result1=[];
columns=columns;
isEditForm = false;
bShowModal = false;
currentRecordId;

maketrue(){
     this.status=true;
  }
closeModal() {
  this.status = false;
  this.bShowModal = false;
  }

Fields=
[name_f,crt_f,emp_f,vouc_f,due_f,stat_f,email_f,comm_f];

handleSuccess(event) {
  const evt = new ShowToastEvent({
  title: "Certification Request created",
   message: "Record ID: " + event.detail.id,
    variant: "success"
      });
   
 this.dispatchEvent(evt);
  location.reload();
}
 
// get data
@wire (allReq)
 CertificationRequest(result){
 if(result.data){
   let values = [];
    result.data.forEach(i => {
              let value = {};
         value.Id = i.Id;
    value.Name = i.Name;
           value.Certification__c = i.Certification__r.Name;
             value.Employee__c = i.Employee__r.Name;
           value.Due_Date__c = i.Due_Date__c;
      value.Status__c = i.Status__c;
      value.Email_of_Emp__c=i.Email_of_Emp__c;
          if (i.hasOwnProperty('Voucher__c')) {
              value.Voucher__c = i.Voucher__r.Name;
              }
else {
           value.Voucher__c = undefined;
      
      }
       
  value.Comments__c = i.Comments__c;
       values.push(value);
      
       
 });
     this.result1=values;
     //this.error = undefined;

    }
else if(result.error){
    // this.error=result.error;
    console.error(error);
       this.result1=undefined;
  
  }
  }
 
handleActions(event){
   let actionName = event.detail.action.name;
   let row = event.detail.row;
    switch (actionName) {
       case 'View':
       this.viewCurrCerReq(row);
        break;
  case 'edit':
      this.editCurrCerReq(row);
           break;
  case 'delete':
     this.deleteCerReq(row);
      break;
}
       }

viewCurrCerReq(currRow) {
  this.bShowModal = true;
   this.isEditForm = false;
  this.currentRecordId = currRow.Id;
  }

 editCurrCerReq(currRow) {
   this.bShowModal = true;
  this.isEditForm = true;
   this.currentRecordId = currRow.Id;
 
}

handleSubmit(event) {
  this.bShowModal = false;
   this.isEditForm = false;
const fields = {};
     fields[IdField.fieldApiName] = this.currentRecordId;
   fields[name_f.fieldApiName] = event.detail.fields.Name;
  fields[crt_f.fieldApiName] = event.detail.fields.Certification__c;
    fields[emp_f.fieldApiName] = event.detail.fields.Employee__c;
    fields[vouc_f.fieldApiName] = event.detail.fields.Voucher__c;
     fields[due_f.fieldApiName] = event.detail.fields.Due_Date__c;
  fields[stat_f.fieldApiName] = event.detail.fields.Status__c;
  fields[email_f.fieldApiName] = event.detail.fields.Email_of_Emp__c;
    fields[comm_f.fieldApiName] = event.detail.fields.Comments__c;

const recordInp = {fields};

  updateRecord(recordInp)
  .then(() => {
      this.dispatchEvent(new ShowToastEvent({
           title: 'Success',
     message: 'Certification Request Updated !',
            variant: 'success'
     
   }));
          return refreshApex(this.CertificationRequest);
      })
.catch((error) => {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error',
        message: 'Error updating the Certification Request',
       variant: 'error'
      
  }));
   console.log('Error');
  
  });
}
deleteCerReq(curRow) {
     deleteRecord(curRow.Id)
     .then(result=> {
        this.dispatchEvent(new ShowToastEvent({
          title: 'Deleted',
  message: 'Request Record Deleted !',
    variant: 'success'
          }));
          return refreshApex(this.refreshTable);
          
      })
.catch(error => {
      this.dispatchEvent(new ShowToastEvent({
       title: 'Deleted Error',
        message: 'An Unexpected Error occured while deleting',
       variant: 'error'
     })
     );
     console.log('Error');
  });
 
}
}
