import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import appwriteService from "../../appwrite/conf.js";
import { useSelector } from "react-redux";
import { Button, Input, RTE, Select, Container } from "../index.js";
import { toast } from "react-toastify";

export default function PostForm({ post }) {
  const { control, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
      featuredImage: post?.featuredimage || "",
    },
  });
  
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing] = useState(!!post);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const titleValue = watch("title");
  
  useEffect(() => {
    if (!isEditing && titleValue) {
      const newSlug = slugTransform(titleValue);
      setValue("slug", newSlug);
    }
  }, [titleValue, isEditing, setValue]);

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");
    }
    return "";
  }, []);

  const handleTitleChange = (value) => {
    setValue("title", value);
    if (!isEditing) {
      setValue("slug", slugTransform(value));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && !["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"].includes(selectedFile.type)) {
      toast.error("Please upload a valid image (PNG, JPG, JPEG, WEBP, GIF)");
      return;
    }
    setFile(selectedFile);
  };

  const submit = async (data) => {
    if (!userData?.$id) {
      toast.error("You must be logged in to create a post");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      let fileId = data.featuredImage;
      if (file) {
        const uploadedFile = await appwriteService.uploadFile(file, ["read('any')"]);
        if (!uploadedFile) throw new Error("File upload failed");
        fileId = uploadedFile.$id;
        if (post?.featuredimage && post.featuredimage !== fileId) {
          await appwriteService.deleteFile(post.featuredimage).catch((err) =>
            console.error("Failed to delete old file:", err)
          );
        }
      }
      if (!fileId) throw new Error("No featured image provided");

      const postData = {
        ...data,
        featuredImage: fileId,
        userId: userData.$id,
      };

      if (post) {
        const dbPost = await appwriteService.updatePost(post.$id, postData);
        if (dbPost) {
          toast.success("Post updated successfully");
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        const dbPost = await appwriteService.createPost(postData);
        if (dbPost) {
          toast.success("Post created successfully");
          navigate(`/post/${dbPost.$id}`);
        }
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("Failed to submit post: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = file 
    ? URL.createObjectURL(file)
    : getValues("featuredImage") 
      ? appwriteService.getFileView(getValues("featuredImage")) 
      : null;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Title *
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="Catchy title that grabs attention"
                  value={field.value}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                {error && <p className="mt-1 text-sm text-red-400">{error.message}</p>}
              </div>
            )}
          />
          
          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Slug {isEditing && "(Cannot be changed)"}
                </label>
                <input
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  placeholder="URL-friendly slug"
                  value={field.value}
                  onChange={(e) => setValue("slug", e.target.value)}
                  disabled={isEditing}
                  title={isEditing ? "Slug cannot be changed when editing" : ""}
                />
              </div>
            )}
          />
          
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={({ field, fieldState: { error } }) => (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Content *
                </label>
                <RTE
                  value={field.value}
                  onChange={field.onChange}
                />
                {error && <p className="mt-1 text-sm text-red-400">{error.message}</p>}
              </div>
            )}
          />
        </div>
        
        <div className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
            <h3 className="text-white font-medium mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Featured Image
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">Upload an image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700/70 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/png,image/jpg,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
            
            {/* Image Previews */}
            {(previewUrl || getValues("featuredImage")) && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">Preview:</p>
                <div className="relative group">
                  <img
                    src={previewUrl || appwriteService.getFileView(getValues("featuredImage"))}
                    alt="Preview"
                    className="rounded-lg w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {file && (
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Status Selector */}
          <Controller
            name="status"
            control={control}
            rules={{ required: "Status is required" }}
            render={({ field, fieldState: { error } }) => (
              <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Publication Status
                </h3>
                <select
                  className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  value={field.value}
                  onChange={(e) => setValue("status", e.target.value)}
                >
                  <option value="active">Published</option>
                  <option value="inactive">Draft</option>
                </select>
                {error && <p className="mt-1 text-sm text-red-400">{error.message}</p>}
              </div>
            )}
          />
          
          {/* Action Buttons */}
          <div className="bg-gray-800/50 p-5 rounded-xl border border-gray-700">
            <h3 className="text-white font-medium mb-4">Ready to share?</h3>
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition flex items-center justify-center disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {post ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>
                    {post ? "Update Post" : "Publish Post"}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="w-full py-2.5 px-4 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-500 transition"
              >
                Save as Draft
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full py-2.5 px-4 bg-transparent text-gray-300 font-medium rounded-lg hover:bg-gray-700/50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}