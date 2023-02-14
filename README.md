
# NoteText

Website NoteText là một trang web giúp bạn lưu trữ và chia sẻ ghi chú một cách nhanh chóng, tiện lợi và dễ sử dụng.

[Link Website](https://notetext.noteblogs.site)

## Sử dụng các thư viện chính
- Hệ thống : subdomain từ NoteBlogs.
- Cơ sở dữ liệu : MongoDB.
- Front-end : Bootstrap 5, HTML5, CSS, JS, Jquery.
- Back-end : NodeJS, ExpressJS, JWT (Json Web Token).

## Chức năng chính
- Lưu trữ ghi chú
- Chia sẻ ghi chú với người khác
- Đặt mật khẩu và thay đổi tên(url) cho ghi chú
- Mã hóa mật khẩu để giữ an toàn
- Sử dụng JSON Web Token để giữ phiên đăng nhập cho ghi chú đó
- Tự động xóa ghi chú nếu không đặt mật khẩu trong 60 ngày tính từ thời gian tạo ghi chú

## Cài đặt
```
# Sau khi cài đặt môi trường

# Sao chép kho lữu trữ
git clone https://github.com/quangc992/notetext.git

# Vào thư mục
cd NoteText

# Tạo file local.env trong NoteText
touch local.env
vim local.env

# Chuyển sang chế độ soạn thảo bằng cách ấn phím `i`
# nhập nội dung cần thiết
KEYTOKENJWT=<mật khẩu mã hóa>
CONNECTMONGODB=<mã kết nối đến mongodb>
PORT=<port chạy>

# Để thoát ấn `Esc` gõ `:wq` và ấn Enter

# Cài đặt các thư viện phụ thuộc
npm install

# Khởi động
npm start
```
**Nói thêm :** *Mã KEYTOKENJWT trong file local.env được sử dụng để mã hóa jwt, nếu bạn cảm thấy không đủ bảo mật có thể sử dụng openssl để tạo khóa public key và private key tìm hiểu thêm [tại đây](https://www.google.com/search?q=how+to+create+openssl+private+key+jwt&oq=how+to+create+openssl+private+key+jwt&aqs=chrome.0.69i59l2j69i60.2296j0j4).
Hãy đọc code nếu bạn muốn sử dụng openssl, tôi đã để cập đến nó*


## Sử dụng
*domain example.com được lấy để làm ví dụ*
- Truy cập **example.com**
    - Kết quả: **example.com/GwPFs** (random)
    - **GwPFs** sẽ là tên ghi chú
- Truy cập **example.com/notetext**
    - Kết quả: **example.com/notetext** **notetext ví dụ*
    - **notetext** sẽ là tên ghi chú
- Nếu ghi chú có mật khẩu hãy điền mật khẩu và sử dụng
- Thay đổi tên ghi chú
- Thay đổi mật khẩu
    - Nếu ghi chú không được đặt mật khẩu dữ liệu đó sẽ bị xóa trong vòng 60 ngày để từ ngày tạo

Chúc mừng bạn đã cài đặt và sử dụng NoteText thành công!
