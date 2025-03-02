import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { numberFormat } from "../../utils/number";

const SearchCard = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const actionSearchFilters = useEcomStore((state) => state.actionSearchFilters);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [text, setText] = useState("");
  const [categorySelected, setCategorySelected] = useState([]);
  const [price, setPrice] = useState([1000, 30000]);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (text) {
        actionSearchFilters({ query: text });
      } else {
        getProduct();
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [text]);

  const handleCheck = (e) => {
    const inCheck = e.target.value;
    const inState = [...categorySelected];
    const findCheck = inState.indexOf(inCheck);

    if (findCheck === -1) {
      inState.push(inCheck);
    } else {
      inState.splice(findCheck, 1);
    }
    setCategorySelected(inState);

    if (inState.length > 0) {
      actionSearchFilters({ category: inState });
    } else {
      getProduct();
    }
  };

  useEffect(() => {
    actionSearchFilters({ price });
  }, [ok]);

  const handlePrice = (value) => {
    setPrice(value);
    setTimeout(() => {
      setOk(!ok);
    }, 300);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">🔍 ค้นหาสินค้า</h1>

      {/* Search by Text */}
      <input
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder="พิมพ์ชื่อสินค้า..."
        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 mb-4"
      />

      <hr className="my-4" />

      {/* Search by Category */}
      <div>
        <h2 className="text-md font-medium text-gray-700 mb-2">📦 หมวดหมู่สินค้า</h2>
        <div className="flex flex-col gap-2">
          {categories.map((item, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                onChange={handleCheck}
                value={item.id}
                type="checkbox"
                className="rounded text-blue-500"
              />
              <span>{item.name}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="my-4" />

      {/* Search by Price */}
      <div>
        <h2 className="text-md font-medium text-gray-700 mb-2">💰 ค้นหาตามราคา</h2>
        <div className="flex justify-between text-sm">
          <span>Min: {numberFormat(price[0])}</span>
          <span>Max: {numberFormat(price[1])}</span>
        </div>
        <Slider
          onChange={handlePrice}
          range
          min={0}
          max={100000}
          defaultValue={[1000, 30000]}
        />
      </div>
    </div>
  );
};

export default SearchCard;
