import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

const Homepage = () => {
    const [quantities, setQuantities] = useState([0, 0, 0]);

    const handleChange = (index, delta) => {
        setQuantities((prev) => {
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
            name: "Bánh mì thịt nướng",
            price: "20.000đ",
            desc: "Gồm bánh mì giòn, thịt nướng thơm ngon, kèm rau sống tươi, dưa leo và đồ chua, tạo nên hương vị đậm đà, hấp dẫn cho bữa sáng nhanh chóng và tiện lợi.",
            image: "https://res.cloudinary.com/dbr85jktp/image/upload/v1746384045/banhmithapcam_arredm.webp",
        },
        {
            name: "Cơm tấm Long Xuyên",
            price: "35.000đ",
            desc: "Gồm cơm tấm mềm mịn, sườn nướng thơm ngon, kèm bì, chả trứng, và rau sống tươi, tạo nên hương vị đậm đà, hấp dẫn cho bữa ăn nhanh chóng và đầy đủ năng lượng.",
            image: "https://res.cloudinary.com/dbr85jktp/image/upload/v1746384044/comtam_gum9ve.jpg",
        },
        {
            name: "Sinh tố dâu",
            price: "20.000đ",
            desc: "Dâu tươi xay nhuyễn cùng đá và sữa đặc, mang đến ly sinh tố mát lạnh, chua ngọt cân bằng, giàu vitamin – vừa ngon vừa tốt cho sức khỏe.",
            image: "https://res.cloudinary.com/dbr85jktp/image/upload/v1746426032/sinh_t%E1%BB%91_d%C3%A2u_ondcxh.jpg",
        },
    ];

    return (
        <div className="bg-gray-50 text-gray-900 font-kanit min-h-screen">
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
                    navigation={true}
                    className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
                >
                    <SwiperSlide>
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382142/i_m_avery_davis_4_pplo4x.png"
                            alt="Banner 1"
                            className="w-full h-full object-cover"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1747665970/2_hsx5dk.png"
                            alt="Banner 2"
                            className="w-full h-full object-cover"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1747665969/1_lcwn2n.png"
                            alt="Banner 3"
                            className="w-full h-full object-cover"
                        />
                    </SwiperSlide>
                </Swiper>
            </section>

            {/* Gợi ý cho bạn */}
            <section className="container-custom py-16 bg-white">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-center mb-12">
                    <span className="text-red-600">CÓ THỂ</span> BẠN SẼ THÍCH
                </h2>

                <Swiper
                    modules={[Navigation]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation
                    breakpoints={{
                        640: { slidesPerView: 1, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 24 },
                        1024: { slidesPerView: 3, spaceBetween: 32 },
                    }}
                    className="px-4"
                >
                    {products.map((item, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="product-card">
                                <img src={item.image} alt={item.name} className="product-image" />
                                <h3 className="product-title">{item.name}</h3>
                                <p className="product-price">{item.price}</p>
                                <p className="product-description">{item.desc}</p>
                                <div className="flex justify-between items-center gap-4">
                                    <div className="quantity-control">
                                        <button
                                            onClick={() => handleChange(idx, -1)}
                                            className="quantity-btn"
                                            disabled={quantities[idx] <= 0}
                                        >
                                            −
                                        </button>
                                        <span className="quantity-display">{quantities[idx]}</span>
                                        <button onClick={() => handleChange(idx, 1)} className="quantity-btn">
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleAddToCart(idx)}
                                        disabled={quantities[idx] === 0}
                                        className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-300 ${
                                            quantities[idx] === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "btn-primary"
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
            <section className="container-custom py-16 bg-gray-50">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        THỰC ĐƠN CỦA <span className="text-gradient-red">UNIFOODIE</span>
                    </h2>
                    <p className="text-base md:text-lg max-w-4xl mx-auto leading-relaxed text-gray-600">
                        Những món ăn tươi ngon với hương vị tuyệt vời đến từ{" "}
                        <span className="font-semibold text-red-600">UniFoodie</span> chắc chắn sẽ không làm bạn thất
                        vọng. Chọn món và nhấn đặt hàng, shipper nhà UniFoodie sẽ giao ngay món ăn đến tay bạn trong
                        thời gian nhanh nhất!!!
                    </p>
                </div>

                {/* Danh mục món ăn */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="menu-category">
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382658/2_bqzn16.svg"
                            alt="Bữa sáng tiện lợi"
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="menu-category">
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382658/4_zjill3.svg"
                            alt="Bữa trưa dinh dưỡng"
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="menu-category">
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382657/5_r48q1e.svg"
                            alt="UniFoodie Snack Bar"
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="menu-category">
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382659/6_wwzmb3.svg"
                            alt="Ưu đãi nóng hổi"
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="menu-category">
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382658/1_xq9gqt.svg"
                            alt="Đồ uống tươi mát"
                            className="w-full h-auto"
                        />
                    </div>
                    <div className="menu-category">
                        <img
                            src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746382660/3_ieusfb.svg"
                            alt="Combo tiện lợi"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Homepage;
