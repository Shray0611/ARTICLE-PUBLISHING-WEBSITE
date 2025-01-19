import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewArticle = () => {
  const [article, setArticle] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    getArticleById();
  }, []);

  const getArticleById = async () => {
    try {
      const baseURL = import.meta.env.MODE === 'development' ? "http://localhost:5000" : "/";
      const response = await fetch(`http://localhost:5000/article/${id}`);
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error("Error fetching the article:", error);
    }
  };

  if (!article) {
    return <div className="text-center text-gray-500 mt-10">Loading...</div>;
  }

  return (
    <div className="flex justify-center py-10 px-4">
      <div className="max-w-4xl w-full p-8 bg-white">
        {/* Article Title */}
        <div className="border-b border-gray-300 pb-4 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">{article.title}</h1>
          <div className="flex justify-between text-sm text-gray-500">
            {article.council && <span><strong>Council:</strong> {article.council}</span>}
            {article.section && <span><strong>Section:</strong> {article.section}</span>}
          </div>
        </div>

        {/* Article Content */}
        <div
          className="prose prose-lg prose-gray mb-8"
          dangerouslySetInnerHTML={{ __html: article.content }}
        ></div>

        {/* Author and Designer */}
        <div className="text-sm text-gray-500 mt-6 pt-4 border-t border-gray-300">
          <p>
            <strong>Author:</strong> {article.author}
          </p>
          {article.designer && (
            <p>
              <strong>Designer:</strong> {article.designer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewArticle;
