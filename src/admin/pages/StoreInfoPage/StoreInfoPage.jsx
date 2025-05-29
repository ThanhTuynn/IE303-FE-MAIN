import React, { useState } from "react";
import Topbar from "../../component/TopbarComponent/TopbarComponent";
import FooterComponent from "../../component/FooterComponent/FooterComponent";
import "./StoreInfoPage.scss";
import {
  IdcardOutlined,
  EditOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  ShopOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
} from "@ant-design/icons";
import AvatarStore from "../../asset/Logo_notext.png";

const StoreInfo = () => {
  // Function: Mô tả cửa hàng
  const [activeTabInfoDetail, setActiveTabInfoDetail] = useState("ourStory");
  const [isEditingInfoDetail, setIsEditingInfoDetail] = useState(false);
  const [editableContentInfoDetail, setEditableContentInfoDetail] =
    useState("");
  const handleEditInfoDetail = () => {
    setIsEditingInfoDetail(true);
    setEditableContentInfoDetail(tabContentInfoDetail[activeTabInfoDetail]);
  };
  const handleSaveInfoDetail = () => {
    setIsEditingInfoDetail(false);
    tabContentInfoDetail[activeTabInfoDetail] = editableContentInfoDetail; // Cập nhật nội dung
    alert("Mô tả cửa hàng đã được lưu!");
  };

  // Function: Chính sách của cửa hàng
  const [activeTabPolicy, setActiveTabPolicy] = useState("policyActive");
  const [isEditingIPolicy, setIsEditingPolicy] = useState(false);
  const [editableContentPolicy, setEditableContentPolicy] = useState("");
  const handleEditPolicy = () => {
    setIsEditingPolicy(true);
    setEditableContentPolicy(tabContentPolicy[activeTabPolicy]);
  };
  const handleSavePolicy = () => {
    setIsEditingPolicy(false);
    tabContentPolicy[activeTabPolicy] = editableContentPolicy; // Cập nhật nội dung
    alert("Chính sách của cửa hàng đã được lưu!");
  };

  // Function: Thông tin thanh toán
  const handleEditPayingMethods = () => {
    setIsEditingPayingMethods(true);
  };

  const handleSavePayingMethods = () => {
    setIsEditingPayingMethods(false);
    alert("Thông tin thanh toán đã được lưu!");
  };
  const [isEditingPayingMethods, setIsEditingPayingMethods] = useState(false);

  // Function: Thông tin cửa hàng
  const [isEditingStoreInfo, setIsEditingStoreInfo] = useState(false);
  const handleEditStoreInfo = () => {
    setIsEditingStoreInfo(true);
  };

  const handleSaveStoreInfo = () => {
    setIsEditingStoreInfo(false);
    alert("Thông tin cửa hàng đã được lưu!");
  };

  // Nội dung cho từng Thông tin chi tiết cửa hàng
  const [editableStoreInfo, setEditableStoreInfo] = useState({
    taxCode: "MST-10032025",
    email: "unifoodietakeaway@gmail.com",
    address: "Khu phố 6, phường Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh",
    phone: "093 321 5698",
    businessType: "Cửa hàng thức ăn/đồ uống",
  });

  // Nội dung cho từng Thông tin thanh toán
  const [editablePayingMethods, setEditablePayingMethods] = useState([
    {
      id: 1,
      icon: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
      content: "093 321 5698 - UniFoodieShop",
    },
    {
      id: 2,
      icon: "https://cdn.brandfetch.io/id_T-oXJkN/w/800/h/800/theme/dark/icon.jpeg",
      content: "093 321 5698 - UniFoodieShop",
    },
    {
      id: 3,
      icon: "https://ibrand.vn/wp-content/uploads/2022/10/NDTH-Vietcombank-3-min.png",
      content: "1018905429 - Vietcombank - UniFoodieShop",
    },
  ]);

  // Nội dung cho từng Mô tả cửa hàng
  const tabContentInfoDetail = {
    ourStory:
      "UniFoodie ra đời từ một ý tưởng đơn giản nhưng đầy cảm hứng – mang đến cho cộng đồng sinh viên và nhân viên tại UIT những bữa ăn ngon, tiện lợi và đầy đủ năng lượng trong một thế giới bận rộn. Sáng lập UniFoodie, đội ngũ sáng lập nhận thấy rằng sinh viên và những người làm việc tại trường thường gặp khó khăn trong việc tìm kiếm các lựa chọn ăn sáng và bữa trưa nhanh chóng nhưng vẫn đảm bảo chất lượng và dinh dưỡng.",
    mission:
      "Sứ mệnh của UniFoodie là mang đến những bữa ăn chất lượng cao, thơm ngon và tiện lợi, phục vụ nhu cầu của cộng đồng sinh viên và nhân viên tại UIT. Chúng tôi cam kết đem đến sự kết hợp hoàn hảo giữa hương vị tuyệt vời và tốc độ giao hàng nhanh chóng, giúp bạn tiết kiệm thời gian mà vẫn thưởng thức được những món ăn đầy đủ dinh dưỡng và đậm đà. UniFoodie không chỉ là một lựa chọn ăn uống, mà là người bạn đồng hành đáng tin cậy trong cuộc sống bận rộn của bạn.",
    commitment: `Chất lượng vượt trội: Chúng tôi cam kết cung cấp những món ăn ngon miệng, tươi ngon và được chế biến từ nguyên liệu sạch, tươi mới nhất, đảm bảo an toàn và dinh dưỡng cho khách hàng. 

Tốc độ giao hàng nhanh chóng: Với đội ngũ giao hàng chuyên nghiệp, UniFoodie cam kết mang đến dịch vụ giao hàng nhanh chóng, giúp bạn tiết kiệm thời gian mà vẫn đảm bảo bữa ăn được phục vụ nóng hổi và đúng giờ. 

Đem lại trải nghiệm tuyệt vời: Chúng tôi luôn lắng nghe và cải thiện từng món ăn, dịch vụ để mang đến sự hài lòng tối đa cho khách hàng, từ chất lượng món ăn đến sự tiện lợi trong dịch vụ. Luôn sáng tạo và đổi mới: UniFoodie luôn nỗ lực sáng tạo và cập nhật các món ăn mới, đáp ứng nhu cầu đa dạng của khách hàng, từ món ăn truyền thống Việt Nam đến các lựa chọn healthy, phục vụ mọi khẩu vị.`,
  };

  // Nội dung cho từng Chính sách của cửa hàng
  const tabContentPolicy = {
    policyActive: `Chính sách vận hành giúp đảm bảo hoạt động minh bạch, nhất quán giữa cửa hàng và khách hàng.

1. Chính sách đặt hàng
Khách hàng có thể đặt hàng trực tuyến qua website/app hoặc gọi trực tiếp.

Đơn hàng chỉ được xác nhận sau khi UniFoodies liên hệ và xác thực.

2. Chính sách thanh toán
Chấp nhận các hình thức: tiền mặt khi nhận hàng (COD), chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay, v.v.).

Hóa đơn được cung cấp theo yêu cầu.

3. Chính sách giao hàng
Thời gian giao hàng: từ 30–60 phút trong khu vực nội thành (tuỳ khu vực).

Phí giao hàng được thông báo trước khi xác nhận đơn.

Giao hàng miễn phí với đơn trên X VNĐ (tùy quy định từng thời kỳ).

4. Chính sách đổi/trả hàng
Áp dụng trong vòng 24h kể từ lúc nhận hàng với các sản phẩm lỗi, hư hỏng, không đúng mô tả.

Khách hàng cần cung cấp hình ảnh, video và hóa đơn để được hỗ trợ.`,
    policyGeneral: `Chính sách nội bộ nhằm đảm bảo cửa hàng UniFoodies vận hành hiệu quả, chuyên nghiệp và tuân thủ luật pháp.

1. Giờ hoạt động
Mở cửa từ 8:00 – 21:00 tất cả các ngày trong tuần.

Ngày lễ có thể điều chỉnh thời gian hoạt động và sẽ thông báo trước.

2. Vệ sinh & an toàn thực phẩm
Tất cả sản phẩm đều đảm bảo an toàn vệ sinh thực phẩm theo quy định của Bộ Y tế.

Nhân viên chế biến, đóng gói tuân thủ quy trình khử khuẩn và đeo đồ bảo hộ.

3. Thái độ phục vụ
Nhân viên phải thân thiện, trung thực, tôn trọng khách hàng.

Không có hành vi gây phiền nhiễu, phân biệt đối xử.

4. Quản lý & đào tạo nhân sự
Nhân viên mới cần hoàn thành khoá đào tạo cơ bản về sản phẩm, dịch vụ và kỹ năng giao tiếp.

Nhân viên vi phạm nội quy sẽ bị xử lý theo mức độ từ nhắc nhở đến cho nghỉ việc.

5. Xử lý khiếu nại
Mọi phản hồi từ khách hàng được tiếp nhận qua hotline, email hoặc fanpage.

Thời gian phản hồi: tối đa 24h kể từ lúc tiếp nhận thông tin.`,
    policySecurity: `UniFoodies cam kết bảo vệ tuyệt đối các thông tin cá nhân của khách hàng. Chính sách bảo mật thông tin được xây dựng nhằm minh bạch trong việc thu thập, sử dụng và bảo vệ thông tin.
      
1. Thu thập thông tin
Các thông tin có thể được thu thập bao gồm: Họ tên, số điện thoại, địa chỉ giao hàng, email, lịch sử đơn hàng, phương thức thanh toán, v.v.

Thông tin được thu thập qua website, ứng dụng di động, tổng đài, hoặc khi khách hàng điền vào form khảo sát, đặt hàng.

2. Mục đích sử dụng
- Xử lý đơn hàng và giao hàng đến đúng địa chỉ.
- Gửi thông báo về đơn hàng, chương trình khuyến mãi, hoặc cập nhật từ UniFoodies.
- Cải thiện dịch vụ và trải nghiệm người dùng.

3. Cam kết bảo mật
- Chúng tôi không chia sẻ, trao đổi hay bán thông tin của khách hàng cho bên thứ ba.
- Thông tin khách hàng được lưu trữ trên hệ thống bảo mật và chỉ truy cập bởi người có thẩm quyền.
- Trong trường hợp pháp luật yêu cầu, chúng tôi sẽ cung cấp thông tin theo đúng quy định.

4. Thời gian lưu trữ
Dữ liệu cá nhân được lưu trữ đến khi khách hàng có yêu cầu hủy bỏ hoặc tự xóa tài khoản.`,
  };

  return (
    <div className="store-info-container">
      <Topbar title="THÔNG TIN CỬA HÀNG" />
      <div className="main-content">
        {/* Cột bên trái: Thông tin cửa hàng */}
        <div className="left-column">
          <div className="store-info">
            <div className="header-background"></div>
            <div className="store-logo">
              <img
                src={AvatarStore}
                alt="UniFoodie Logo"
                className="logo-image"
              />
              <div className="edit-logo">
                {isEditingStoreInfo ? (
                  <button className="send-button" onClick={handleSaveStoreInfo}>
                    <SendOutlined />
                  </button>
                ) : (
                  <button className="edit-button" onClick={handleEditStoreInfo}>
                    <EditOutlined />
                  </button>
                )}
              </div>
            </div>
            <h2 className="store-name">UniFoodie</h2>
            <span className="store-status active">Hoạt động</span>
            <hr className="divider" />
            <ul className="store-details">
              <li>
                <i className="icon">
                  <IdcardOutlined />
                </i>
                <div className="detail-content-wrapper">
                  <span className="detail-title">Mã số thuế</span>
                  {isEditingStoreInfo ? (
                    <input
                      type="text"
                      value={editableStoreInfo.taxCode}
                      onChange={(e) =>
                        setEditableStoreInfo({
                          ...editableStoreInfo,
                          taxCode: e.target.value,
                        })
                      }
                      className="detail-input"
                    />
                  ) : (
                    <span className="detail-content">
                      {editableStoreInfo.taxCode}
                    </span>
                  )}
                </div>
              </li>
              <li>
                <i className="icon">
                  <MailOutlined />
                </i>
                <div className="detail-content-wrapper">
                  <span className="detail-title">E-mail</span>
                  {isEditingStoreInfo ? (
                    <input
                      type="text"
                      value={editableStoreInfo.email}
                      onChange={(e) =>
                        setEditableStoreInfo({
                          ...editableStoreInfo,
                          email: e.target.value,
                        })
                      }
                      className="detail-input"
                    />
                  ) : (
                    <span className="detail-content">
                      {editableStoreInfo.email}
                    </span>
                  )}
                </div>
              </li>
              <li>
                <i className="icon">
                  <EnvironmentOutlined />
                </i>
                <div className="detail-content-wrapper">
                  <span className="detail-title">Địa chỉ</span>
                  {isEditingStoreInfo ? (
                    <input
                      type="text"
                      value={editableStoreInfo.address}
                      onChange={(e) =>
                        setEditableStoreInfo({
                          ...editableStoreInfo,
                          address: e.target.value,
                        })
                      }
                      className="detail-input"
                    />
                  ) : (
                    <span className="detail-content">
                      {editableStoreInfo.address}
                    </span>
                  )}
                </div>
              </li>
              <li>
                <i className="icon">
                  <PhoneOutlined />
                </i>
                <div className="detail-content-wrapper">
                  <span className="detail-title">Số điện thoại</span>
                  {isEditingStoreInfo ? (
                    <input
                      type="text"
                      value={editableStoreInfo.phone}
                      onChange={(e) =>
                        setEditableStoreInfo({
                          ...editableStoreInfo,
                          phone: e.target.value,
                        })
                      }
                      className="detail-input"
                    />
                  ) : (
                    <span className="detail-content">
                      {editableStoreInfo.phone}
                    </span>
                  )}
                </div>
              </li>
              <li>
                <i className="icon">
                  <ShoppingCartOutlined />
                </i>
                <div className="detail-content-wrapper">
                  <span className="detail-title">Loại hình kinh doanh</span>
                  {isEditingStoreInfo ? (
                    <input
                      type="text"
                      value={editableStoreInfo.businessType}
                      onChange={(e) =>
                        setEditableStoreInfo({
                          ...editableStoreInfo,
                          businessType: e.target.value,
                        })
                      }
                      className="detail-input"
                    />
                  ) : (
                    <span className="detail-content">
                      {editableStoreInfo.businessType}
                    </span>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Cột bên phải: Thông tin thanh toán, mô tả, chính sách */}
        <div className="right-column">
          <div className="info">
            <div className="header">
              <h3 className="section-title">
                <CreditCardOutlined className="icon" /> Thông tin thanh toán
              </h3>
              <div>
                {isEditingPayingMethods ? (
                  <button
                    className="send-button"
                    onClick={handleSavePayingMethods}
                  >
                    <SendOutlined />
                  </button>
                ) : (
                  <button
                    className="edit-button"
                    onClick={handleEditPayingMethods}
                  >
                    <EditOutlined />
                  </button>
                )}
              </div>
            </div>
            <hr className="divider" />
            <ul className="payment-methods">
              {editablePayingMethods.map((method, index) => (
                <li key={method.id}>
                  <img
                    src={method.icon}
                    alt={`Payment Method ${index + 1}`}
                    className="payment-icon"
                  />
                  {isEditingPayingMethods ? (
                    <input
                      type="text"
                      value={method.content}
                      onChange={(e) => {
                        const updatedMethods = [...editablePayingMethods];
                        updatedMethods[index].content = e.target.value;
                        setEditablePayingMethods(updatedMethods);
                      }}
                      className="payment-input"
                    />
                  ) : (
                    <span className="payment-content">{method.content}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="info">
            <div className="header">
              <h3 className="section-title">
                <ShopOutlined className="icon" /> Mô tả cửa hàng
              </h3>
              <div>
                {isEditingInfoDetail ? (
                  <button
                    className="send-button"
                    onClick={handleSaveInfoDetail}
                  >
                    <SendOutlined />
                  </button>
                ) : (
                  <button
                    className="edit-button"
                    onClick={handleEditInfoDetail}
                  >
                    <EditOutlined />
                  </button>
                )}
              </div>
            </div>
            <hr className="divider" />
            <div className="info-tabs">
              <button
                className={`tab ${
                  activeTabInfoDetail === "ourStory" ? "active" : ""
                }`}
                onClick={() => setActiveTabInfoDetail("ourStory")}
              >
                Our story
              </button>
              <button
                className={`tab ${
                  activeTabInfoDetail === "mission" ? "active" : ""
                }`}
                onClick={() => setActiveTabInfoDetail("mission")}
              >
                Sứ mệnh
              </button>
              <button
                className={`tab ${
                  activeTabInfoDetail === "commitment" ? "active" : ""
                }`}
                onClick={() => setActiveTabInfoDetail("commitment")}
              >
                Cam kết
              </button>
            </div>
            <div className="textarea-container">
              <div className="info-content-wrapper">
                {isEditingInfoDetail ? (
                  <textarea
                    className="info-content"
                    value={editableContentInfoDetail}
                    onChange={(e) =>
                      setEditableContentInfoDetail(e.target.value)
                    }
                  ></textarea>
                ) : (
                  <div className="info-content">
                    {tabContentInfoDetail[activeTabInfoDetail]}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="info">
            <div className="header">
              <h3 className="section-title">
                <SafetyCertificateOutlined className="icon" /> Chính sách của
                cửa hàng
              </h3>
              <div>
                {isEditingIPolicy ? (
                  <button className="send-button" onClick={handleSavePolicy}>
                    <SendOutlined />
                  </button>
                ) : (
                  <button className="edit-button" onClick={handleEditPolicy}>
                    <EditOutlined />
                  </button>
                )}
              </div>
            </div>
            <hr className="divider" />
            <div className="info-tabs">
              <button
                className={`tab ${
                  activeTabPolicy === "policyActive" ? "active" : ""
                }`}
                onClick={() => setActiveTabPolicy("policyActive")}
              >
                Chính sách hoạt động
              </button>
              <button
                className={`tab ${
                  activeTabPolicy === "policyGeneral" ? "active" : ""
                }`}
                onClick={() => setActiveTabPolicy("policyGeneral")}
              >
                Chính sách và quy định
              </button>
              <button
                className={`tab ${
                  activeTabPolicy === "policySecurity" ? "active" : ""
                }`}
                onClick={() => setActiveTabPolicy("policySecurity")}
              >
                Chính sách bảo mật thông tin
              </button>
            </div>
            <div className="textarea-container">
              <div className="info-content-wrapper">
                <div className="info-content-wrapper">
                  {isEditingIPolicy ? (
                    <textarea
                      className="info-content"
                      value={editableContentPolicy}
                      onChange={(e) => setEditableContentPolicy(e.target.value)}
                    ></textarea>
                  ) : (
                    <div className="info-content">
                      {tabContentPolicy[activeTabPolicy]}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default StoreInfo;
