import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { fetchProductDetails } from '../../redux/slices/productSlice';
import { updateProduct, createProduct } from '../../redux/slices/adminProductSclice';

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const {selectedProduct, loading, error }= useSelector((state)=> state.products)

  // Initial state for all product data fields
  const [productData, setProductData] = useState({
    name: '',
    description: '', //
    price: 0, //
    countInStock: 0, //
    sku: '', //
    category: '',
    brand: '',
    sizes: [], //
    colors: [], //
    collections: '',
    material: '',
    gender: '',
    images: []
  });

  const [uploading, setUploading ] =useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  const isEditMode = !!id;
  
  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct)
    }
  },[selectedProduct])

  // Handler for basic text/number/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }; //

  // Handler for array inputs (Sizes, Colors) which are comma-separated strings
  const handleArrayChange = (e, fieldName) => {
    const valueArray = e.target.value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0); // Ensure empty strings are filtered out

    setProductData((prevData) => ({
      ...prevData,
      [fieldName]: valueArray,
    }));
  }; //

  // Handler for image file upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload`, formData,
        {
          headers: {"Content-Type": "multipart/form-data"}
        }
      )
      setProductData((prevData) => ({
         ...prevData,
         images: [...prevData.images, {url: data.imageUrl, altText: "" }]
      }))
      setUploading(false)
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploading(false)
    }
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(updateProduct({ id, productData })).unwrap();
      } else {
        await dispatch(createProduct(productData)).unwrap();
      }
      navigate("/admin/products");
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  if(loading) return <p>Loading...</p>
  if (error) return <p>Error: { error }</p>
  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      {' '}
      {/* */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
        <Link
          to="/admin/products/new"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Add New Product
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Product Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block font-semibold mb-2">
            Product Name
          </label>{' '}
          {/* */}
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          {/* /* Description * / */}
          <label htmlFor="description" className="block font-semibold mb-2">
            Description
          </label>{' '}
          {/* */}
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />{' '}
          {/* */}
        </div>

        {/* Price */}
        <div className="mb-6">
          {/* /* Price * / */}
          <label htmlFor="price" className="block font-semibold mb-2">
            Price
          </label>{' '}
          {/* */}
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />{' '}
          {/* */}
        </div>

        {/* Count in Stock */}
        <div className="mb-6">
          {/* /* Count in stock * / */}
          <label htmlFor="countInStock" className="block font-semibold mb-2">
            Count in Stock
          </label>{' '}
          {/* */}
          <input
            type="number"
            id="countInStock"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />{' '}
          {/* */}
        </div>

        {/* SKU */}
        <div className="mb-6">
          {/* /* SKU * / */}
          <label htmlFor="sku" className="block font-semibold mb-2">
            SKU
          </label>{' '}
          {/* */}
          <input
            type="text"
            id="sku"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />{' '}
          {/* */}
        </div>

        {/* Sizes (Comma-separated) */}
        <div className="mb-6">
          {/* /* Sizes * / */}
          <label htmlFor="sizes" className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>{' '}
          {/* */}
          <input
            type="text"
            id="sizes"
            name="sizes"
            value={productData.sizes.join(', ')}
            onChange={(e) => handleArrayChange(e, 'sizes')}
            className="w-full border border-gray-300 rounded-md p-2"
          />{' '}
          {/* */}
        </div>

        {/* Colors (Comma-separated) */}
        <div className="mb-6">
          {/* /* Colors * / */}
          <label htmlFor="colors" className="block font-semibold mb-2">
            Colors (comma-separated)
          </label>{' '}
          {/* */}
          <input
            type="text"
            id="colors"
            name="colors"
            value={productData.colors.join(', ')}
            onChange={(e) => handleArrayChange(e, 'colors')}
            className="w-full border border-gray-300 rounded-md p-2"
          />{' '}
          {/* */}
        </div>

        {/* Category, Brand, Collection, Material, Gender (Placeholders for other fields) */}
        {/* ... similar input fields can be added here for category, brand, etc. ... */}

        {/* Image Upload Input */}
        <div className="mb-6">
          {/* /* Image Upload * / */}
          <label htmlFor="imageUpload" className="block font-semibold mb-2">
            Upload Image
          </label>{' '}
          {/* */}
          <input
            type="file"
            id="imageUpload"
            name="image"
            onChange={handleImageUpload}
            className=" p-2 border rounded"
          />{' '}
          {/* */}
        </div>

        {/* Display Current Images (Simplified) */}
        <div className="mb-6 flex space-x-4">
          {productData.images.map((img, index) => (
            <img
              key={index}
              src={img.url}
              alt={`Product ${index + 1}`}
              className="w-24 h-24 object-cover border rounded-md"
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className=" w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
