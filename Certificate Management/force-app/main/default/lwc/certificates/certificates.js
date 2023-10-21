import { LightningElement,wire,api} from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import fetch from '@salesforce/apex/certificates.getall';
import {deleteRecord, updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import IdField from '@salesforce/schema/Certification__c.Id';
import cert from '@salesforce/schema/Certification__c';
import N_field from '@salesforce/schema/Certification__c.Name';
import C_field from '@salesforce/schema/Certification__c.Cost__c';

const actions = [
    { label: 'View', name: 'View' },
   { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
  ];

export default class Certificates extends LightningElement {
   
    door=false;
    data1;
    isEditForm = false;
    bShowModal = false;
    currentRecordId;
  
    cols=
    [{label:'Cert Name',fieldName:'Name',type:'text'},
    {label:'Cert Cost',fieldName:'Cost__c',type:'currency'},
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
        }}
];



    @wire(fetch)
    fetchedData(result){
        if(result.data){
            this.data1=result.data;
        }
        else if(result.error){
            console.error(error);
        }
    }


// putting data 
 objectApiName=cert;
 fieldNames=[N_field,C_field];

  
closedoor(){
    this.door=false;
    this.bShowModal = false;
 }
showdat(){
    this.door=true;
}
insertdata(){
    const a=new ShowToastEvent({
        title:'Certificate Added'
    });  
    this.dispatchEvent(a);

 location.reload();
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

 handleCrt(event) {
    this.bShowModal = false;
    this.isEditForm = false;
    const fields = {}; 
    fields[IdField.fieldApiName] = this.currentRecordId;
    fields[N_field.fieldApiName] = event.detail.fields.Name;
    fields[C_field .fieldApiName] = event.detail.fields.Cost__c;
   
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
        
        return refreshApex(this.fetchedData);
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
         return refreshApex(this.fetchedData);
         
     })
    }


}