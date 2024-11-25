import Checkbox from 'antd/es/checkbox/Checkbox';
import Modal from 'antd/es/modal/Modal';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Product } from '../constants/constants';
interface AddProductModalProps {
  isProductAddModalOpen: boolean;
  handleAddProductModalClose: () => void;
  handleProductAdd: (product: Product[]) => void;
}

const AddProductModel: React.FunctionComponent<AddProductModalProps> = ({
  handleAddProductModalClose, // callback to close the modal
  isProductAddModalOpen, // flag to check if the modal is open
  handleProductAdd, // callback to add selected products to the product list
}) => {
  const [productList, setProductList] = useState<Product[]>([]); // list of products fetched from the server
  const [loading, setLoading] = useState(true); // flag to show loading when fetching products
  const [error, setError] = useState(''); // error message when something goes wrong
  const [currentPage, setCurrentPage] = useState<number>(1); // current page of products being fetched
  const [selectedProductCount, setSelectedProductCount] = useState<number>(0); // number of products selected
  const [searchText, setSearchText] = useState<string>(''); // text in the search box
  const [checkedItems, setCheckedItems] = useState<{
    [key: number]: Set<number>;
  }>({}); // checked items in the form {productId: Set<variantId>}

  // fetch products from the server when the modal is open
  useEffect(() => {
    fetchProducts(1, '');
  }, [isProductAddModalOpen]);

  /**
   * fetches products from server and updates the state
   * @param {number} page - page number to fetch
   * @param {string} text - search text
   */
  const fetchProducts = async (page: number, text: string) => {
    // show loading when fetching products
    setLoading(true);
    // reset error when fetching new products
    setError('');
    // set up request config
    let config = {
      method: 'get',
      // set max body length to infinity to get all products
      maxBodyLength: Infinity,
      // set url with page and limit and search text
      url: `/api/task/products/search?page=${page}&limit=10&search=${text}`,
      // add api key to headers
      headers: {
        'x-api-key': '72njgfa948d9aS7gs5',
      },
    };
    // send request and handle response
    axios
      .request(config)
      .then((response: any) => {
        if (response.data) {
          // if page is 1, set product list to the response
          if (page == 1) {
            setProductList([...response.data]);
          } else {
            // if page is not 1, add the response to the product list
            setProductList([...productList, ...response.data]);
          }
          // reset error
          setError('');
        } else {
          // if no products are found, set error message
          setError('No Product Found');
          // reset product list
          setProductList([]);
        }
      })
      .catch((error) => {
        console.error(error);
        // set error message if there is an error
        setError(error.message);
      })
      .finally(() => {
        // hide loading when done
        setLoading(false);
      });
  };

  // when current page changes, fetch the products for that page
  useEffect(() => {
    fetchProducts(currentPage, '');
  }, [currentPage]);

  // when search text changes, fetch the products for the first page with that text
  useEffect(() => {
    fetchProducts(1, searchText);
  }, [searchText]);

  // when checked items change, update the selected product count
  useEffect(() => {
    getSelectedItemCount();
  }, [checkedItems]);

  // checking the product checkbox is checked based on variant checkbox
  const isProductChecked = (productId: number) => {
    return (
      Object.keys(checkedItems).includes(productId.toString()) &&
      checkedItems[productId] &&
      checkedItems[productId]?.size > 0
    );
  };

  const getSelectedItemCount = () => {
    let count = 0;
    // loop through checked items and count the number of products with at least one variant selected
    for (let item in checkedItems) {
      if (checkedItems[item].size > 0) {
        count += 1;
      }
    }
    setSelectedProductCount(count);
  };

  // when a parent checkbox is checked, add all variant ids to checkedItems or remove them if unchecked
  const handleParentChange = (productId: number, checked: boolean) => {
    const variants = productList.find(
      (product) => product.id === productId,
    )?.variants;
    setCheckedItems((prev) => ({
      ...prev,
      // if checked, add all variant ids to checkedItems
      // if unchecked, set checkedItems to an empty Set
      [productId]: checked
        ? new Set(variants?.map((variant) => variant.id))
        : new Set(),
    }));
  };

  // when a child checkbox is checked, add the variant id to checkedItems or remove it if unchecked
  const handleChildChange = (
    productId: number,
    variantId: number,
    checked: boolean,
  ) => {
    setCheckedItems((prev) => {
      const productCheckedItems = prev[productId] || new Set<number>();
      const newCheckedItems = new Set(productCheckedItems);
      if (checked) {
        newCheckedItems.add(variantId);
      } else {
        newCheckedItems.delete(variantId);
      }
      // update checkedItems with the new set
      return { ...prev, [productId]: newCheckedItems };
    });
  };

  // when the user scrolls to the bottom of the product list, fetch the next page
  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom) {
      // fetch the next page of products
      setCurrentPage(currentPage + 1);
    }
  };

  // when the user types in the search bar, update the search text and fetch the first page with that text
  const handleProductSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  // when the user clicks on the add product button,
  // loop through the product list and for each product,
  // filter out the variants that are not selected
  // and create a new product with the filtered variants
  // then reset the product list, loading, error, search text, current page, selected product count and checked items
  // and call the handleProductAdd function with the new products
  const handleAddProductClick = () => {
    const selectedProducts: any = productList
      .map((product: Product) => {
        // get the selected variant ids for this product
        const selectedVariantIds = checkedItems[product.id];
        if (!selectedVariantIds) return null;
        // filter out the variants that are not selected
        const filteredVariants = product.variants
          .map((variant) => {
            // if the variant is selected, return it with the discount set to false
            if (selectedVariantIds.has(variant.id)) {
              return {
                ...variant,
                discount: {
                  isAvailable: false,
                  discountAmount: 0,
                  discountType: 1,
                },
              };
            }
            // if the variant is not selected, return null
          })
          .filter(Boolean);
        // if there are no variants selected, return null
        if (filteredVariants.length === 0) return null;
        // return a new product with the filtered variants
        return {
          ...product,
          variants: filteredVariants,
          isOpen: false,
          discount: {
            isAvailable: false,
            discountAmount: 0,
            discountType: 1,
          },
        };
      })
      .filter(Boolean);
    // reset the state
    setProductList([]);
    setLoading(true);
    setError('');
    setSearchText('');
    setCurrentPage(1);
    setSelectedProductCount(0);
    setCheckedItems({});
    // call the handleProductAdd function with the new products
    handleProductAdd(selectedProducts);
  };

  return (
    <Modal
      open={isProductAddModalOpen}
      footer={null}
      className='product-modal h-[500px]'
      closable={false}
      width={663}
      destroyOnClose={true}
    >
      <div className='flex items-center justify-between px-5'>
        <h2 className='text-lg px-2'>Select Products</h2>
        {/* close icon */}
        <button onClick={handleAddProductModalClose}>
          <img
            src='/assets/close-icon.png'
            alt='close icon'
          />
        </button>
      </div>
      <hr className='my-1' />
      <div className='flex items-center justify-center px-5 w-full'>
        {/* search Box */}
        <div className='border w-full flex flex-row h-[32px] items-center px-2'>
          <img
            src='/assets/search.png'
            alt='search icon'
            className='w-5 h-5'
          />
          <input
            type='text'
            className='w-[600px] pl-1'
            placeholder='Search product'
            onChange={handleProductSearchChange}
          />
        </div>
      </div>
      <hr className='my-1' />
      {error && <h1>{error}</h1>}
      <div
        className='overflow-scroll h-[500px]'
        onScroll={handleScroll}
      >
        {/* if there are products in the list, map through them and display them */}
        {productList.length > 0 &&
          productList.map((product, productIndex) => (
            <div key={product.id + productIndex}>
              <div className=' px-5 flex flex-row space-x-2'>
                {/* parent checkbox */}
                <Checkbox
                  className='h-6 w-6'
                  checked={isProductChecked(product.id)}
                  onChange={(e) =>
                    handleParentChange(product.id, e.target.checked)
                  }
                />
                {/* product image */}
                <img
                  src={product.image?.src}
                  alt={product.title}
                  width={36}
                  height={36}
                  className='rounded'
                />
                {/* product title */}
                <h2 className='text-base'>{product.title}</h2>
              </div>
              <hr className='my-2' />
              <div className=''>
                {/* if there are variants in the product, map through them and display them */}
                {product.variants.map((variant, variantIndex) => (
                  <>
                    <div
                      key={variant.id + variantIndex}
                      className='pl-14 flex flex-row justify-between items-center py-1 w-[95%]'
                    >
                      <div className='flex flex-row justify-center items-center space-x-3'>
                        {/* variant checkbox */}
                        <Checkbox
                          checked={checkedItems[product.id]?.has(variant.id)}
                          onChange={(e) =>
                            handleChildChange(
                              product.id,
                              variant.id,
                              e.target.checked,
                            )
                          }
                        />
                        {/* variant title */}
                        <h3 className='text-base'>{variant.title}</h3>
                      </div>
                      <div className='flex flex-row justify-end items-center space-x-3'>
                        {/* variant inventory quantity */}
                        {variant.inventory_quantity > 0 && (
                          <p>{variant.inventory_quantity} Available</p>
                        )}
                        {/* variant price */}
                        <p>${variant.price}</p>
                      </div>
                    </div>
                    <hr className='my-2' />
                  </>
                ))}
              </div>
            </div>
          ))}
      </div>
      {/* if the products are loading, display a loading message */}
      {loading && <h1>loading...</h1>}
      <hr className='my-2' />
      <div className='px-5 flex flex-row justify-between'>
        <div>
          {/* if there are selected products, display the count */}
          {selectedProductCount > 0 && (
            <p className='text-base'>{selectedProductCount} Product Selected</p>
          )}
        </div>
        <div className='flex flex-row space-x-2'>
          {/* cancel button */}
          <button className='h-8 w-[104px] border border-[#00000066] text-[#00000099] font-semibold text-sm rounded'>
            Cancel
          </button>
          {/* add button */}
          <button
            className='h-8 w-[72px] border bg-[#008060] text-white font-semibold text-sm rounded'
            onClick={handleAddProductClick}
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddProductModel;
