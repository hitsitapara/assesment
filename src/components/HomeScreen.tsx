import Select from "antd/es/select";
import React, { useState } from "react";
import DragListView from "react-drag-listview";
import { Product } from "../constants/constants";
import AddProductModel from "./AddProductModel";

const HomeScreen: React.FunctionComponent = () => {
  const dummyProductDetails = {
    id: 0,
    title: "Select Product",
    variants: [],
    image: { id: 0, src: "" },
    price: 0,
    discount: {
      isAvailable: false,
    },
  };
  const [productList, setProductList] = useState<Product[]>([
    dummyProductDetails,
  ]);
  const [isProductAddModalOpen, setIsProductAddModalOpen] = useState(false);
  const [editProductIndex, setEditProductIndex] = useState<number>(0);

  const onDragEnd = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0) return; 
    const updatedProductList = [...productList];
    const movedProduct = updatedProductList.splice(fromIndex, 1)[0];
    updatedProductList.splice(toIndex, 0, movedProduct);
    setProductList(updatedProductList);
  };

  const onChildDragEnd = (
    productIndex: number,
    fromIndex: number,
    toIndex: number
  ) => {
    if (toIndex < 0) return;
    const updatedProductList = [...productList];
    const product = updatedProductList[productIndex];
    const moveVariant = product.variants.splice(fromIndex, 1)[0];
    product.variants.splice(toIndex, 0, moveVariant);
    setProductList(updatedProductList);
  };

  const toggleChildrenVisibility = (index: number) => {
    const updatedItems = [...productList];
    updatedItems[index].isOpen = !updatedItems[index].isOpen;
    setProductList(updatedItems);
  };

  const handleEditClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    productIndex: number
  ) => {
    e.preventDefault();
    setIsProductAddModalOpen(true);
    setEditProductIndex(productIndex);
  };

  const addDefaultProduct = () => {
    setProductList([
      ...productList,
      { ...dummyProductDetails, id: productList.length },
    ]);
  };
  const handleAddProductModalClose = () => {
    setIsProductAddModalOpen(false);
  };

  const handleProductAdd = (product: any) => {
    productList.splice(editProductIndex, 1, ...product);
    setIsProductAddModalOpen(false);
  };

  const handleProductRemove = (productIndex: number) => {
    setProductList((prevProducts: Product[]) => {
      const updatedProduct = [...prevProducts];
      updatedProduct.splice(productIndex, 1);
      return updatedProduct;
    });
  };
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

  const handleProductDiscountTypeChange = (
    productIndex: number,
    discountType: number
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

  const handleProductDiscount = (
    productIndex: number,
    discountAmount: number
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

  const handleVariantDiscountTypeChange = (
    productIndex: number,
    variantIndex: number,
    discountType: number
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

  const handleVariantDiscountAmountChange = (
    productIndex: number,
    variantIndex: number,
    discountAmount: number
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
      <AddProductModel
        isProductAddModalOpen={isProductAddModalOpen}
        handleAddProductModalClose={handleAddProductModalClose}
        handleProductAdd={handleProductAdd}
      />
      <div className="w-full flex items-center justify-center ">
        <div className="pt-16 bg-[#F6F6F6] p-[50px]">
          <h2 className="font-semibold text-base text-[#202223]">
            Add Products
          </h2>
          <div className="flex flex-row min-w-[500px] ">
            <div className="w-[10%]"></div>
            <div className="w-[50%]">
              <span className="text-sm pl-3">Product</span>
            </div>
            <div className="w-[40%] pl-3">
              <span className="pl-3 text-sm">Discount</span>
            </div>
          </div>
          <div>
            <DragListView
              nodeSelector=".parent-item"
              onDragEnd={onDragEnd}
              lineClassName="drag-line"
            >
              <ul className="space-y-2">
                {productList.map((product, productIndex) => (
                  <li key={productIndex + product.id} className="parent-item">
                    <div className=" w-full flex flex-row">
                      <div className="flex flex-row items-center space-x-3 w-[10%]">
                        <img
                          src="/assets/drag-icon.png"
                          alt="drag icon"
                          className="w-2 h-4"
                        />
                        <span>{productIndex + 1}.</span>
                      </div>
                      <div className="w-[50%]">
                        <div className="flex flex-row items-center justify-around w-full h-[31px] border border-[#00000012] shadow-custom bg-white">
                          <span className="w-[85%] text-ellipsis whitespace-nowrap overflow-hidden pl-2 text-sm text-[#00000080]">
                            {product.title}
                          </span>
                          <button
                            onClick={(e) => {
                              handleEditClick(e, productIndex);
                            }}
                          >
                            <img src="/assets/edit-icon.png" alt="edit icon" />
                          </button>
                        </div>
                      </div>
                      <div className="w-[40%] ml-3 flex flex-row justify-between space-x-2">
                        {product.discount && !product.discount.isAvailable ? (
                          <button
                            className=" bg-[#008060] rounded border-2 w-[141px] h-[32px] text-white font-semibold text-sm"
                            onClick={() => addProductDiscount(productIndex)}
                          >
                            Add Discount
                          </button>
                        ) : (
                          <div className="w-4/5 flex flex-row justify-between space-x-2">
                            <input
                              value={product?.discount?.discountAmount}
                              type="number"
                              className="w-16"
                              onChange={(e) =>
                                handleProductDiscount(
                                  productIndex,
                                  parseInt(e.target.value)
                                )
                              }
                            />
                            <Select
                              value={product?.discount?.discountType}
                              options={[
                                { value: 1, label: <span>%</span> },
                                { value: 2, label: <span>Flat</span> },
                              ]}
                              onChange={(value) => {
                                handleProductDiscountTypeChange(
                                  productIndex,
                                  value
                                );
                              }}
                              className="w-24"
                            />
                          </div>
                        )}
                        <button
                          onClick={() => {
                            handleProductRemove(productIndex);
                          }}
                        >
                          <img src="/assets/cross-icon.png" alt="close icon" />
                        </button>
                      </div>
                    </div>
                    {product.variants.length > 0 && (
                      <div className="flex justify-end">
                        <button
                          onClick={(e) =>
                            toggleChildrenVisibility(productIndex)
                          }
                        >
                          <span className="underline text-xs text-[#006EFF]">
                            {product.isOpen
                              ? "Hide Variants ▲ "
                              : "Show Variants ▼"}
                          </span>
                        </button>
                      </div>
                    )}
                    {product.isOpen && (
                      <DragListView
                        nodeSelector=".child-item"
                        onDragEnd={(fromIndex, toIndex) =>
                          onChildDragEnd(productIndex, fromIndex, toIndex)
                        }
                        lineClassName="drag-line"
                      >
                        <div className="flex flex-row justify-end">
                          <ul className="w-full space-y-2">
                            {product.variants.map((variant, variantIndex) => (
                              <li
                                key={variant.id + variantIndex}
                                className="child-item"
                              >
                                <div className="w-full flex flex-row">
                                  <div className="flex flex-row items-center space-x-3 w-[10%]"></div>
                                  <div className="w-[50%] flex flex-row items-center space-x-2 pl-2">
                                    <img
                                      src="/assets/drag-icon.png"
                                      alt="drag icon"
                                      className="w-2 h-4"
                                    />
                                    <div className="w-[92%] h-[31px] border border-[#00000012] shadow-custom bg-white rounded-[30px]">
                                      <span className="w-[85%] text-ellipsis whitespace-nowrap overflow-hidden pl-2 text-sm text-[#00000080]">
                                        {variant.title}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="ml-3 w-[40%] flex flex-row justify-between space-x-2">
                                    {variant.discount &&
                                    !variant.discount.isAvailable ? (
                                      <button
                                        className="bg-[#008060] rounded border-2 w-[141px] h-[32px] text-white font-semibold text-sm"
                                        onClick={() =>
                                          addVariantDiscount(
                                            productIndex,
                                            variantIndex
                                          )
                                        }
                                      >
                                        Add Discount
                                      </button>
                                    ) : (
                                      <div className="w-4/5 flex flex-row justify-between space-x-2">
                                        <input
                                          value={
                                            variant.discount?.discountAmount
                                          }
                                          type="number"
                                          className="w-16 rounded-[30px]"
                                          onChange={(e) =>
                                            handleVariantDiscountAmountChange(
                                              productIndex,
                                              variantIndex,
                                              parseInt(e.target.value)
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
                                          onChange={(value) => {
                                            handleVariantDiscountTypeChange(
                                              productIndex,
                                              variantIndex,
                                              value
                                            );
                                          }}
                                          className="w-24 variant-select-input rounded-[30px]"
                                        />
                                      </div>
                                    )}
                                    <button
                                      onClick={() =>
                                        handleVariantRemove(
                                          productIndex,
                                          variantIndex
                                        )
                                      }
                                    >
                                      <img
                                        src="/assets/cross-icon.png"
                                        alt="close icon"
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
          <div className="flex flex-row justify-end mt-2">
            <button
              className="w-[193px] h-[42px] border-2 border-[#008060] rounded text-[#008060] font-semibold text-sm"
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
