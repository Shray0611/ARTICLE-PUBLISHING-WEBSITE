import React, { useState, useRef, useMemo, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const ArticleEditor = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [council, setCouncil] = useState("");
  const [section, setSection] = useState("");
  const [designer, setDesigner] = useState("");
  const [content, setContent] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ header: [1, 2, 3, 4, false] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ color: [] }, { background: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: handleImageInsert,
        },
      },
    }),
    []
  );

  useEffect(()=>{
    const auth = localStorage.getItem("token");
    if(!auth){
      navigate('/signin');
    }
  }, [navigate])

  async function handleImageInsert() {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        alert("Image size exceeds 5MB limit.");
        return;
      }

      const formData = new FormData();
      formData.append("image", file);
      
      // const baseURL = import.meta.env.MODE === 'development' ? "http://localhost:5000" : "/";
      const baseURL = "https://easyarticle.vercel.app/";

      try {
        const response = await fetch(`${baseURL}/upload-image`, {
          method: "POST",
          body: formData,
        });

        
        if (response.ok) {
          const { _id } = await response.json();
          const imageUrl = `${baseURL}/get-image/${_id}`;
          console.log(imageUrl);

          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();
          if (range) {
            quill.insertEmbed(range.index, "image", imageUrl);
          }
        } else {
          alert("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("An error occurred while uploading the image.");
      }
    };
  }

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => setCoverPhoto(reader.result.split(",")[1]); // Remove `data:image/...;base64,`
      reader.readAsDataURL(file);
    } else {
      alert("Please select an image smaller than 5MB.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // const formData = new FormData();
    // formData.append("coverphoto", file); // File object from an <input type="file" />
    // formData.append("title", title);
    // formData.append("author", author);
    // formData.append("content", content);
    // formData.append("council", council);
    // formData.append("section", section);
    // formData.append("designer", designer);
    try {
      const user =  JSON.parse(localStorage.getItem("user"));
      const userId = user._id;

      const response = await fetch("http://localhost:5000/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          council,
          section,
          designer,
          content,
          coverphoto: coverPhoto,
          userId,
        }),
      });
      console.log(
        title,
        author,
        council,
        section,
        designer,
        content,
        coverPhoto,
        userId
      );

      if (response.ok) {
        alert("Article created successfully!");
        setTitle("");
        setAuthor("");
        setCouncil("");
        setSection("");
        setDesigner("");
        setContent("");
        setCoverPhoto(null);
      } else {
        alert("Failed to create article :");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("A network error occurred while creating the article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create an Article
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
            />
          </div>

          {/* Author */}
          <div className="mb-4">
            <label
              htmlFor="author"
              className="block text-sm font-medium text-gray-700"
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
            />
          </div>

          {/* Council */}
          <div className="mb-4">
            <label
              htmlFor="council"
              className="block text-sm font-medium text-gray-700"
            >
              Council
            </label>
            <input
              type="text"
              id="council"
              value={council}
              onChange={(e) => setCouncil(e.target.value)}
              className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
            />
          </div>

          {/* Section */}
          <div className="mb-4">
            <label
              htmlFor="section"
              className="block text-sm font-medium text-gray-700"
            >
              Section
            </label>
            <select
              id="section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
            >
              <option value="" disabled>Select a section</option>
              <option value="achievements">Achievements</option>
              <option value="tech-upskilling">Tech-Upskilling</option>
              <option value="tech-competitions">Tech-Competitions</option>
              <option value="extracurriculars">Extracurriculars</option>
              <option value="my society, my responsibility">My Society, My Responsibility</option>
              <option value="featured">Featured</option>
            </select>
          </div>

          {/* Designer */}
          <div className="mb-4">
            <label
              htmlFor="designer"
              className="block text-sm font-medium text-gray-700"
            >
              Designer
            </label>
            <input
              type="text"
              id="designer"
              value={designer}
              onChange={(e) => setDesigner(e.target.value)}
              className="mt-1 p-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
            />
          </div>

          {/* Cover Photo */}
          <div className="mb-4">
            <label
              htmlFor="coverPhoto"
              className="block text-sm font-medium text-gray-700"
            >
              Cover Photo
            </label>
            <input
              type="file"
              id="coverPhoto"
              onChange={handleCoverPhotoChange}
              accept="image/*"
              className="mt-1 block w-full text-sm text-gray-500"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700"
            >
              Content
            </label>
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              modules={modules}
              theme="snow"
              className="mt-2"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white py-3 rounded-md text-lg font-semibold`}
          >
            {isSubmitting ? "Publishing..." : "Publish Article"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArticleEditor;
