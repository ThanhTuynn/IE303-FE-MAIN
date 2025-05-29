import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Homepage = () => {
  const [quantities, setQuantities] = useState([0, 0, 0]);

  const handleChange = (index, delta) => {
    setQuantities(prev => {
      const updated = [...prev];
      updated[index] = Math.max(0, updated[index] + delta);
      return updated;
    });
  };

  const handleAddToCart = (index) => {
    if (quantities[index] > 0) {
      alert(`Đã thêm ${products[index].name} vào giỏ hàng!`);
    }
  };

  const products = [
    {
      name: 'Bánh mì thịt nướng',
      price: '20.000đ',
      desc: 'Gồm bánh mì giòn, thịt nướng thơm ngon, kèm rau sống tươi, dưa leo và đồ chua, tạo nên hương vị đậm đà, hấp dẫn cho bữa sáng nhanh chóng và tiện lợi.',
      image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746384045/banhmithapcam_arredm.webp'
    },
    {
      name: 'Cơm tấm Long Xuyên',
      price: '35.000đ',
      desc: 'Gồm cơm tấm mềm mịn, sườn nướng thơm ngon, kèm bì, chả trứng, và rau sống tươi, tạo nên hương vị đậm đà, hấp dẫn cho bữa ăn nhanh chóng và đầy đủ năng lượng.',
      image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746384044/comtam_gum9ve.jpg'
    },
    {
      name: 'Sinh tố dâu',
      price: '20.000đ',
      desc: 'Dâu tươi xay nhuyễn cùng đá và sữa đặc, mang đến ly sinh tố mát lạnh, chua ngọt cân bằng, giàu vitamin – vừa ngon vừa tốt cho sức khỏe.',
      image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746426032/sinh_t%E1%BB%91_d%C3%A2u_ondcxh.jpg'
    },
  ];

  return (
    <div className="bg-white text-black font-kanit zoom-75">
      {/* Banner */}
<section className="w-full">
<Swiper
  modules={[Navigation, Autoplay]}
  spaceBetween={0}
  slidesPerView={1}
  loop={true}
  autoplay={{
    delay: 3000,
    disableOnInteraction: false,
  }}
  navigation={true} // 👈 Bật nút ← →
  className="w-full h-auto"
>
  <SwiperSlide>
    <img
      src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382142/i_m_avery_davis_4_pplo4x.png"
      alt="Banner 1"
      className="w-full h-auto object-cover"
    />
  </SwiperSlide>
  <SwiperSlide>
    <img
      src="https://res.cloudinary.com/dbr85jktp/image/upload/v1747665970/2_hsx5dk.png"
      className="w-full h-auto object-cover"
    />
  </SwiperSlide>
  <SwiperSlide>
    <img
      src="https://res.cloudinary.com/dbr85jktp/image/upload/v1747665969/1_lcwn2n.png"
      alt="Banner 3"
      className="w-full h-auto object-cover"
    />
  </SwiperSlide>
</Swiper>
</section>

      {/* Gợi ý cho bạn */}
      <section className="px-4 md:px-8 lg:px-16 py-10 bg-white font-kanit">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8">
          <span className="text-red-600">CÓ THỂ</span> BẠN SẼ THÍCH
        </h2>

        <Swiper
          modules={[Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
        >
          {products.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="bg-white rounded-xl shadow-md p-4 text-left border hover:shadow-lg transition">
                <img src={item.image} alt={item.name} className="rounded-md mb-3 w-full h-48 object-cover" />
                <h3 className="text-lg font-extrabold">{item.name}</h3>
                <p className="text-red-600 text-lg font-bold mt-1">{item.price}</p>
                <p className="text-sm mt-1 text-gray-700">{item.desc}</p>
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center border rounded px-2 py-1">
                    <button
                      onClick={() => handleChange(idx, -1)}
                      className="text-xl px-2"
                    >−</button>
                    <span className="mx-2 w-6 text-center">{quantities[idx]}</span>
                    <button
                      onClick={() => handleChange(idx, 1)}
                      className="text-xl px-2"
                    >+</button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(idx)}
                    disabled={quantities[idx] === 0}
                    className={`px-3 py-1 text-sm rounded transition ${
                      quantities[idx] === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      

      {/* Thực đơn */}
      <section className="px-4 md:px-8 lg:px-16 py-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          THỰC ĐƠN CỦA <span className="text-red-600">UNIFOODIE</span>
        </h2>
        <p className="text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
          Những món ăn tươi ngon với hương vị tuyệt vời đến từ <span className="font-semibold text-red-600">UniFoodie</span> chắc chắn sẽ không làm bạn thất vọng. 
          Chọn món và nhấn đặt hàng, shipper nhà UniFoodie sẽ giao ngay món ăn đến tay bạn trong thời gian nhanh nhất!!!
        </p>



        {/* Danh mục món ăn */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382658/2_bqzn16.svg" alt="Bữa sáng" className="rounded-lg h-70 object-contain mx-auto" />
          <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382658/4_zjill3.svg" alt="Bữa trưa" className="rounded-lg h-70 object-contain mx-auto" />
          <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382657/5_r48q1e.svg" alt="Snack Bar" className="rounded-lg h-70 object-contain mx-auto" />
          <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382659/6_wwzmb3.svg" alt="Ưu đãi" className="rounded-lg h-70 object-contain mx-auto" />
          <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382658/1_xq9gqt.svg" alt="Đồ uống" className="rounded-lg h-70 object-contain mx-auto" />
          <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382660/3_ieusfb.svg" alt="Combo tiện lợi" className="rounded-lg h-70 object-contain mx-auto" />
        </div>
      </section>

    </div>
  );
};

export default Homepage;
