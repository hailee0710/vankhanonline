function initLunarDate() {
    try {
        const today = new Date();

        // Check if library is loaded
        if (typeof window._calendar === 'undefined') {
            console.warn("Library not loaded yet, retrying...");
            setTimeout(initLunarDate, 500);
            return;
        }

        // Create SolarDate from today's date
        const solar = new window._calendar.SolarDate(today);

        // Convert to LunarDate
        const lunar = solar.toLunarDate();

        // Get Can Chi names
        const dayName = lunar.getDayName();
        const monthName = lunar.getMonthName();
        const yearName = lunar.getYearName();

        // Update DOM elements
        document.getElementById('am-ngay').textContent = dayName;
        document.getElementById('am-thang').textContent = monthName;
        document.getElementById('am-nam').textContent = yearName;
    } catch (error) {
        console.error("Lỗi khi tính toán Lịch Âm:", error);
        document.getElementById('am-ngay').textContent = '... (Lỗi hệ thống)';
        document.getElementById('am-thang').textContent = '... (Lỗi hệ thống)';
        document.getElementById('am-nam').textContent = '... (Lỗi hệ thống)';
    }
}

document.addEventListener('DOMContentLoaded', initLunarDate);