import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-white text-black font-kanit ">
      {/* Header + Our Story */}
      <section className="px-4 md:px-8 lg:px-16 py-12 bg-[#fffdf7]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-red-600 text-4xl md:text-5xl font-extrabold mb-4">OUR STORY</h1>
            <p className="text-gray-700 text-base leading-relaxed text-justify max-w-lg">
              UniFoodie ra đời từ một ý tưởng đơn giản nhưng đầy cảm hứng – mang đến cho cộng đồng sinh viên và nhân viên tại UIT những bữa ăn ngon, tiện lợi và đầy đủ năng lượng trong một thế giới bận rộn.
              Sáng lập UniFoodie, đội ngũ sáng lập nhận thấy rằng sinh viên hay nhân viên luôn muốn tiết kiệm thời gian nhưng vẫn không muốn từ bỏ chất lượng của bữa ăn sáng và bữa trưa nhanh chóng nhưng vẫn đảm bảo dinh dưỡng và an toàn.
            </p>
          </div>
          <div>
            <img
              src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746430012/Beige_Modern_Cafe_Brunch_Event_Flyer_Business_Instagram_Post_1_uustn6.svg"
              alt="Logo"
              className="rounded-lg shadow w-80 md:w-[500px] lg:w-[500px]"
            />
          </div>
        </div>
      </section>

{/* Mission Section */}
<section className="px-4 md:px-8 lg:px-16 py-12 bg-[#fffdf7]">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
    <div className="flex justify-center md:justify-start">
      <img
        src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746430947/camket1_anfcjm.webp"
        alt="Camket"
        className="rounded-lg shadow w-80 md:w-[600px] lg:w-[500px]"
      />
    </div>
    <div className="max-w-xl">
      <h2 className="text-red-600 text-4xl md:text-5xl font-extrabold mb-4">SỨ MỆNH</h2>
      <p className="text-gray-700 text-base leading-relaxed text-justify mb-4">
        Sứ mệnh của UniFoodie là mang đến những bữa ăn chất lượng cao, thơm ngon và tiện lợi, phục vụ nhu cầu của cộng đồng sinh viên và nhân viên tại UIT.
        Chúng tôi cam kết đem đến sự kết hợp hoàn hảo giữa hương vị tuyệt vời và tốc độ giao hàng nhanh chóng, giúp bạn tiết kiệm thời gian và vẫn thưởng thức được những món ăn đầy đủ dinh dưỡng và đậm đà.
        UniFoodie không chỉ là một lựa chọn ăn uống, mà là người bạn đồng hành đáng tin cậy trong cuộc sống bận rộn của bạn.
      </p>
    </div>
  </div>
</section>

{/* Commitment Section */}
<section className="px-4 md:px-8 lg:px-16 py-12 bg-[#fffdf7]">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
    <div className="max-w-xl">
      <h2 className="text-red-600 text-4xl md:text-5xl font-extrabold mb-4">CAM KẾT</h2>
      <p className="text-gray-700 text-base leading-relaxed text-justify mb-4">
        Chất lượng vượt trội: Chúng tôi cam kết cung cấp những món ăn ngon miệng, tươi ngon và được chế biến từ nguyên liệu sạch, tươi mới nhất, đảm bảo an toàn và dinh dưỡng cho khách hàng.
      </p>
      <p className="text-gray-700 text-base leading-relaxed text-justify mb-4">
        Tốc độ giao hàng nhanh chóng: Với đội ngũ giao hàng chuyên nghiệp, UniFoodie cam kết mang đến trải nghiệm giao hàng nhanh chóng, giúp bạn tiết kiệm thời gian và vẫn có những bữa ăn đầy đủ, phục vụ mọi khoảnh khắc trong ngày.
      </p>
      <p className="text-gray-700 text-base leading-relaxed text-justify mb-4">
        Luôn sáng tạo và đổi mới: UniFoodie luôn lắng nghe khách hàng để cập nhật các món ăn mới, đáp ứng nhu cầu đa dạng của khách hàng. 
        Chúng tôi mang đến lựa chọn ăn uống healthy, phù hợp mọi khẩu vị.
      </p>
    </div>
    <div className="flex justify-center md:justify-end">
      <img
        src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746430946/sumenh1_mt5ici.jpg"
        alt="Sumenh"
        className="rounded-lg shadow w-80 md:w-[420px] lg:w-[500px]"
      />
    </div>
  </div>
</section>

{/* Team Section */}
<section className="px-4 md:px-8 lg:px-16 py-12 bg-[#fffdf7]">
  <h2 className="text-red-600 text-4xl md:text-5xl font-extrabold mb-8 text-center">ĐỘI NGŨ CỦA CHÚNG TÔI</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    <div className="flex flex-col items-center text-center">
      <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746432738/6_f303hd.jpg" alt="CEO" className="w-32 h-32 object-cover rounded-full shadow mb-4" />
      <h4 className="font-semibold text-lg">Nguyễn Ngọc Thanh Tuyền</h4>
      <p className="text-sm text-gray-600">Giám đốc điều hành</p>
    </div>
    <div className="flex flex-col items-center text-center">
      <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746432807/TTrung_mlhjwn.jpg" alt="Chef" className="w-32 h-32 object-cover rounded-full shadow mb-4" />
      <h4 className="font-semibold text-lg">Trần Quốc Trung</h4>
      <p className="text-sm text-gray-600">Bếp trưởng sáng tạo</p>
    </div>
    <div className="flex flex-col items-center text-center">
      <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746432856/IMG_1475_khktys.jpg" alt="Marketing" className="w-32 h-32 object-cover rounded-full shadow mb-4" />
      <h4 className="font-semibold text-lg">Võ Thị Phương Uyên</h4>
      <p className="text-sm text-gray-600">Trưởng bộ phận Marketing</p>
    </div>
    <div className="flex flex-col items-center text-center">
      <img src="https://res.cloudinary.com/dbr85jktp/image/upload/v1746432797/NamChill_rwixyc.png" alt="Operations" className="w-32 h-32 object-cover rounded-full shadow mb-4" />
      <h4 className="font-semibold text-lg">Nguyễn Công Nam Triều</h4>
      <p className="text-sm text-gray-600">Trưởng bộ phận Vận hành</p>
    </div>
  </div>
</section>
    </div>

  );
};

export default AboutUs;
