import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SortOptions = () => {
  // Destructure searchParams (read) and setSearchParams (write)
  const [searchParams, setSearchParams] = useSearchParams();

  // Function to handle the change event in the <select> dropdown
  const handleSortChange = (e) => {
    const sortBy = e.target.value;

    // Set the "sortBy" parameter in the local searchParams object
    searchParams.set('sortBy', sortBy);

    // If the value is an empty string (the "Default" option),
    // remove the 'sortBy' parameter entirely from the URL for cleaner query strings.
    if (sortBy === '') {
      searchParams.delete('sortBy');
    }

    // Update the URL with the modified searchParams
    setSearchParams(searchParams);
  };

  return (
    // Tailwind classes: mb-4 (margin-bottom), flex items-center (alignment), justify-end (align right)
    <div className="mb-4 flex items-center justify-end">
      <select
        id="sort"
        onChange={handleSortChange}
        // Read the current "sortBy" parameter from the URL. If it's not present, use "" (default option).
        value={searchParams.get('sortBy') || ''}
        // Tailwind classes for styling the dropdown
        className="border p-2 rounded-md focus:outline-none"
      >
        <option value="">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
// Note: The original image code didn't have the 'export default',
// but it is necessary for using the component in a larger application.
