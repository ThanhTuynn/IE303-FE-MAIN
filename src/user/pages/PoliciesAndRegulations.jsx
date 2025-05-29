import React from 'react';

const PoliciesAndRegulation = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-20 font-kanit text-gray-800">
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-5xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-extrabold uppercase text-red-600 mb-8 text-center">
          Chính sách và quy định của UniFoodie
        </h1>

        <div className="space-y-6 text-justify text-base md:text-lg leading-relaxed">
          <div>
            <h2 className="font-bold mb-2">1. Chính sách đặt món</h2>
            <p>
              Đơn hàng chỉ được xác nhận sau khi khách hàng hoàn tất việc chọn món và nhận được thông báo xác nhận từ hệ thống.
              <br />
              Khách hàng cần kiểm tra kỹ đơn đặt hàng trước khi xác nhận để tránh sai sót không đáng có.
              <br />
              Mọi thay đổi đơn hàng sau khi xác nhận vui lòng liên hệ sớm nhất qua hotline hoặc fanpage.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">2. Chính sách hủy đơn</h2>
            <p>
              Khách hàng có thể hủy đơn hàng trong vòng 5 phút kể từ khi đặt nếu đơn chưa được chế biến.
              <br />
              Đối với các đơn đã bắt đầu chế biến hoặc đang giao, khách hàng không thể hủy để đảm bảo quyền lợi cho đội ngũ vận hành.
              <br />
              Trường hợp hủy nhiều lần không lý do rõ ràng có thể bị hạn chế sử dụng dịch vụ trong tương lai.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">3. Chính sách giao hàng</h2>
            <p>
              Giao hàng nhanh chóng trong khuôn viên UIT và các khu vực lân cận theo thời gian đã cam kết.
              <br />
              Trong điều kiện thời tiết xấu hoặc quá tải đơn hàng, thời gian giao có thể chậm hơn dự kiến – chúng tôi sẽ thông báo trước để khách hàng chủ động sắp xếp.
              <br />
              Người nhận vui lòng có mặt tại địa điểm hẹn đúng giờ để nhận món ăn nhanh chóng và đảm bảo chất lượng món.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">4. Chính sách đổi/trả món</h2>
            <p>
              Được áp dụng nếu món ăn:
              <br />– Không đúng với đơn đã đặt.
              <br />– Không đảm bảo chất lượng (nguội lạnh, hư hỏng, đổ vỡ).
              <br />
              Khách hàng cần phản hồi trong vòng 30 phút kể từ khi nhận hàng để được hỗ trợ đổi món hoặc hoàn tiền.
              <br />
              Không áp dụng đổi/trả với trường hợp món không hợp khẩu vị hoặc khách hàng thay đổi ý định.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">5. Chính sách thanh toán</h2>
            <p>
              Hỗ trợ các phương thức: tiền mặt, chuyển khoản, ví điện tử (Momo, ZaloPay...).
              <br />
              Thanh toán phải được hoàn tất trước hoặc khi giao hàng.
              <br />
              Chúng tôi cam kết bảo mật mọi thông tin thanh toán của khách hàng.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">6. Bảo mật thông tin</h2>
            <p>
              Thông tin cá nhân và đơn hàng của khách hàng được bảo mật tuyệt đối, không chia sẻ với bên thứ ba nếu không có sự đồng ý.
              <br />
              Unifoodie có quyền sử dụng dữ liệu tổng hợp (ẩn danh) cho mục đích phân tích và cải thiện dịch vụ.
            </p>
          </div>

          <div>
            <h2 className="font-bold mb-2">7. Hiệu lực và điều chỉnh</h2>
            <p>
              Các chính sách và quy định này có hiệu lực kể từ ngày đăng tải và có thể được điều chỉnh bất kỳ lúc nào để phù hợp với tình hình thực tế.
              <br />
              Mọi thay đổi sẽ được thông báo trên các kênh chính thức của Unifoodie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoliciesAndRegulation;
