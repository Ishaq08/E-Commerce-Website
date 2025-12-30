import React from 'react';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, error }) => {
if (loading) {
  return <p>Loading...</p>;
}
  if (error) {
   return <p>Error: {error} </p>
 }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6   ">
      {products.map((product) => {
        const image =
          product.images &&
          Array.isArray(product.images) &&
          product.images.length > 0
            ? product.images[0]
            : null;
        const imageUrl = image && image.url && typeof image.url === 'string' && image.url.trim() !== '' ? image.url : null;
        const altText = image ? image.altText || product.name : product.name;

        return (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block"
          >
            <div className="bg-white p-4 rounded-lg">
              <div className="w-full h-96 mb-4">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={altText}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <h3 className="text-sm mb-2">{product.name}</h3>
              <p className="text-gray-500 font-medium text-sm tracking-tight">
                ${product.price}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
