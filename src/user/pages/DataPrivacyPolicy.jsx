import React from 'react';

const DataPrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-20 font-kanit text-gray-800">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase text-red-600 mb-8 text-center">
          Chính sách bảo mật của UniFoodie
        </h1>

        <div className="space-y-6 text-justify text-base md:text-lg leading-relaxed">
          <div>
            <h2 className="font-bold mb-2">1. Mục đích thu thập thông tin</h2>
            <p>
              Unifoodie thu thập thông tin cá nhân của khách hàng nhằm:
              <br />– Xác nhận và xử lý đơn hàng nhanh chóng, chính xác.
              <br />– Cải thiện chất lượng dịch vụ và trải nghiệm người dùng.
              <br />– Gửi thông báo về chương trình khuyến mãi, ưu đãi nếu khách hàng đồng ý nhận tin.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">2. Phạm vi thông tin thu thập</h2>
            <p>
              Các thông tin mà Unifoodie có thể thu thập bao gồm:
              <br />– Họ tên, số điện thoại, địa chỉ giao hàng.
              <br />– Thông tin thanh toán (nếu có).
              <br />– Thông tin thiết bị truy cập (địa chỉ IP, trình duyệt, thời gian truy cập…).
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">3. Phạm vi sử dụng thông tin</h2>
            <p>
              Thông tin cá nhân của khách hàng chỉ được sử dụng trong nội bộ hệ thống Unifoodie, cụ thể:
              <br />– Xử lý đơn hàng, hỗ trợ giao nhận.
              <br />– Tối ưu hóa dịch vụ và chăm sóc khách hàng.
              <br />– Gửi thông báo về thay đổi dịch vụ hoặc phản hồi các yêu cầu liên quan.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">4. Thời gian lưu trữ thông tin</h2>
            <p>
              Thông tin sẽ được lưu trữ cho đến khi khách hàng yêu cầu xóa hoặc khi Unifoodie ngừng hoạt động.
              <br />
              Trong mọi trường hợp, thông tin được lưu trữ trong môi trường bảo mật cao và có giới hạn quyền truy cập.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">5. Cam kết bảo mật thông tin</h2>
            <p>
              Unifoodie cam kết không chia sẻ, bán hoặc cho thuê thông tin cá nhân của khách hàng cho bên thứ ba dưới bất kỳ hình thức nào, trừ khi có yêu cầu pháp lý từ cơ quan chức năng.
              <br />
              Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu khỏi truy cập trái phép, mất mát hoặc thay đổi.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">6. Quyền của khách hàng</h2>
            <p>
              Khách hàng có quyền:
              <br />– Yêu cầu xem lại, chỉnh sửa hoặc xóa thông tin cá nhân của mình.
              <br />– Rút lại sự đồng ý cho phép sử dụng thông tin cá nhân bất cứ lúc nào.
              <br />– Gửi phản hồi hoặc khiếu nại về việc sử dụng thông tin qua các kênh liên hệ chính thức của Unifoodie.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">7. Liên hệ</h2>
            <p>
              Nếu có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến chính sách bảo mật, vui lòng liên hệ:
              <br />
              Email: <span className="text-red-600 font-medium">unifoodietakeaway@gmail.com</span>
              <br />
              Hotline: <span className="text-red-600 font-medium">0382868383</span>
              <br />
              Fanpage: <span className="text-red-600 font-medium">UniFoodie</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyPolicy;
