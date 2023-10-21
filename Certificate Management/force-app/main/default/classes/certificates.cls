public with sharing class certificates {
    public certificates() {}

    @AuraEnabled(cacheable=true)
    
    public static List<Certification__c> getall() {
        List<Certification__c> m2= [select Name,Cost__c from Certification__c] ;
        return m2;
    }
  
}
