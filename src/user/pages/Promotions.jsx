import React, { useState } from 'react';
import { FaBreadSlice, FaUtensils, FaConciergeBell, FaSearch, FaDrumstickBite, FaHamburger, FaCoffee } from 'react-icons/fa';

const Promotions = () => {
  const allProducts = {
    "MÓN MỚI - GIÁ HỜI": {
      icon: <FaBreadSlice className="text-red-600 mr-2" />,
      items: [
        {
          name: 'Bánh mì thịt nướng',
          price: '30.000đ',
          desc: 'Thịt heo được ướp đậm đà theo công thức đặc biệt, nướng trên than hồng cho lớp vỏ ngoài cháy cạnh thơm lừng, bên trong mềm ngọt. Kẹp cùng pate béo ngậy, đồ chua giòn nhẹ, dưa leo mát lạnh và rau thơm tươi rói, tất cả hoà quyện trong ổ bánh mì nóng giòn vừa ra lò.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406267/banhmithapcam_gzfrza.webp'
        },
        {
          name: 'Bánh mì chả cá',
          price: '20.000đ',
          desc: 'Chả cá nóng hổi, chiên vàng giòn bên ngoài – dai mềm bên trong, đậm vị cá tươi, kẹp trong ổ bánh mì giòn rụm. Ăn kèm rau sống, dưa leo, đồ chua và một chút tương ớt/mayonnaise cho thêm phần đậm đà.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406262/banh-mi-cha-ca_y147ew.png'
        },
        {
          name: 'Bánh mì trứng',
          price: '20.000đ',
          desc: 'Ổ bánh mì nóng giòn kết hợp cùng trứng ốp la béo ngậy, lòng đỏ tan chảy đầy hấp dẫn. Thêm chút pate, dưa leo, rau thơm và nước sốt đặc biệt – tạo nên hương vị giản dị nhưng luôn khiến người ăn hài lòng.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406261/banh-mi-trung_epbvbo.webp'
        },
        {
          name: 'Bánh mì gà xé',
          price: '25.000đ',
          desc: 'Thịt gà được luộc chín rồi xé sợi vừa ăn, trộn cùng nước sốt mặn ngọt đậm đà, thấm đều từng thớ thịt. Kẹp trong ổ bánh mì giòn rụm, thêm pate béo nhẹ, rau thơm, dưa leo và đồ chua giòn mát – tạo nên một món ăn vừa đủ chất, vừa dễ ăn, phù hợp cho mọi bữa trong ngày.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406261/banh-mi-ga-xe_zp4jvh.jpg'
        },
        {
          name: 'Bánh mì pate thịt nguội',
          price: '25.000đ',
          desc: 'Pate béo mịn, thơm ngậy kết hợp hoàn hảo với lớp thịt nguội mềm, dai nhẹ, tạo nên hương vị hài hòa đầy cuốn hút. Kẹp cùng dưa leo, rau thơm, đồ chua giòn giòn và sốt đặc trưng – tất cả được gói gọn trong ổ bánh mì nóng giòn.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406259/banh-mi-thit-nguoi_r44fm0.jpg'
        },
        {
          name: 'Bánh mì chay',
          price: '20.000đ',
          desc: 'Thanh đạm nhưng vẫn đủ vị...',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406258/banh-mi-bi-cha-chay_jbawk5.jpg'
        }
      ]
    },
    "COMBO 1 NGƯỜI": {
      icon: <FaUtensils className="text-red-600 mr-2" />,
      items: [
        {
          name: 'Mì trộn thập cẩm',
          price: '30.000đ',
          desc: 'Mì trộn dai ngon, kết hợp đầy đủ topping: trứng, chả, xúc xích, rau củ… và sốt đặc biệt đậm đà. Mỗi đũa mì là một hương vị tổng hòa, vừa lạ miệng, vừa đầy đủ dinh dưỡng.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406257/mi-tron-thap-cam_ubo558.jpg'
        },
        {
          name: 'Mì trộn tóp mỡ',
          price: '25.000đ',
          desc: 'Tóp mỡ chiên giòn tan, béo nhưng không ngấy, trộn cùng mì và nước sốt cay ngọt kích thích vị giác. Món ăn “gây nghiện” cho tín đồ yêu sự giòn rụm.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406256/mi-tron-top-mo-1024x768_gy6aqx.jpg'
        },
        {
          name: 'Mì trộn cá viên',
          price: '20.000đ',
          desc: 'Cá viên chiên nóng hổi, dai ngon, ăn kèm mì trộn sốt đặc biệt, thêm rau sống và chút hành phi thơm giòn – một lựa chọn vừa nhanh, vừa no..',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406255/mi-tron-ca-vien_w7ljvb.png'
        },
        {
          name: 'Mì xào bò',
          price: '35.000đ',
          desc: 'Thịt bò mềm, được xào cùng rau củ tươi và mì dai thơm. Gia vị đậm đà, hấp dẫn ngay từ miếng đầu tiên.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406255/cach-lam-mi-xao-bo_lwwz8s.webp'
        },
        {
          name: 'Mì trộn trứng lòng đào',
          price: '25.000đ',
          desc: 'Trứng lòng đào béo ngậy kết hợp với mì trộn sốt cay mặn vừa miệng, tạo nên sự hoà quyện đầy lôi cuốn, thích hợp cho cả bữa sáng lẫn bữa chiều.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406253/mi-tron-trung-long-dao_msng4e.jpg'
        },
        {
          name: 'Mì trộn xúc xích',
          price: '20.000đ',
          desc: 'Mì trộn với xúc xích chiên thơm ngon, ăn kèm rau củ và sốt trộn đậm vị – đơn giản mà “chất”.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406252/mi-tron-xuc-xich_pb8ibh.webp'
        }
      ]
    },
    "COMBO CẶP ĐÔI": {
      icon: <FaConciergeBell className="text-red-600 mr-2" />,
      items: [
        {
          name: 'Xôi thập cẩm',
          price: '30.000đ',
          desc: 'Xôi nếp dẻo thơm với đầy đủ topping: chả, trứng, pate, thịt xá xíu… phủ đều hành phi và nước sốt đặc biệt. Một bữa sáng “xịn sò” cho ngày mới đầy năng lượng.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406252/xoi-thap-cam_r5jdup.png'
        },
        {
          name: 'Xôi gà',
          price: '25.000đ',
          desc: 'Thịt gà xé hoặc gà chiên giòn, ăn kèm xôi nóng hổi, hành phi thơm và sốt gà mặn ngọt đặc trưng. Vừa ngon vừa no lâu.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406250/xoi-ga-dau-xanh-880.jpg_cezkyj.webp'
        },
        {
          name: 'Xôi ngọt',
          price: '15.000đ',
          desc: 'Xôi bắp, ăn kèm dừa nạo và đậu xanh sên ngọt nhẹ – món ăn vặt dân dã, hợp cho bữa sáng hoặc buổi xế.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406250/xoi-ngot_pgevhu.jpg'
        },
        {
          name: 'Xôi mặn',
          price: '25.000đ',
          desc: 'Xôi trắng dẻo mềm, topping chà bông, lạp xưởng, trứng cút, pate… thêm chút nước sốt mặn ngọt tạo nên món ăn sáng “quốc dân” hấp dẫn.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406249/xoi-man_r3jhuk.jpg'
        },
        {
          name: 'Xôi gấc',
          price: '20.000đ',
          desc: 'Màu đỏ tự nhiên từ gấc chín, dẻo thơm và đẹp mắt. Có thể ăn kèm muối mè, đậu xanh hoặc chà bông tùy sở thích.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406248/xoi-gac_dimcdt.avif'
        },
        {
          name: 'Xôi chà bông',
          price: '25.000đ',
          desc: 'Xôi trắng ăn kèm chà bông mặn mặn, béo thơm, rắc thêm chút hành phi và tương ớt – đơn giản nhưng luôn ngon miệng.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406249/xoi-cha-bong_qe3vqz.jpg'
        }
      ]
    },

    "CÀNG ĐÔNG CÀNG DZUI": {
      icon: <FaDrumstickBite className="text-red-600 mr-2" />,
      items: [
        {
          name: 'Cơm gà sốt cay',
          price: '30.000đ',
          desc: 'Thịt gà được chiên giòn lớp vỏ ngoài, bên trong mềm mọng, sau đó áo đều lớp sốt cay ngọt đặc trưng, cay vừa phải, kích thích vị giác. Ăn kèm cơm trắng dẻo thơm, dưa leo và nước sốt chấm kèm.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746426048/com-ga-sot-cay_mxhuf8.jpg'
        },
        {
          name: 'Cơm gà xối mỡ',
          price: '30.000đ',
          desc: 'Gà luộc chín tới rồi xối mỡ nóng cho da giòn rụm, thịt mềm ngọt. Kết hợp cùng cơm trắng hoặc cơm chiên nhẹ, thêm đồ chua và nước mắm gừng pha vừa miệng.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746426047/c%C6%A1m_g%C3%A0_x%E1%BB%91i_m%E1%BB%A1_touoxu.jpg'
        },
        {
          name: 'Cơm thịt heo chiên xù',
          price: '30.000đ',
          desc: 'Miếng thịt heo được lăn qua lớp bột chiên xù, chiên vàng giòn đều hai mặt. Cắt miếng vừa ăn, ăn cùng cơm nóng, rau luộc và nước mắm chua ngọt.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746426046/c%C6%A1m_th%E1%BB%8Bt_heo_chi%C3%AAn_x%C3%B9_op0yhg.jpg'
        },
        {
          name: 'Cơm chiên dương châu',
          price: '25.000đ',
          desc: 'Cơm rang với trứng, lạp xưởng, cà rốt, đậu Hà Lan… tạo nên màu sắc rực rỡ và hương vị hài hòa. Từng hạt cơm tơi, thấm vị, không bị khô.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746426044/com-chien-duong-chau_tb9ohi.jpg'
        },
        {
          name: 'Cơm xào bò',
          price: '30.000đ',
          desc: 'Thịt bò thái lát mỏng, ướp gia vị rồi xào nóng với hành tây, rau cải và cơm trắng. Từng miếng bò mềm, thơm mùi tỏi gừng, kết hợp cùng cơm nóng hổi đầy hấp dẫn.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746426043/c%C6%A1m_x%C3%A0o_b%C3%B2_ckrf3l.png'
        },
        {
          name: 'Cơm tấm Long Xuyên',
          price: '30.000đ',
          desc: 'Hạt tấm nhỏ mềm, thơm đặc trưng, ăn cùng sườn nướng vàng ươm, bì, chả trứng hấp và mỡ hành béo ngậy. Dùng kèm nước mắm pha chua ngọt chuẩn vị miền Tây.',
          image: 'https://res.cloudinary.com/dbr85jktp/image/upload/v1746406266/comtam_me2mck.jpg'
        }
      ]
    },

  };

  const allItems = Object.values(allProducts).flatMap(obj => obj.items);
  const [quantities, setQuantities] = useState(Array(allItems.length).fill(0));
  const [search, setSearch] = useState('');

  const handleChange = (index, delta) => {
    setQuantities(prev => {
      const updated = [...prev];
      updated[index] = Math.max(0, updated[index] + delta); 
      return updated;
    });
  };
  

  const handleAddToCart = (index) => {
    if (quantities[index] > 0) {
      alert('Đã thêm vào giỏ hàng!');
    }
  };

  return (
    <div className="bg-white text-black font-kanit px-4 md:px-8 lg:px-16 py-10 zoom-75">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-600">DEAL CỰC CHẤT, <span className="text-black">NHẤT KHÁCH HÀNG</span></h1>
        <p className="text-gray-700 mt-2 max-w-3xl mx-auto">
        Chào đón bạn với những ưu đãi siêu ngọt ngào mà chỉ UniFoodie mới có! 🎉 Đặt hàng thả ga, nhận ngay giảm giá cực kỳ hấp dẫn với tốc độ giao hàng ánh sáng ✨✨
        </p>
        <div className="mt-6 max-w-lg mx-auto relative">
          <input
            type="text"
            className="w-full py-3 pl-5 pr-12 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Tìm món bạn yêu thích..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-800">
            <FaSearch size={18} />
          </button>
        </div>
      </div>

      {search.trim() ? (
        (() => {
          const filteredItems = allItems
            .map((item, index) => ({ ...item, index }))
            .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

          return (
            <section className="mb-12">
              <h2 className="text-2xl md:text-1xl font-bold mb-6 flex items-center">
                <FaSearch className="text-red-600 mr-2" />
                <span className="text-red-600">Kết quả tìm kiếm</span>
              </h2>
              {filteredItems.length === 0 ? (
                <p className="text-gray-600">Không tìm thấy món nào phù hợp.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <div
                      key={item.index}
                      className="border rounded-xl shadow p-4 bg-white flex flex-col justify-between min-h-[400px]"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-md mb-3" />
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-red-600 font-bold mt-1">{item.price}</p>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-4 overflow-hidden">{item.desc}</p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded px-2 py-1">
                          <button onClick={() => handleChange(item.index, -1)} className="px-2 text-xl">−</button>
                          <span className="px-3">{quantities[item.index]}</span>
                          <button onClick={() => handleChange(item.index, 1)} className="px-2 text-xl">+</button>
                        </div>
                        <button
                          disabled={quantities[item.index] === 0}
                          onClick={() => handleAddToCart(item.index)}
                          className={`text-sm px-4 py-1 rounded transition duration-300 ${
                            quantities[item.index] === 0
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700'
                          }`}
                        >
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })()
      ) : (
        Object.entries(allProducts).map(([category, { icon, items }], catIdx) => (
          <section key={category} className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 flex items-center">
              {icon}
              <span className="text-red-600">{category}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => {
                const globalIndex = catIdx * 6 + index;
                return (
                  <div
                    key={index}
                    className="border rounded-xl shadow p-4 bg-white flex flex-col justify-between min-h-[400px]"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-md mb-3" />
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-red-600 font-bold mt-1">{item.price}</p>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-4 overflow-hidden">{item.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border rounded px-2 py-1">
                        <button onClick={() => handleChange(globalIndex, -1)} className="px-2 text-xl">−</button>
                        <span className="px-3">{quantities[globalIndex]}</span>
                        <button onClick={() => handleChange(globalIndex, 1)} className="px-2 text-xl">+</button>
                      </div>
                      <button
                        disabled={quantities[globalIndex] === 0}
                        onClick={() => handleAddToCart(globalIndex)}
                        className={`text-sm px-4 py-1 rounded transition duration-300 ${
                          quantities[globalIndex] === 0
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
};

export default Promotions;