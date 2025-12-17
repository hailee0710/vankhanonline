// Lunar calendar conversion functions
const canChiYears = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const canChiMonths = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười một', 'Mười hai'];
const canChiDays = ['Mùng 1', 'Mùng 2', 'Mùng 3', 'Mùng 4', 'Mùng 5', 'Mùng 6', 'Mùng 7', 'Mùng 8', 'Mùng 9', 'Mùng 10',
    'Mùng 11', 'Mùng 12', 'Mùng 13', 'Mùng 14', 'Mùng 15', 'Mùng 16', 'Mùng 17', 'Mùng 18', 'Mùng 19', 'Mùng 20',
    'Mùng 21', 'Mùng 22', 'Mùng 23', 'Mùng 24', 'Mùng 25', 'Mùng 26', 'Mùng 27', 'Mùng 28', 'Mùng 29', 'Mùng 30'];

function getLunarDate(solarDay, solarMonth, solarYear) {
    // Calculate lunar date from solar date
    const lunarYear = solarYear;

    // Base lunar month lengths (29 or 30 days)
    const monthDays = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];

    // Days from Jan 1 to target date
    const isLeapYear = (solarYear % 4 === 0 && solarYear % 100 !== 0) || (solarYear % 400 === 0);
    const daysInMonths = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let dayOfYear = 0;
    for (let i = 0; i < solarMonth - 1; i++) {
        dayOfYear += daysInMonths[i];
    }
    dayOfYear += solarDay;

    // Using offset method based on lunar new year
    const lunarNewYearDay = Math.floor(19.8357 * ((solarYear - 1900) % 19) - 11.6271) + 21;
    let lunarDay = dayOfYear - lunarNewYearDay;
    let lunarMonth = 1;

    if (lunarDay <= 0) {
        lunarDay += 354;
        lunarMonth = 12;
    } else {
        for (let i = 0; i < 12; i++) {
            if (lunarDay <= monthDays[i]) {
                lunarMonth = i + 1;
                break;
            }
            lunarDay -= monthDays[i];
        }
    }

    return {
        day: Math.max(1, Math.min(30, lunarDay)),
        month: Math.max(1, Math.min(12, lunarMonth)),
        year: lunarYear
    };
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