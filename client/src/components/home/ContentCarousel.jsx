/*import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import 'swiper/css/navigation';
// import required modules
import { Pagination, Autoplay, Navigation } from "swiper/modules";



const ContentCarousel = () => {
  // Javascript
  const [data, setData] = useState([]);
  useEffect(() => {
    hdlGetImage();
  }, []);

  const hdlGetImage = () => {
    // code
    axios
      .get("https://picsum.photos/v2/list?page=1&limit=20")
      .then((res) => setData(res.data))
      .catch((error) => console.log(error));
  };

  return (
    <div>
      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper h-80 object-cover 
        rounded-md mb-4"
      >
        {data?.map((item, i) => (
          <SwiperSlide>
            <img src={item.download_url} />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        slidesPerView={5}
        spaceBetween={10}
        pagination={true}
        navigation={true}
        modules={[Pagination, Autoplay,Navigation]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper object-cover rounded-md"
      >
        {data?.map((item, i) => (
          <SwiperSlide>
            <img 
            className="rounded-md"
            src={item.download_url} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContentCarousel;
*/

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

// ใส่ URL ของรูปภาพที่ต้องการแสดง
const images = [
  "/images/6ep2vfdp.png",
  "/images/i0u3l2bb.png",
  "/images/maxresdefault (3).jpg",
  "/images/nexon.png",
  "/images/u8uhtv1s.png",
  "/images/wartech.png",
];

const ContentCarousel = () => {
  return (
    <div>
      <Swiper
        pagination={true}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper h-80 object-cover rounded-md mb-4"
      >
        {images.map((image, i) => (
          <SwiperSlide key={i}>
            <img src={image} alt={`image-${i}`} className="w-full h-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        slidesPerView={5}
        spaceBetween={10}
        pagination={true}
        navigation={true}
        modules={[Pagination, Autoplay, Navigation]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        className="mySwiper object-cover rounded-md"
      >
        {images.map((image, i) => (
          <SwiperSlide key={i}>
            <img className="rounded-md w-full h-full object-cover" src={image} alt={`image-${i}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContentCarousel;
