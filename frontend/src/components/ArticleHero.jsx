import React, { useEffect, useState } from "react";

const ArticleHero = () => {
  const [heroArticles, setHeroArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getHeroArticles();
  }, []);

  useEffect(() => {
    if (heroArticles.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroArticles.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [heroArticles]);

  const getHeroArticles = async () => {
    try {
      const baseURL = import.meta.env.MODE === 'development' ? "http://localhost:5000" : "/";
      const response = await fetch(`${baseURL}/articles`);
      const data = await response.json();
      const filteredData = data.filter(
        (article) =>
          article.section === "achievements" ||
          article.section === "my society, my responsibility"
      );
      setHeroArticles(filteredData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setHeroArticles([]);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (heroArticles.length === 0) {
    return <div>No articles available.</div>;
  }

  return (
    <div
      id="default-carousel"
      className="relative w-full"
      data-carousel="slide"
    >
      <div className="relative w-full h-56 overflow-hidden rounded-lg md:h-96">
        {heroArticles.map((article, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-700 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={
                article.coverphoto
                  ? `data:image/jpeg;base64,${article.coverphoto}`
                  : "fallbackImageURLOrBase64String"
              }
              alt={article.title || "Article Cover"}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-4 w-full">
              <h1 className="text-white font-semibold text-5xl">{article.title}</h1>
              <p className="text-white text-base">
                <span
                  dangerouslySetInnerHTML={{
                    __html: article.content?.slice(0, 100) + "...",
                  }}
                />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Indicators for slides */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroArticles.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ArticleHero;
