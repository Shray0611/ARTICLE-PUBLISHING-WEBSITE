import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import ScrollableNavbar from './ScrollableNavbar';
import ArticleHero from './ArticleHero';

const Articles = () => {
    const [loading, setLoading] = useState(true);
    const [articles, setArticles] = useState([]);
    const [selectedSection, setSelectedSection] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getArticles();
    }, []);

    const getArticles = async () => {
        try {
            const baseURL = import.meta.env.MODE === 'development' ? "http://localhost:5000" : "";
            const response = await fetch(`${baseURL}/articles`);
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error("Error fetching articles:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const filteredArticles = selectedSection
        ? articles.filter(article => article.section === selectedSection)
        : articles;

    if (loading) {
        return <div className="text-center mt-10 text-lg">Loading articles...</div>;
    }

    if (error) {
        return <div className="text-center mt-10 text-lg text-red-600">Error: {error}</div>;
    }

    // if (filteredArticles.length === 0) {
    //     return (
    //         <div className="text-center mt-10 text-lg">
    //             No articles found for the selected section.
    //         </div>
    //     );
    // }

    return (
        <div className="p-6 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen">
            <ArticleHero />
            <ScrollableNavbar setSelectedSection={setSelectedSection} />
            <div className='max-w-6xl w-full mx-auto'>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {(filteredArticles.length == 0)?
                <div className="text-center mt-10 text-lg">
                No articles found for the selected section.
                </div> :
                filteredArticles.map(article => (
                    <div 
                        key={article._id} 
                        className="relative bg-white shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
                        <div 
                            className="prose max-w-none p-6 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:bg-gray-200 transition-colors">
                            <img src="" alt="" />
                            <h2 className="text-2xl font-semibold mb-3 text-gray-800 group-hover:text-gray-900 transition-colors">
                                {article.title}
                            </h2>
                            <div dangerouslySetInnerHTML={{ __html: article.content.slice(0, 100) + '...' }} />
                            <button
                                onClick={() => navigate(`/viewarticle/${article._id}`)}
                                className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg hover:from-purple-600 hover:to-pink-600 transition"
                            >
                                Read More
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );
};

export default Articles;
