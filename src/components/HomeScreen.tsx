import Select from 'antd/es/select'; // importing ant design select component
import React, { useState } from 'react'; // importing react useState hook
import DragListView from 'react-drag-listview'; // importing DragListView component from react-drag-listview
import { Product } from '../constants/constants'; // importing Product interface from constants
import AddProductModel from './AddProductModel'; // importing AddProductModal component which is used to add new products

const HomeScreen: React.FunctionComponent = () => {
  // dummy product details used as a placeholder in the product list
  const dummyProductDetails: Product = {
    id: 0,
    title: 'Select Product',
    variants: [],
    image: { id: 0, src: '' },
    price: 0,
    discount: {
      isAvailable: false,
    },
  };

  const [productList, setProductList] = useState<Product[]>([
    dummyProductDetails,
  ]); // state to store the list of products
  const [isProductAddModalOpen, setIsProductAddModalOpen] = useState(false); // state to keep track of whether the add product modal is open or not
  const [editProductIndex, setEditProductIndex] = useState<number>(0); // state to keep track of the index of the product being edited

  /**
   * Called when a product is dragged and dropped in the product list
   * @param {number} fromIndex - index of the product that was dragged
   * @param {number} toIndex - index of the product that was dropped on
   */
  const onDragEnd = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0) return;
    const updatedProductList = [...productList];
    const movedProduct = updatedProductList.splice(fromIndex, 1)[0];
    updatedProductList.splice(toIndex, 0, movedProduct);
    setProductList(updatedProductList);
  };

  /**
   * Called when a variant is dragged and dropped in the variant list of a product
   * @param {number} productIndex - index of the product that the variant belongs to
   * @param {number} fromIndex - index of the variant that was dragged
   * @param {number} toIndex - index of the variant that was dropped on
   */
  const onChildDragEnd = (
    productIndex: number,
    fromIndex: number,
    toIndex: number,
  ) => {
    if (toIndex < 0) return;
    const updatedProductList = [...productList];
    const product = updatedProductList[productIndex];
    const moveVariant = product.variants.splice(fromIndex, 1)[0];
    product.variants.splice(toIndex, 0, moveVariant);
    setProductList(updatedProductList);
  };

  /**
   * Called when a product's children visibility is toggled
   * @param {number} index - index of the product that the children belongs to
   */
  const toggleChildrenVisibility = (index: number) => {
    const updatedItems = [...productList];
    updatedItems[index].isOpen = !updatedItems[index].isOpen;
    setProductList(updatedItems);
  };

  /**
   * Handles the edit click on a product item
   * @param {MouseEvent<HTMLButtonElement>} e - the event that triggered this function
   * @param {number} productIndex - the index of the product that was clicked
   */
  const handleEditClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    productIndex: number,
  ) => {
    e.preventDefault();
    setIsProductAddModalOpen(true);
    setEditProductIndex(productIndex);
  };

  /**
   * Adds a default product item to the product list
   */
  const addDefaultProduct = () => {
    setProductList([
      ...productList,
      { ...dummyProductDetails, id: productList.length },
    ]);
  };

  /**
   * Handles the close of the product add modal
   */
  const handleAddProductModalClose = () => {
    setIsProductAddModalOpen(false);
  };

  /**
   * Handles the product add action
   * @param {Product} product - the product that was added
   */
  const handleProductAdd = (product: any) => {
    productList.splice(editProductIndex, 1, ...product);
    setIsProductAddModalOpen(false);
  };

  /**
   * Handles the remove of a product item
   * @param {number} productIndex - the index of the product that was clicked
   */
  const handleProductRemove = (productIndex: number) => {
    setProductList((prevProducts: Product[]) => {
      const updatedProduct = [...prevProducts];
      updatedProduct.splice(productIndex, 1);
      return updatedProduct;
    });
  };

  /**
   * Handles the remove of a variant from a product
   * @param {number} productIndex - the index of the product that the variant belongs to
   * @param {number} variantIndex - the index of the variant that was clicked
   */
  const handleVariantRemove = (productIndex: number, variantIndex: number) => {
    setProductList((prevProducts: Product[]) => {
      const updatedProducts: Product[] = [...prevProducts];
      const productVariants = [...updatedProducts[productIndex].variants];
      productVariants.splice(variantIndex, 1);
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        variants: productVariants,
      };
      return updatedProducts;
    });
  };

  /**
   * Adds a discount to a product
   * @param {number} productIndex - the index of the product to add the discount to
   */
  const addProductDiscount = (productIndex: number) => {
    setProductList((prevProducts: Product[]) => {
      const updatedProducts: Product[] = [...prevProducts];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        discount: {
          isAvailable: true,
          discountAmount: 0,
          discountType: 1,
        },
      };
      return updatedProducts;
    });
  };

  /**
   * Adds a discount to a variant
   * @param {number} productIndex - the index of the product the variant belongs to
   * @param {number} variantIndex - the index of the variant to add the discount to
   */
  const addVariantDiscount = (productIndex: number, variantIndex: number) => {
    setProductList((prevProducts: Product[]) => {
      const updatedProducts = [...prevProducts];
      const updatedVariants = [...updatedProducts[productIndex].variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        discount: {
          isAvailable: true,
          discountAmount: 0,
          discountType: 1,
        },
      };
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        variants: updatedVariants,
      };
      return updatedProducts;
    });
  };

  /**
   * Handles the change of the discount type of a product
   * @param {number} productIndex - the index of the product to update
   * @param {number} discountType - the new discount type
   */
  const handleProductDiscountTypeChange = (
    productIndex: number,
    discountType: number,
  ) => {
    setProductList((prevProducts: Product[]) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        discount: {
          ...updatedProducts[productIndex]?.discount,
          isAvailable: true,
          discountType,
        },
      };
      return updatedProducts;
    });
  };

  /**
   * Handles the change of the discount amount of a product
   * @param {number} productIndex - the index of the product to update
   * @param {number} discountAmount - the new discount amount
   */
  const handleProductDiscount = (
    productIndex: number,
    discountAmount: number,
  ) => {
    setProductList((prevProducts: Product[]) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        discount: {
          ...updatedProducts[productIndex]?.discount,
          isAvailable: true,
          discountAmount,
        },
      };
      return updatedProducts;
    });
  };

  /**
   * Handles the change of the discount type of a variant
   * @param {number} productIndex - the index of the product the variant belongs to
   * @param {number} variantIndex - the index of the variant to update
   * @param {number} discountType - the new discount type
   */
  const handleVariantDiscountTypeChange = (
    productIndex: number,
    variantIndex: number,
    discountType: number,
  ) => {
    setProductList((prevProducts: Product[]) => {
      const updatedProducts = [...prevProducts];
      const updatedVariants = [...updatedProducts[productIndex].variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        discount: {
          ...updatedVariants[variantIndex]?.discount,
          isAvailable: true,
          discountType: discountType,
        },
      };
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        variants: updatedVariants,
      };
      return updatedProducts;
    });
  };

  /**
   * Handles the change of the discount amount of a variant
   * @param {number} productIndex - the index of the product the variant belongs to
   * @param {number} variantIndex - the index of the variant to update
   * @param {number} discountAmount - the new discount amount
   */
  const handleVariantDiscountAmountChange = (
    productIndex: number,
    variantIndex: number,
    discountAmount: number,
  ) => {
    setProductList((prevProducts: Product[]) => {
      const updatedProducts = [...prevProducts];
      const updatedVariants = [...updatedProducts[productIndex].variants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        discount: {
          ...updatedVariants[variantIndex]?.discount,
          isAvailable: true,
          discountAmount: discountAmount,
        },
      };
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        variants: updatedVariants,
      };
      return updatedProducts;
    });
  };

  return (
    <>
      {/* Add Product Modal Component */}
      <AddProductModel
        isProductAddModalOpen={isProductAddModalOpen}
        handleAddProductModalClose={handleAddProductModalClose}
        handleProductAdd={handleProductAdd}
      />

      {/* Main Container */}
      <div className='w-full flex items-center justify-center '>
        <div className='pt-16 bg-[#F6F6F6] p-[50px]'>
          <h2 className='font-semibold text-base text-[#202223]'>
            Add Products
          </h2>

          {/* Header Row for Product and Discount Columns */}
          <div className='flex flex-row min-w-[500px] '>
            <div className='w-[10%]'></div>
            <div className='w-[50%]'>
              <span className='text-sm pl-3'>Product</span>
            </div>
            <div className='w-[40%] pl-3'>
              <span className='pl-3 text-sm'>Discount</span>
            </div>
          </div>

          {/* Product List with Drag and Drop Functionality */}
          <div>
            <DragListView
              nodeSelector='.parent-item'
              onDragEnd={onDragEnd}
              lineClassName='drag-line'
            >
              <ul className='space-y-2'>
                {productList.map((product, productIndex) => (
                  <li
                    key={productIndex + product.id}
                    className='parent-item'
                  >
                    <div className='w-full flex flex-row'>
                      {/* Drag Icon and Product Index */}
                      <div className='flex flex-row items-center space-x-3 w-[10%]'>
                        <img
                          src='/assets/drag-icon.png'
                          alt='drag icon'
                          className='w-2 h-4'
                        />
                        <span>{productIndex + 1}.</span>
                      </div>

                      {/* Product Title with Edit Option */}
                      <div className='w-[50%]'>
                        <div className='flex flex-row items-center justify-around w-full h-[31px] border border-[#00000012] shadow-custom bg-white'>
                          <span className='w-[85%] text-ellipsis whitespace-nowrap overflow-hidden pl-2 text-sm text-[#00000080]'>
                            {product.title}
                          </span>
                          <button
                            onClick={(e) => handleEditClick(e, productIndex)}
                          >
                            <img
                              src='/assets/edit-icon.png'
                              alt='edit icon'
                            />
                          </button>
                        </div>
                      </div>

                      {/* Discount Section */}
                      <div className='w-[40%] ml-3 flex flex-row justify-between space-x-2'>
                        {product.discount && !product.discount.isAvailable ? (
                          <button
                            className='bg-[#008060] rounded border-2 w-[141px] h-[32px] text-white font-semibold text-sm'
                            onClick={() => addProductDiscount(productIndex)}
                          >
                            Add Discount
                          </button>
                        ) : (
                          <div className='w-4/5 flex flex-row justify-between space-x-2'>
                            <input
                              value={product?.discount?.discountAmount}
                              type='number'
                              className='w-16'
                              onChange={(e) =>
                                handleProductDiscount(
                                  productIndex,
                                  parseInt(e.target.value),
                                )
                              }
                            />
                            <Select
                              value={product?.discount?.discountType}
                              options={[
                                { value: 1, label: <span>%</span> },
                                { value: 2, label: <span>Flat</span> },
                              ]}
                              onChange={(value) =>
                                handleProductDiscountTypeChange(
                                  productIndex,
                                  value,
                                )
                              }
                              className='w-24'
                            />
                          </div>
                        )}
                        <button
                          onClick={() => handleProductRemove(productIndex)}
                        >
                          <img
                            src='/assets/cross-icon.png'
                            alt='close icon'
                          />
                        </button>
                      </div>
                    </div>

                    {/* Variants Toggle Button */}
                    {product.variants.length > 0 && (
                      <div className='flex justify-end'>
                        <button
                          onClick={(e) =>
                            toggleChildrenVisibility(productIndex)
                          }
                        >
                          <span className='underline text-xs text-[#006EFF]'>
                            {product.isOpen
                              ? 'Hide Variants ▲ '
                              : 'Show Variants ▼'}
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Variant List with Drag and Drop Functionality */}
                    {product.isOpen && (
                      <DragListView
                        nodeSelector='.child-item'
                        onDragEnd={(fromIndex, toIndex) =>
                          onChildDragEnd(productIndex, fromIndex, toIndex)
                        }
                        lineClassName='drag-line'
                      >
                        <div className='flex flex-row justify-end'>
                          <ul className='w-full space-y-2'>
                            {product.variants.map((variant, variantIndex) => (
                              <li
                                key={variant.id + variantIndex}
                                className='child-item'
                              >
                                <div className='w-full flex flex-row'>
                                  <div className='flex flex-row items-center space-x-3 w-[10%]'></div>
                                  <div className='w-[50%] flex flex-row items-center space-x-2 pl-2'>
                                    <img
                                      src='/assets/drag-icon.png'
                                      alt='drag icon'
                                      className='w-2 h-4'
                                    />
                                    <div className='w-[92%] h-[31px] border border-[#00000012] shadow-custom bg-white rounded-[30px]'>
                                      <span className='w-[85%] text-ellipsis whitespace-nowrap overflow-hidden pl-2 text-sm text-[#00000080]'>
                                        {variant.title}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Variant Discount Section */}
                                  <div className='ml-3 w-[40%] flex flex-row justify-between space-x-2'>
                                    {variant.discount &&
                                    !variant.discount.isAvailable ? (
                                      <button
                                        className='bg-[#008060] rounded border-2 w-[141px] h-[32px] text-white font-semibold text-sm'
                                        onClick={() =>
                                          addVariantDiscount(
                                            productIndex,
                                            variantIndex,
                                          )
                                        }
                                      >
                                        Add Discount
                                      </button>
                                    ) : (
                                      <div className='w-4/5 flex flex-row justify-between space-x-2'>
                                        <input
                                          value={
                                            variant.discount?.discountAmount
                                          }
                                          type='number'
                                          className='w-16 rounded-[30px]'
                                          onChange={(e) =>
                                            handleVariantDiscountAmountChange(
                                              productIndex,
                                              variantIndex,
                                              parseInt(e.target.value),
                                            )
                                          }
                                        />
                                        <Select
                                          value={variant.discount?.discountType}
                                          options={[
                                            { value: 1, label: <span>%</span> },
                                            {
                                              value: 2,
                                              label: <span>Flat</span>,
                                            },
                                          ]}
                                          onChange={(value) =>
                                            handleVariantDiscountTypeChange(
                                              productIndex,
                                              variantIndex,
                                              value,
                                            )
                                          }
                                          className='w-24 variant-select-input rounded-[30px]'
                                        />
                                      </div>
                                    )}
                                    <button
                                      onClick={() =>
                                        handleVariantRemove(
                                          productIndex,
                                          variantIndex,
                                        )
                                      }
                                    >
                                      <img
                                        src='/assets/cross-icon.png'
                                        alt='close icon'
                                      />
                                    </button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </DragListView>
                    )}
                  </li>
                ))}
              </ul>
            </DragListView>
          </div>

          {/* Add Default Product Button */}
          <div className='flex flex-row justify-end mt-2'>
            <button
              className='w-[193px] h-[42px] border-2 border-[#008060] rounded text-[#008060] font-semibold text-sm'
              onClick={addDefaultProduct}
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
