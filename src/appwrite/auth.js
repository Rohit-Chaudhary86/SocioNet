import config from "../configration/config.js"

import {Client,Account,ID} from "appwrite"

export class AuthService{
    client=new Client();
    account;
    constructor(){
        this.client
             .setEndpoint(config.appwriteUrl)
             .setProject(config.appwriteProjectId)
        this.account=new Account(this.client)
    }
   //Appwrite services 
   async createAccount({email,password,name}){
    try {
        const userAccount=await this.account.create(ID.unique(),email,password,name)
        if(userAccount){
           return this.login({email,password})
        }else{
            return userAccount
        }
    } catch (error) {
        throw error;
    }
   }
   async login({email,password}){
      try {
        return await this.account.createEmailPasswordSession(email,password)
      } catch (error) {
        throw  error
      }
   }
  async getCurrentUser() {
  try {
    return await this.account.get();
  } catch (error) {
    console.log("No active session:", error.message);
    return null;
  }
}

  async logout(){
    try {
        await this.account.deleteSessions()
    } catch (error) {
        throw error
    }
  }

  async  listFiles() {
  try {
    const files = await storage.listFiles('689d5ca10038d4ddf868');
    console.log("Bucket files:", files.files.map(file => ({
      $id: file.$id,
      name: file.name,
      size: file.sizeOriginal,
      created: new Date(file.$createdAt).toLocaleString(),
    })));
  } catch (error) {
    console.error("Error listing files:", error);
  }
}
// ADD THIS NEW METHOD:
  getFileView(fileId) {
    if (!fileId) {
      console.error("getFileView: fileId is missing");
      return null;
    }
    try {
      const view = this.bucket.getFileView(config.appwriteBucketId, fileId);
      const url = view instanceof URL ? view.toString() : view;
      console.log("getFileView response:", url);
      return url;
    } catch (error) {
      console.error("getFileView error:", error);
      return null;
    }
  }
}
//listFiles();
const authService=new AuthService();
export default authService;