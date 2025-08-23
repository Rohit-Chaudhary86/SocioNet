import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import appwriteService from "../appwrite/conf.js";

export default function RTE({ name = "content", label, value, onChange }) {
  const editorRef = useRef(null);

  return (
    <div className="w-full mb-4">
      {label && <label className="inline-block mb-2 pl-1 font-semibold">{label}</label>}
      <Editor
        apiKey="oad3dgevalzu5toiz00n5yd40bn77fzah51y7skg0qbuqfyf" // Replace with your actual API key
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value || ""}
        onEditorChange={onChange}
        init={{
          height: 400,
          menubar: true,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image media link | removeformat | help",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; padding:10px; }",
          branding: false,
          images_upload_handler: async (blobInfo, success, failure) => {
            try {
              const file = blobInfo.blob();
              const response = await appwriteService.uploadFile(file, ["read('any')"]);
              const fileId = response.$id;
              const fileUrl = appwriteService.getFilePreview({ fileId })?.href;
              success(fileUrl);
            } catch (error) {
              failure("Image upload failed: " + error.message);
            }
          },
        }}
      />
    </div>
  );
}