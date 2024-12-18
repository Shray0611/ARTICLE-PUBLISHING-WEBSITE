import React, { useEffect, useState } from "react";

const ArticleHero = () => {
    const [heroArticles, setHeroArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getHeroArticles();
    }, []);

    const getHeroArticles = async () => {
        try {
            let response = await fetch("http://localhost:5000/articles");
            let data = await response.json();
            const filteredData = data.filter(article =>
                article.section === "achievements" ||
                article.section === "my society, my responsibility"
            );
            setLoading(false);
        } catch (error) {
            console.log("Error fetching articles:", error);
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
        <div id="default-carousel" className="relative w-full" data-carousel="slide">
            <div className="relative w-full h-56 overflow-hidden rounded-lg md:h-96">
                {heroArticles.map((article, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === 0 ? 'opacity-100' : 'opacity-0'}`}
                        data-carousel-item
                    >
                        <img
                            src={`data:image/jpeg;base64,${article.photos[0]?.photo}`}
                            className="absolute w-full h-full object-cover"
                            alt={article.title}
                        />
                        <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent p-4">
                            <h1 className="text-white font-semibold">{article.title}</h1>
                            <p className="text-white text-sm">{article.content.slice(0, 100)}...</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider indicators */}
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
                {heroArticles.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${index === 0 ? 'bg-white' : 'bg-gray-400'}`}
                        aria-current={index === 0}
                        aria-label={`Slide ${index + 1}`}
                        data-carousel-slide-to={index}
                    ></button>
                ))}
            </div>

            {/* Slider controls */}
            <button
                type="button"
                className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-prev
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                    <svg
                        className="w-4 h-4 text-white/30"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                    >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>
            <button
                type="button"
                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                data-carousel-next
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50">
                    <svg
                        className="w-4 h-4 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 6 10"
                    >
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div>
    );
};

export default ArticleHero;
