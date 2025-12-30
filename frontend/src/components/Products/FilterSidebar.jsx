import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

// --- FilterSidebar Component ---
const FilterSidebar = () => {
    // 1. Hooks for URL and Navigation
    const [searchParams, setSearchParams] = useSearchParams(); //
    const navigate = useNavigate(); //

    // 2. State for active filters
    const [filters, setFilters] = useState({ //
        category: "",
        gender: "",
        color: "",
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 100,
    });

    // 3. State for price range slider (Assuming default min 0 and max 100)
    const [priceRange, setPriceRange] = useState([0, 100]); //

    // 4. Filter Options Data
    const categories = ["Top Wear", "Bottom Wear"]; //
    const colors = [
        "Red", "Blue", "Black", "Green", "Yellow", "Gray", "White",
        "Pink", "Beige", "Navy",
    ]; //
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"]; //
    const materials = [
        "Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen",
        "Viscose", "Fleece",
    ]; //
    const brands = [
        "Urban Threads", "Modern Fit", "Street Style", "Beach Breeze",
        "Fashionista", "ChicStyle",
    ]; //
    const genders = ["Men", "Women"]; //

    // 5. Sync filters state with URL search parameters on load/change
    useEffect(() => {
        const params = Object.fromEntries(searchParams); //

        setFilters({
            category: params.category || "",
            gender: params.gender || "",
            color: params.color || "",
            // Parse comma-separated strings into arrays
            size: params.size ? params.size.split(",") : [], //
            material: params.material ? params.material.split(",") : [], //
            brand: params.brand ? params.brand.split(",") : [], //
            minPrice: params.minPrice ? Number(params.minPrice) : 0, //
            maxPrice: params.maxPrice ? Number(params.maxPrice) : 100, //
        });

        // Set price range state based on URL
        setPriceRange([
            params.minPrice ? Number(params.minPrice) : 0,
            params.maxPrice ? Number(params.maxPrice) : 100
        ]); //

    }, [searchParams]);

    // 6. Generic Filter Change Handler (for radio and checkbox inputs)
    const handleFilterChange = (e) => { //
        const { name, value, type, checked } = e.target; //
        let newFilters = { ...filters };

        if (type === "checkbox") { //
            if (checked) {
                // Add value to the array if checked
                newFilters[name] = [...(newFilters[name] || []), value]; //
            } else {
                // Remove value from the array if unchecked
                newFilters[name] = newFilters[name].filter(item => item !== value); //
            }
        } else {
            // For radio buttons (category, gender) or single inputs
            newFilters[name] = value; //
        }

        setFilters(newFilters); //
        // console.log(newFilters); //
        updateURLParams(newFilters); //
    };

    // 7. Handle Price Range Change (Slider)
    const handlePriceChange = (e) => { //
        const newMaxPrice = Number(e.target.value); //
        
        // Update priceRange state: min retains filters.minPrice, max becomes newMaxPrice
        setPriceRange([filters.minPrice, newMaxPrice]); //

        // Update filters state
        const newFilters = {
            ...filters,
            minPrice: filters.minPrice, 
            maxPrice: newMaxPrice //
        };
        setFilters(newFilters); //
        updateURLParams(newFilters); //
    };

    // 8. Handle Color Button Click (Special case for single-select buttons)
    const handleColorClick = (color) => { 
        // If the color is already selected, unselect it (set to ""), otherwise select it
        const newColor = filters.color === color ? "" : color;

        const newFilters = { ...filters, color: newColor };
        setFilters(newFilters);
        updateURLParams(newFilters);
    };

    // 9. Update URL Search Parameters Function
    const updateURLParams = (newFilters) => { //
        const params = new URLSearchParams(); //

        Object.keys(newFilters).forEach((key) => { //
            const value = newFilters[key];

            // Filter out default/empty values before appending to URL
            if (Array.isArray(value)) {
                if (value.length > 0) { //
                    params.append(key, value.join(",")); //
                }
            } else if (value) {
                // Single-select string filter (category, gender, color)
                params.append(key, value); //
            }
            // NOTE: The price logic from my previous response is complex and was not clearly
            // visible in the screenshots, so I'll follow the exact logic from the image for simplicity.
        });

        setSearchParams(params); //
        // navigate(`?${params.toString()}`); // (Commented out in source)
    };

    // 10. Component Render
    return (
        <div className="p-4">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Filter</h3>

            {/* --- Category Filter (Radio Buttons) --- */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Category</label> {/* */}
                {categories.map((category) => (
                    <div key={category} className="flex items-center mb-1"> {/* */}
                        <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={filters.category === category} //
                            onChange={handleFilterChange} //
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" //
                        />
                        <span className="text-gray-700">{category}</span> {/* */}
                    </div>
                ))}
            </div>

            {/* --- Gender Filter (Radio Buttons) --- */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Gender</label> {/* */}
                {genders.map((gender) => (
                    <div key={gender} className="flex items-center mb-1"> {/* */}
                        <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={filters.gender === gender} //
                            onChange={handleFilterChange} //
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" //
                        />
                        <span className="text-gray-700">{gender}</span> {/* */}
                    </div>
                ))}
            </div>

            {/* --- Color Filter (Buttons) --- */}
            <div className="mb-6">
                <label className="block text-gray-600 font-medium mb-2">Color</label> {/* */}
                <div className="flex flex-wrap gap-2"> {/* */}
                    {colors.map((color) => (
                        <button
                            key={color}
                            name="color"
                            value={color}
                            onClick={() => handleColorClick(color)}
                            className={`w-8 h-8 rounded-full border border-gray-300 cursor-pointer transition hover:scale-105 ${
                                filters.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                            }`} //
                            style={{ backgroundColor: color.toLowerCase() }} //
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* --- Size Filter (Checkboxes) --- */}
            <div className="mb-6"> {/* */}
                <label className="block text-gray-600 font-medium mb-2">Size</label> {/* */}
                {sizes.map((size) => (
                    <div key={size} className="flex items-center mb-1"> {/* */}
                        <input
                            type="checkbox"
                            name="size"
                            value={size} //
                            checked={filters.size.includes(size)} //
                            onChange={handleFilterChange} //
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" //
                        />
                        <span className="text-gray-700">{size}</span> {/* */}
                    </div>
                ))}
            </div>

            {/* --- Material Filter (Checkboxes) --- */}
            <div className="mb-6"> {/* */}
                <label className="block text-gray-600 font-medium mb-2">Material</label> {/* */}
                {materials.map((material) => (
                    <div key={material} className="flex items-center mb-1"> {/* */}
                        <input
                            type="checkbox"
                            name="material"
                            value={material} //
                            checked={filters.material.includes(material)} //
                            onChange={handleFilterChange} //
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" //
                        />
                        <span className="text-gray-700">{material}</span> {/* */}
                    </div>
                ))}
            </div>

            {/* --- Brand Filter (Checkboxes) --- */}
            <div className="mb-6"> {/* */}
                <label className="block text-gray-600 font-medium mb-2">Brand</label> {/* */}
                {brands.map((brand) => (
                    <div key={brand} className="flex items-center mb-1"> {/* */}
                        <input
                            type="checkbox"
                            name="brand"
                            value={brand} //
                            checked={filters.brand.includes(brand)} //
                            onChange={handleFilterChange} //
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300" //
                        />
                        <span className="text-gray-700">{brand}</span> {/* */}
                    </div>
                ))}
            </div>

            {/* --- Price Range Filter (Slider) --- */}
            <div className="mb-8"> {/* */}
                <label className="block text-gray-600 font-medium mb-2">Price Range</label> {/* */}
                <input
                    type="range"
                    name="priceRange"
                    min={0} //
                    max={100} //
                    value={priceRange[1]} //
                    onChange={handlePriceChange} //
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer" //
                />
                <div className="flex justify-between text-gray-600 mt-2"> {/* */}
                    <span>$0</span> {/* */}
                    <span>${priceRange[1]}</span> {/* */}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;