// Lunar calendar conversion functions
const canChiYears = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const canChiMonths = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Mười hai'];
const canChiDays = ['Mùng 1', 'Mùng 2', 'Mùng 3', 'Mùng 4', 'Mùng 5', 'Mùng 6', 'Mùng 7', 'Mùng 8', 'Mùng 9', 'Mùng 10',
    'Mùng 11', 'Mùng 12', 'Mùng 13', 'Mùng 14', 'Mùng 15', 'Mùng 16', 'Mùng 17', 'Mùng 18', 'Mùng 19', 'Mùng 20',
    'Mùng 21', 'Mùng 22', 'Mùng 23', 'Mùng 24', 'Mùng 25', 'Mùng 26', 'Mùng 27', 'Mùng 28', 'Mùng 29', 'Mùng 30'];

function isLeapYearSolar(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getLunarDate(solarDay, solarMonth, solarYear) {
    let lunarDay, lunarMonth, lunarYear, isLeap = 0;

    // Approximation calculation for lunar date
    const lunarEpoch = 2385560;
    const J = new Date(solarYear, solarMonth - 1, solarDay).getTime() / 86400000 + 0.5;
    const JD = Math.floor(J);
    const R = JD - lunarEpoch;

    // Simplified lunar calculation
    lunarYear = Math.floor((R + 15) / 10631) + 1900;
    const yearDays = Math.floor(R + 15 - ((lunarYear - 1900) * 10631 + 1));

    // Count days to find month and day
    const monthDays = [0, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];
    let monthCount = 0;
    let dayCount = yearDays;

    for (let i = 1; i <= 12; i++) {
        if (dayCount <= monthDays[i % 12 === 0 ? 12 : i % 12]) {
            lunarMonth = i;
            lunarDay = dayCount + 1;
            break;
        }
        dayCount -= monthDays[i % 12 === 0 ? 12 : i % 12];
    }

    return { day: lunarDay, month: lunarMonth, year: lunarYear };
}

function convertToLunarWithChi(solarDay, solarMonth, solarYear) {
    try {
        // Use Vietnamese date library if available, otherwise use fallback
        if (typeof vietnameseDate !== 'undefined') {
            const lunarDate = vietnameseDate.fromSolar(solarDay, solarMonth, solarYear, 7);
            const fullFormatString = lunarDate.format('F');

            const regex = /\(ngày (.+?) tháng (.+?) năm (.+?)\)/;
            const match = fullFormatString.match(regex);

            if (match && match.length === 4) {
                return {
                    day: match[1],
                    month: match[2].replace(/\s\(nhuận\)/g, ''),
                    year: match[3]
                };
            }
        }
    } catch (e) {
        console.warn("vietnameseDate library not available, using fallback");
    }

    // Fallback: Use simple formula
    const lunar = getLunarDate(solarDay, solarMonth, solarYear);
    return {
        day: canChiDays[lunar.day - 1] || 'Mùng ' + lunar.day,
        month: canChiMonths[lunar.month - 1] || 'Tháng ' + lunar.month,
        year: canChiYears[(lunar.year - 1) % 12]
    };
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const today = new Date();
        const lunarInfo = convertToLunarWithChi(today.getDate(), today.getMonth() + 1, today.getFullYear());

        document.getElementById('am-ngay').textContent = lunarInfo.day;
        document.getElementById('am-thang').textContent = lunarInfo.month;
        document.getElementById('am-nam').textContent = lunarInfo.year;
    } catch (error) {
        console.error("Lỗi khi tính toán Lịch Âm:", error);
        document.getElementById('am-ngay').textContent = '... (Lỗi hệ thống)';
        document.getElementById('am-thang').textContent = '... (Lỗi hệ thống)';
        document.getElementById('am-nam').textContent = '... (Lỗi hệ thống)';
    }
});