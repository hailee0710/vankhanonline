document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy ngày dương lịch hiện tại của máy người dùng
    const today = new Date();
    
    // Múi giờ Việt Nam (GMT+7)
    const timeZone = 7; 
    
    try {
        // Khởi tạo đối tượng lịch âm từ ngày dương lịch hiện tại
        // vietnameseDate được tải từ CDN trong index.html
        const lunarDate = vietnameseDate.fromSolar(today.getDate(), today.getMonth() + 1, today.getFullYear(), timeZone);
        
        // Định dạng 'F' trả về chuỗi đầy đủ Can Chi
        const fullFormatString = lunarDate.format('F'); 

        // 2. Trích xuất thông tin Can Chi từ chuỗi format 'F'
        // Biểu thức chính quy: tìm (ngày <Ngày Can Chi> tháng <Tháng Can Chi> năm <Năm Can Chi>)
        const regex = /\(ngày (.+?) tháng (.+?) năm (.+?)\)/;
        const match = fullFormatString.match(regex);
        
        if (match && match.length === 4) {
            const ngayCanChi = match[1]; // Vị trí 1: Ngày Can Chi
            const thangCanChi = match[2]; // Vị trí 2: Tháng Can Chi
            const namCanChi = match[3]; // Vị trí 3: Năm Can Chi

            // 3. Cập nhật nội dung vào HTML
            document.getElementById('am-ngay').textContent = ngayCanChi;
            // Xóa phần (nhuận) nếu có trong tên tháng
            document.getElementById('am-thang').textContent = thangCanChi.replace(/\s\(nhuận\)/g, ''); 
            document.getElementById('am-nam').textContent = namCanChi;
        } else {
            console.error("Không trích xuất được Can Chi. Chuỗi đầy đủ:", fullFormatString);
            document.getElementById('am-ngay').textContent = '... (Lỗi)';
            document.getElementById('am-thang').textContent = '... (Lỗi)';
            document.getElementById('am-nam').textContent = '... (Lỗi)';
        }

    } catch (error) {
        console.error("Lỗi khi tính toán Lịch Âm:", error);
        document.getElementById('am-ngay').textContent = '... (Lỗi hệ thống)';
        document.getElementById('am-thang').textContent = '... (Lỗi hệ thống)';
        document.getElementById('am-nam').textContent = '... (Lỗi hệ thống)';
    }
});