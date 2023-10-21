import { LightningElement ,wire} from 'lwc';
import fetchedRecord from '@salesforce/apex/vouchers.vr';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import {deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import IdField from '@salesforce/schema/Voucher__c.Id';
import voc from '@salesforce/schema/Voucher__c';
import vName_f from '@salesforce/schema/Voucher__c.Name';
import vCert_f from '@salesforce/schema/Voucher__c.Certification__c';
import vVal_f from '@salesforce/schema/Voucher__c.Validity__c';
import vAct_f from '@salesforce/schema/Voucher__c.Active__c';
import vUse_f from '@salesforce/schema/Voucher__c.Voucher_used__c';
import vCos_f from '@salesforce/schema/Voucher__c.Voucher_Cost__c';

const actions = [
    { label: 'View', name: 'View' },
   { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
  ];

export default class Vouchers extends LightningElement {
    vt=false;
    isEditForm = false;
bShowModal = false;
currentRecordId;
data1;
board=false;
col=[
    {label:'Voucher Name',fieldName:'Name',type:'text'},
    {label:'Cost',fieldName:'Voucher_Cost__c',type:'currency'},
    {label:'Validity',fieldName:'Validity__c',type:'date'},
    {label:'Active',fieldName:'Active__c',type:'text'},
    {label:'V-Used',fieldName:'Voucher_used__c',type:'text'},
        {
          type: 'action',
          typeAttributes: {
              rowActions: actions,
          }
      }]

objectApiName=voc;
    fieldNames=[vName_f,vCos_f,vCert_f,vVal_f,vAct_f,vUse_f];

// show data
@wire(fetchedRecord)
allData({data,error}){
if(data){
    this.data1=data;
}
else if(error){
    console.log(error);
}
}

xData(event){
this.board=!this.board;
}
hideData(event){
this.board=false;
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

handleSave(event) {
    this.bShowModal = false;
    this.isEditForm = false;
    const fields = {}; 
    fields[IdField.fieldApiName] = this.currentRecordId;
    fields[vName_f.fieldApiName] = event.detail.fields.Name;
    fields[vCos_f.fieldApiName] = event.detail.fields.Voucher_Cost__c;
    fields[vAct_f.fieldApiName] = event.detail.fields.Active__c;
    fields[vUse_f.fieldApiName]=event.detail.fields.Voucher_used__c;
    fields[vVal_f.fieldApiName]=event.detail.fields.Validity__c;

    const recordInput = {fields};

    updateRecord(recordInput)
    .then(() => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Voucher updated',
                variant: 'success'
            })
        );
        
        return refreshApex(this.allData);
    })
    .catch((error) => {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error updating',
                message:'there is error',
                variant: 'error'
            }));
    });
}
deleteCerReq(curRow) {
    deleteRecord(curRow.Id).then(() => {
       this.dispatchEvent(new ShowToastEvent({
         title: 'Deleted',
 message: 'Request Record Deleted !',
   variant: 'success'
         }));
         return refreshApex(this.allData);
         
     })
    }
    myvouch(event){
        const c=new ShowToastEvent({
            title:'Voucher Added'
        });  
        this.dispatchEvent(c);
     location.reload();
    }
     
showvat(){
    this.vt=true;
}
closevat(){
    this.vt=false;
    this.bShowModal = false;
}



}
