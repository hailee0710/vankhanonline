// Lunar calendar conversion functions
// Thiên Can (Heavenly Stems)
const thienCan = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
// Địa Chi (Earthly Branches)
const diaChi = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

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
    
    // Calculate Can Chi for day, month, and year
    // Day can chi (based on cumulative days from a reference point)
    const dayCanChiIndex = (solarDay + solarMonth * 2 + solarYear) % 10;
    const dayChiIndex = (solarDay + solarMonth + solarYear) % 12;
    const dayCanChi = thienCan[dayCanChiIndex] + ' ' + diaChi[dayChiIndex];
    
    // Month can chi (month determines the earth branch, can follows a pattern)
    const monthChiIndex = (lunar.month - 1) % 12;
    const monthCanIndex = (solarYear * 5 + Math.floor(solarYear / 4) + solarMonth) % 10;
    const monthCanChi = thienCan[monthCanIndex] + ' ' + diaChi[monthChiIndex];
    
    // Year can chi (60-year cycle)
    const yearCanIndex = (solarYear - 1900) % 10;
    const yearChiIndex = (solarYear - 1900) % 12;
    const yearCanChi = thienCan[yearCanIndex] + ' ' + diaChi[yearChiIndex];
    
    return {
        day: dayCanChi,
        month: monthCanChi,
        year: yearCanChi
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