import React, {useState} from "react";

const ScrollableNavbar = ({ setSelectedSection }) => {
    const scrollContainerRef = React.useRef(null);
    const [selectedButton, setSelectedButton] = useState(null);

    const handleButtonClick = (section, index) => {
        section = section.toLowerCase(); // Corrected method
        console.log(section);
        
        setSelectedSection(section); // Update the selected section
        setSelectedButton(index);
    };    

    return (
        <div className="relative w-3/5 mx-auto mt-10">

            {/* Scrollable Navbar */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scrollbar-hide space-x-4 items-center px-4"
            >
                {["Achievements", "Tech-Upskilling", "Tech-Competitions", "Extracurriculars", "My Society, My Responsibilty", "Featured"].map((text, index) => (
                    <button
                        key={index}
                        onClick={() => handleButtonClick(text, index)} // Pass the section name
                        className={`${
                            selectedButton === index
                                ? "border-2 border-blue-500"
                                : ""
                        } bg-white bg-opacity-50 hover:bg-opacity-75 text-black py-2 px-4 rounded transition-all duration-200`}
                    >
                        {text}
                    </button>
                ))}
            </div>

        </div>
    );
};

export default ScrollableNavbar;
