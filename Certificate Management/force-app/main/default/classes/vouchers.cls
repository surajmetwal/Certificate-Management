public with sharing class vouchers {
    public vouchers() {}


    @AuraEnabled(cacheable=true)
    public static List<Voucher__c> vr(){
        List<Voucher__c> m=[select Name, Voucher_Cost__c,Active__c,Voucher_used__c,Validity__c from Voucher__c];
        return m;
    }
}
