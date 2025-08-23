import config from "../configration/config.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    console.log("Creating post with data:", { title, slug, content, featuredImage, status, userId });
    try {
      if (!title || !content || !featuredImage || !userId) {
        throw new Error("Missing required fields: title, content, featuredimage, or userId");
      }
      const document = await this.databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredimage: featuredImage,
          status,
          userId,
        }
      );
      console.log("Post created:", document);
      return document;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    console.log("Updating post with data:", { slug, title, content, featuredImage, status });
    try {
      if (!title || !content || !featuredImage) {
        throw new Error("Missing required fields: title, content, or featuredimage");
      }
      const document = await this.databases.updateDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredimage: featuredImage,
          status,
        }
      );
      console.log("Post updated:", document);
      return document;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  }

  async deletePost(slug) {
  try {
    await this.databases.deleteDocument(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      slug
    );
    console.log("Post deleted:", slug);
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

async deleteFile(fileId) {
  try {
    await this.bucket.deleteFile(config.appwriteBucketId, fileId);
    console.log("File deleted:", fileId);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

  async getPost(documentId, { signal } = {}) {
    if (!documentId) {
      console.error("getPost: documentId is missing");
      throw new Error("Missing required parameter: documentId");
    }
    try {
      const post = await this.databases.getDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        documentId,
        [],
        { signal }
      );
      console.log("Post retrieved:", post);
      return post;
    } catch (error) {
      console.error("Error retrieving post:", error);
      throw error;
    }
  }

  async getPosts(queries = [Query.equal("status", "active")], { signal } = {}) {
    try {
      const response = await this.databases.listDocuments(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        queries,
        { signal }
      );
      console.log("Posts retrieved (AllPosts):", response);
      return response;
    } catch (error) {
      console.error("Error retrieving posts:", error);
      throw error;
    }
  }

  async uploadFile(file) {
    try {
      const response = await this.bucket.createFile(
        config.appwriteBucketId,
        ID.unique(),
        file
      );
      console.log("File uploaded:", response);
      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(config.appwriteBucketId, fileId);
      console.log("File deleted:", fileId);
      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

getFilePreview(fileId) {
  if (!fileId) {
    console.error("getFilePreview: fileId is missing");
    return null;
  }
  try {
    const preview = this.bucket.getFilePreview(config.appwriteBucketId, fileId);
    
    // Convert URL object to string if needed
    const url = preview instanceof URL ? preview.toString() : preview;
    
    console.log("getFilePreview called with:", { 
      bucketId: config.appwriteBucketId, 
      fileId 
    });
    console.log("getFilePreview response:", url);
    
    return url;
  } catch (error) {
    console.error("getFilePreview error:", error);
    return null;
  }
}

// In your Service class in conf.js, add this method:
getFileView(fileId) {
  // DEBUG: Check what's being passed
  console.log("getFileView received:", fileId, "Type:", typeof fileId);
  
  // Extract the actual file ID if an object is passed
  let actualFileId = fileId;
  
  if (typeof fileId === 'object' && fileId !== null) {
    // Handle different possible object structures
    actualFileId = fileId.$id || fileId.fileId || fileId.id || fileId.featuredimage;
    
    // If we still have an object, try to stringify or get the first property
    if (typeof actualFileId === 'object') {
      console.error("Nested object passed to getFileView:", fileId);
      return null;
    }
  }
  
  if (!actualFileId) {
    console.error("getFileView: fileId is missing or invalid", fileId);
    return null;
  }
  
  try {
    const view = this.bucket.getFileView(config.appwriteBucketId, actualFileId);
    const url = view instanceof URL ? view.toString() : view;
    console.log("getFileView successful for:", actualFileId);
    return url;
  } catch (error) {
    console.error("getFileView error:", error);
    return null;
  }
}

}

const service = new Service();
export default service;
// import { Client, Storage, Databases } from "appwrite";

// const client = new Client()
//   .setEndpoint("https://fra.cloud.appwrite.io/v1")
//   .setProject("689c8591000a078faac9");

// const storage = new Storage(client);
// const databases = new Databases(client);

// class AppwriteService {
//   async uploadFile(file, permissions = ["read('any')"]) {
//     try {
//       const response = await storage.createFile(
//         "689d5ca10038d4ddf868", // Bucket ID
//         "unique()", // File ID
//         file,
//         permissions
//       );
//       console.log("File uploaded:", response);
//       return response;
//     } catch (error) {
//       console.error("Appwrite uploadFile error:", error);
//       throw error;
//     }
//   }

//   getFilePreview({ bucketId, fileId }) {
//     try {
//       const url = storage.getFilePreview(
//         bucketId || "689d5ca10038d4ddf868",
//         fileId
//       );
//       console.log("getFilePreview called with:", { bucketId, fileId });
//       console.log("getFilePreview response:", url.href);
//       return url;
//     } catch (error) {
//       console.error("Appwrite getFilePreview error:", error);
//       return null;
//     }
//   }

//   async deleteFile(fileId) {
//     try {
//       return await storage.deleteFile("689d5ca10038d4ddf868", fileId);
//     } catch (error) {
//       console.error("Appwrite deleteFile error:", error);
//       throw error;
//     }
//   }

//   async createPost(postData) {
//     try {
//       const response = await databases.createDocument(
//         "your-database-id", // Replace with your database ID
//         "your-collection-id", // Replace with your collection ID
//         "unique()",
//         postData,
//         ["read('any')", "write('users')"]
//       );
//       console.log("Post created:", response);
//       return response;
//     } catch (error) {
//       console.error("Appwrite createPost error:", error);
//       throw error;
//     }
//   }

//   async updatePost(postId, postData) {
//     try {
//       const response = await databases.updateDocument(
//         "your-database-id", // Replace with your database ID
//         "your-collection-id", // Replace with your collection ID
//         postId,
//         postData
//       );
//       console.log("Post updated:", response);
//       return response;
//     } catch (error) {
//       console.error("Appwrite updatePost error:", error);
//       throw error;
//     }
//   }

//   async getPost(slug) {
//     try {
//       const response = await databases.getDocument(
//         "your-database-id", // Replace with your database ID
//         "your-collection-id", // Replace with your collection ID
//         slug
//       );
//       console.log("Post retrieved:", response);
//       return response;
//     } catch (error) {
//       console.error("Appwrite getPost error:", error);
//       return null;
//     }
//   }

//   // Add other methods as needed (e.g., getPosts for AllPosts.jsx)
// }

// export default new AppwriteService();