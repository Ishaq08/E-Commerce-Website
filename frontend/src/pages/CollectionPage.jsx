import React, { useEffect, useRef, useState } from 'react'
import { FaFilter } from 'react-icons/fa';
import FilterSidebar from '../components/Products/FilterSidebar';
import ShortOptions from '../components/Products/ShortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../redux/slices/productSlice';


const CollectionPage = () => {
    const { collection } = useParams();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state)=>state.products)
    const queryParams = Object.fromEntries([...searchParams])

    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const SidebarRef = useRef(null)

    useEffect(() => {
        dispatch(fetchProductsByFilters({collection, ...queryParams}))
    }, [dispatch, collection , searchParams])

    const toggleSidebar = () => {
        setIsSideBarOpen(!isSideBarOpen)
    }
    const handleClickOutSide = (e) => {
        //close side if clicked outside
        if (SidebarRef.current && !SidebarRef.current.contains(e.target)) {
            setIsSideBarOpen(false)
        }
    };
    useEffect(() => {
        //Add Event Listener for clicks
        document.addEventListener("mousedown", handleClickOutSide)
        //Clean up Event Listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutSide)
        }
    }, [])
   
 return (
   <div className="flex flex-col lg:flex-row">
     {/* Mobile Filter Button */}
         <button
             onClick={ toggleSidebar}
             className="lg:hidden border p-2 flex justify-center items-center">
       <FaFilter className="mr-2" />
     </button>

     {/* Filter Sidebar */}
         <div ref={SidebarRef} className={`${isSideBarOpen ? "translate-x-0" : "-translate-x-full"} fixed 
         inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}>
             <FilterSidebar />
         </div>
         <div className="flex-grow p-4">
             <h2 className="text-2xl uppercase mb-4">
                 All Collection
             </h2>
             {/* Sort options */}
             <ShortOptions />
             {/* Product Grid */}
             <ProductGrid  products={products} loading={loading} error={error}/>
         </div>
   </div>
 );
}

export default CollectionPage 