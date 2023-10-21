public with sharing class request {
    public request() {}

    @AuraEnabled(cacheable=true)
    public static List<Certification_Request__c> getRe(){
        return [select Certification__r.Name,Name,Employee__r.Name,	Voucher__r.Name,Due_Date__c,Email_of_Emp__c,Status__c from Certification_Request__c];
    }
   
}
