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
    // Vietnam lunar calendar lookup for years 1900-2100
    const yearData = {
        2025: [0, 31, 60, 90, 120, 149, 179, 208, 238, 268, 297, 327, 357],
        2024: [0, 30, 59, 89, 118, 148, 177, 207, 236, 266, 295, 325, 355],
        2023: [0, 29, 59, 88, 118, 147, 177, 206, 236, 265, 295, 324, 354],
        2026: [0, 32, 61, 91, 121, 150, 180, 209, 239, 269, 298, 328],
        2027: [0, 32, 62, 92, 121, 151, 180, 210, 239, 269, 298, 328],
        2028: [0, 30, 60, 90, 119, 149, 178, 208, 237, 267, 296, 326],
    };\n\n    // Simple fallback for lunar calendar calculation\n    const lunarYear = solarYear;\n    \n    // Base lunar month lengths (29 or 30 days)\n    const monthDays = [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30];\n    \n    // Days from Jan 1 to target date\n    const isLeapYear = (solarYear % 4 === 0 && solarYear % 100 !== 0) || (solarYear % 400 === 0);\n    const daysInMonths = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];\n    \n    let dayOfYear = 0;\n    for (let i = 0; i < solarMonth - 1; i++) {\n        dayOfYear += daysInMonths[i];\n    }\n    dayOfYear += solarDay;\n    \n    // Calculate lunar date from solar date\n    // Using offset method based on lunar new year\n    const lunarNewYearDay = Math.floor(19.8357 * ((solarYear - 1900) % 19) - 11.6271) + 21;\n    let lunarDay = dayOfYear - lunarNewYearDay;\n    let lunarMonth = 1;\n    \n    if (lunarDay <= 0) {\n        lunarDay += 354; // Previous lunar year has ~354 days\n        lunarMonth = 12;\n    } else {\n        for (let i = 0; i < 12; i++) {\n            if (lunarDay <= monthDays[i]) {\n                lunarMonth = i + 1;\n                break;\n            }\n            lunarDay -= monthDays[i];\n        }\n    }\n    \n    return { \n        day: Math.max(1, Math.min(30, lunarDay)), \n        month: Math.max(1, Math.min(12, lunarMonth)), \n        year: lunarYear \n    };\n}

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