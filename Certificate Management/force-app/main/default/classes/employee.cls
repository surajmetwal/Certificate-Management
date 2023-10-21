public with sharing class employee {
    public employee() {}
   //  @AuraEnabled
   //  public static void empinsert(String name,Double id , String email,String pskill ,String comp,String seskill,String expr,String cert,Boolean req,Boolean sendres, String results,String img){
   //  Employee__c emp=new Employee__c(Name=name,Emp_ID__c=id,Email__c=email,Primary_Skill__c=pskill,Company_Name__c=comp,Secondary_Skill__c=seskill,Experience__c=expr,Certification__c=cert,Request_for_voucher__c=req,Send_result_of_certification_course__c=sendres,Final_result__c=results,Photo__c=img);
   //  insert emp;
   //  }
     @AuraEnabled(cacheable=true)
     public static List<Employee__c> response(){
        return [select Name,Email__c ,Company_Name__c,Emp_ID__c from Employee__c ];
     }

}
