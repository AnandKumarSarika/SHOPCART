import React, { useEffect, useState } from 'react';
import FilterProduct from './FilterProduct';
import CardFeature from './CardFeature';
import { useSelector } from 'react-redux';

const Allproduct = ({ heading }) => {
  const productData = useSelector((state) => state.product.productList);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    applyFilters();
  }, [productData, selectedCategory, selectedPriceRange, searchQuery]);

  // Define categoryList based on productData
  const categoryList = [...new Set(productData.map((el) => el.category))];

  const applyFilters = () => {
    setLoadingProducts(true);

    try {
      let filtered = productData;

      // Apply category filter if selected
      if (selectedCategory) {
        filtered = filtered.filter(
          (el) => el.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      // Apply price range filter if selected
      if (selectedPriceRange) {
        const [minPrice, maxPrice] = selectedPriceRange.split('-');
        filtered = filtered.filter(
          (el) => parseFloat(el.price) >= parseFloat(minPrice) && parseFloat(el.price) <= parseFloat(maxPrice)
        );
      }

      // Apply search query filter if entered
      if (searchQuery) {
        filtered = filtered.filter(
          (el) =>
            el.name.toLowerCase().includes(searchQuery) ||
            el.category.toLowerCase().includes(searchQuery)
        );
      }

      setFilteredProducts(filtered);
    } catch (error) {
      setError('An error occurred while filtering products.');
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <div className="my-4">
      <h2 className="font-bold text-2xl text-slate-700 mb-4">{heading}</h2>

      <div className="flex gap-4 justify-center overflow-scroll scrollbar-none">
        {productData.length > 0 ? (
          categoryList.map((el) => (
            <FilterProduct
              category={el}
              onClick={() => setSelectedCategory(el)}
              key={el}
              isActive={el.toLowerCase() === selectedCategory.toLowerCase()}
            />
          ))
        ) : (
          <div className="min-h-[110px] flex justify-center items-center">
            <p>Loading...</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-start mb-4" style={{ marginLeft: '60px' }}>
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border border-gray-300 rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-start mb-4" style={{ marginLeft: '60px' }}>
        <select
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="">Select Price Range</option>
          <option value="100 - 1000">100 - 1000</option>
          <option value="1001-2000">1001 - 2000</option>
          <option value="2001-3000">2001 - 3000</option>
          <option value="3001-4000">3001 - 4000</option>
          <option value="4001-10000">4001 - 10000</option>


          {/* Add more price ranges as needed */}
        </select>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {loadingProducts && <p>Loading products...</p>}
        {error && <p>Error: {error}</p>}
        {!loadingProducts && !error && filteredProducts.length === 0 && (
          <p>No products found.</p>
        )}
        {!loadingProducts &&
          !error &&
          filteredProducts.map((el) => (
            <CardFeature
              key={el._id}
              id={el._id}
              name={el.name}
              category={el.category}
              price={el.price}
              image={el.image}
            />
          ))}
      </div>
    </div>
  );
};

export default Allproduct;
