import Checkbox from "antd/es/checkbox/Checkbox";
import Modal from "antd/es/modal/Modal";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Product } from "../constants/constants";
interface AddProductModalProps {
  isProductAddModalOpen: boolean;
  handleAddProductModalClose: () => void;
  handleProductAdd: (product: Product[]) => void;
}

const AddProductModel: React.FunctionComponent<AddProductModalProps> = ({
  handleAddProductModalClose,
  isProductAddModalOpen,
  handleProductAdd,
}) => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProductCount, setSelectedProductCount] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");

  const [checkedItems, setCheckedItems] = useState<{
    [key: number]: Set<number>;
  }>({});

  useEffect(() => {
    fetchProducts(1, "");
  }, [isProductAddModalOpen]);

  const fetchProducts = async (page: number, text: string) => {
    setLoading(true);
    setError("");
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `/api/task/products/search?page=${page}&limit=10&search=${text}`,
      headers: {
        "x-api-key": "72njgfa948d9aS7gs5",
      },
    };
    axios
      .request(config)
      .then((response: any) => {
        if (response.data) {
          if (page == 1) {
            setProductList([...response.data]);
          } else {
            setProductList([...productList, ...response.data]);
          }
          setError("");
        } else {
          setError("No Product Found");
          setProductList([]);
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts(currentPage, "");
  }, [currentPage]);

  useEffect(() => {
    fetchProducts(1, searchText);
  }, [searchText]);

  const isParentChecked = (productId: number) => {
    return (
      Object.keys(checkedItems).includes(productId.toString()) &&
      checkedItems[productId] &&
      checkedItems[productId]?.size > 0
    );
  };

  useEffect(() => {
    getSelectedItemCount();
  }, [checkedItems]);

  const getSelectedItemCount = () => {
    let count = 0;
    for (let item in checkedItems) {
      if (checkedItems[item].size > 0) {
        count += 1;
      }
    }
    setSelectedProductCount(count);
  };

  const handleParentChange = (productId: number, checked: boolean) => {
    const variants = productList.find(
      (product) => product.id === productId
    )?.variants;
    setCheckedItems((prev) => ({
      ...prev,
      [productId]: checked
        ? new Set(variants?.map((variant) => variant.id))
        : new Set(),
    }));
  };

  const handleChildChange = (
    productId: number,
    variantId: number,
    checked: boolean
  ) => {
    setCheckedItems((prev) => {
      const productCheckedItems = prev[productId] || new Set<number>();
      const newCheckedItems = new Set(productCheckedItems);
      if (checked) {
        newCheckedItems.add(variantId);
      } else {
        newCheckedItems.delete(variantId);
      }
      return { ...prev, [productId]: newCheckedItems };
    });
  };

  const handleScroll = (e: any) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleProductSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleAddProductClick = () => {
    const selectedProducts: any = productList
      .map((product: Product) => {
        const selectedVariantIds = checkedItems[product.id];
        if (!selectedVariantIds) return null;
        const filteredVariants = product.variants
          .map((variant) => {
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
          })
          .filter(Boolean);
        if (filteredVariants.length === 0) return null;
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
    setProductList([]);
    setLoading(true);
    setError("");
    setSearchText("");
    setCurrentPage(1);
    setSelectedProductCount(0);
    setCheckedItems({});
    handleProductAdd(selectedProducts);
  };

  return (
    <Modal
      open={isProductAddModalOpen}
      footer={null}
      className="product-modal h-[500px]"
      closable={false}
      width={663}
      destroyOnClose={true}
    >
      <div className="flex items-center justify-between px-5">
        <h2 className="text-lg px-2">Select Products</h2>
        <button onClick={handleAddProductModalClose}>
          <img src="/assets/close-icon.png" alt="close icon" />
        </button>
      </div>
      <hr className="my-1" />
      <div className="flex items-center justify-center px-5 w-full">
        <div className="border w-full flex flex-row h-[32px] items-center px-2">
          <img src="/assets/search.png" alt="search icon" className="w-5 h-5" />
          <input
            type="text"
            className="w-[600px] pl-1"
            placeholder="Search product"
            onChange={handleProductSearchChange}
          />
        </div>
      </div>
      <hr className="my-1" />
      {error && <h1>{error}</h1>}
      <div className="overflow-scroll h-[500px]" onScroll={handleScroll}>
        {productList.length > 0 &&
          productList.map((product, productIndex) => (
            <div key={product.id + productIndex}>
              <div className=" px-5 flex flex-row space-x-2">
                <Checkbox
                  className="h-6 w-6"
                  checked={isParentChecked(product.id)}
                  onChange={(e) =>
                    handleParentChange(product.id, e.target.checked)
                  }
                />
                <img
                  src={product.image?.src}
                  alt={product.title}
                  width={36}
                  height={36}
                  className="rounded"
                />
                <h2 className="text-base">{product.title}</h2>
              </div>
              <hr className="my-2" />
              <div className="">
                {product.variants.map((variant, variantIndex) => (
                  <>
                    <div
                      key={variant.id + variantIndex}
                      className="pl-14 flex flex-row justify-between items-center py-1 w-[95%]"
                    >
                      <div className="flex flex-row justify-center items-center space-x-3">
                        <Checkbox
                          checked={checkedItems[product.id]?.has(variant.id)}
                          onChange={(e) =>
                            handleChildChange(
                              product.id,
                              variant.id,
                              e.target.checked
                            )
                          }
                        />
                        <h3 className="text-base">{variant.title}</h3>
                      </div>
                      <div className="flex flex-row justify-end items-center space-x-3">
                        {variant.inventory_quantity > 0 && (
                          <p>{variant.inventory_quantity} Available</p>
                        )}
                        <p>${variant.price}</p>
                      </div>
                    </div>
                    <hr className="my-2" />
                  </>
                ))}
              </div>
            </div>
          ))}
      </div>
      {loading && <h1>loading...</h1>}
      <hr className="my-2" />
      <div className="px-5 flex flex-row justify-between">
        <div>
          {selectedProductCount > 0 && (
            <p className="text-base">{selectedProductCount} Product Selected</p>
          )}
        </div>
        <div className="flex flex-row space-x-2">
          <button className="h-8 w-[104px] border border-[#00000066] text-[#00000099] font-semibold text-sm rounded">
            Cancel
          </button>
          <button
            className="h-8 w-[72px] border bg-[#008060] text-white font-semibold text-sm rounded"
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
