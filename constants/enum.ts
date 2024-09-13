export enum RoleName {
    superAdmin = 0,             // Quản trị viên cấp cao nhất
    admin = 1,                  // Quản trị viên chính của trang web
    moderator = 2,              // Người kiểm duyệt nội dung
    author = 3,                 // Tác giả truyện
    reader = 4,                 // Người đọc thông thường
    editor = 5,                 // Biên tập viên chỉnh sửa nội dung
    translator = 6,             // Dịch giả dịch truyện
    vipUser = 7,                // Người dùng VIP với quyền truy cập đặc biệt
    supporter = 8,              // Hỗ trợ viên kỹ thuật
    contributor = 9,            // Cộng tác viên đóng góp nội dung
    sponsor = 10,               // Nhà tài trợ truyện hoặc chương
    betaReader = 11,            // Người đọc thử truyện trước khi xuất bản
    accountant = 12,            // Quản lý tài chính và thanh toán
    marketingSpecialist = 13,   // Chuyên viên tiếp thị và quảng cáo
}
