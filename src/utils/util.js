/**
 * 阿拉伯数字转中文数字,
 * 如果传入数字时则最多处理到21位，超过21位js会自动将数字表示成科学计数法，导致精度丢失和处理出错
 * 传入数字字符串则没有限制
 * @param {number|string} digit
 */

function toZhDigit(digit) {
    digit = typeof digit === 'number' ? String(digit) : digit;
    const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const unit = ['千', '百', '十', ''];
    const quot = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];

    let breakLen = Math.ceil(digit.length / 4);
    let notBreakSegment = digit.length % 4 || 4;
    let segment;
    let zeroFlag = [],
        allZeroFlag = [];
    let result = '';

    while (breakLen > 0) {
        if (!result) {
            // 第一次执行
            segment = digit.slice(0, notBreakSegment);
            let segmentLen = segment.length;
            for (let i = 0; i < segmentLen; i++) {
                if (segment[i] != 0) {
                    if (zeroFlag.length > 0) {
                        result += '零' + zh[segment[i]] + unit[4 - segmentLen + i];
                        // 判断是否需要加上 quot 单位
                        if (i === segmentLen - 1 && breakLen > 1) {
                            result += quot[breakLen - 2];
                        }
                        zeroFlag.length = 0;
                    } else {
                        result += zh[segment[i]] + unit[4 - segmentLen + i];
                        if (i === segmentLen - 1 && breakLen > 1) {
                            result += quot[breakLen - 2];
                        }
                    }
                } else {
                    // 处理为 0 的情形
                    if (segmentLen == 1) {
                        result += zh[segment[i]];
                        break;
                    }
                    zeroFlag.push(segment[i]);
                    continue;
                }
            }
        } else {
            segment = digit.slice(notBreakSegment, notBreakSegment + 4);
            notBreakSegment += 4;

            for (let j = 0; j < segment.length; j++) {
                if (segment[j] != 0) {
                    if (zeroFlag.length > 0) {
                        // 第一次执行zeroFlag长度不为0，说明上一个分区最后有0待处理
                        if (j === 0) {
                            result += quot[breakLen - 1] + zh[segment[j]] + unit[j];
                        } else {
                            result += '零' + zh[segment[j]] + unit[j];
                        }
                        zeroFlag.length = 0;
                    } else {
                        result += zh[segment[j]] + unit[j];
                    }
                    // 判断是否需要加上 quot 单位
                    if (j === segment.length - 1 && breakLen > 1) {
                        result += quot[breakLen - 2];
                    }
                } else {
                    // 第一次执行如果zeroFlag长度不为0, 且上一划分不全为0
                    if (j === 0 && zeroFlag.length > 0 && allZeroFlag.length === 0) {
                        result += quot[breakLen - 1];
                        zeroFlag.length = 0;
                        zeroFlag.push(segment[j]);
                    } else if (allZeroFlag.length > 0) {
                        // 执行到最后
                        if (breakLen == 1) {
                            result += '';
                        } else {
                            zeroFlag.length = 0;
                        }
                    } else {
                        zeroFlag.push(segment[j]);
                    }

                    if (j === segment.length - 1 && zeroFlag.length === 4 && breakLen !== 1) {
                        // 如果执行到末尾
                        if (breakLen === 1) {
                            allZeroFlag.length = 0;
                            zeroFlag.length = 0;
                            result += quot[breakLen - 1];
                        } else {
                            allZeroFlag.push(segment[j]);
                        }
                    }
                    continue;
                }
            }

            --breakLen;
        }

        return result;
    }
}

export { toZhDigit };

/**
 *  日期格式化
 *  mark : 分隔符, 如 '-'
 *  时间格式化 2019-09-08
 */
export function timeFormat(time, mark = '-') {
    let year = time.getFullYear();
    let month = (time.getMonth() + 1).toString().padStart(2, '0');
    let day = time
        .getDate()
        .toString()
        .padStart(2, '0');
    return year + mark + month + mark + day;
}

export function vaildIdCard(id, type) {
    if (type) {
        // true 其他类型证件
        return validateOrCard(id);
    } else {
        //false 则判断二代身份证
        return validateIdCard(id);
    }
}
function validateIdCard(idcard) {
    // 判断如果传入的不是一个字符串，则转换成字符串
    idcard = typeof idcard === 'string' ? idcard : String(idcard);
    //正则表达式验证号码的结构
    if (idcard.length === 15) {
        var year = idcard.substring(6, 8);
        var month = idcard.substring(8, 10);
        var day = idcard.substring(10, 12);
        var temp_date = new Date('19' + year, parseFloat(month) - 1, parseFloat(day));
        // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法
        if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
            return false;
        }
    } else {
        let regx = /^[\d]{17}[0-9|X|x]{1}$/;
        if (!regx.test(idcard)) {
            return false;
        }
        let provs = {
            11: '北京',
            12: '天津',
            13: '河北',
            14: '山西',
            15: '内蒙古',
            21: '辽宁',
            22: '吉林',
            23: '黑龙江 ',
            31: '上海',
            32: '江苏',
            33: '浙江',
            34: '安徽',
            35: '福建',
            36: '江西',
            37: '山东',
            41: '河南',
            42: '湖北 ',
            43: '湖南',
            44: '广东',
            45: '广西',
            46: '海南',
            50: '重庆',
            51: '四川',
            52: '贵州',
            53: '云南',
            54: '西藏 ',
            61: '陕西',
            62: '甘肃',
            63: '青海',
            64: '宁夏',
            65: '新疆',
            71: '台湾',
            81: '香港',
            82: '澳门',
        };
        // 检查省份
        let oneIndex = idcard.slice(0, 2);
        if (!provs[oneIndex]) {
            return false;
        }
        // 检查出生年月
        let birthYear = idcard.slice(6, 10);
        let birthMoon = idcard.slice(10, 12);
        let birthDay = idcard.slice(12, 14);
        let birth = new Date(birthYear + '-' + birthMoon + '-' + birthDay);

        if (!(birth && birth.getMonth() == parseInt(birthMoon) - 1 && birth.getFullYear() == parseInt(birthYear) && parseInt(birthDay) == birth.getDate())) {
            return false;
        }
        // 校验最后一位
        let sevenTeenIndex = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        let front_seventeen = idcard.slice(0, 17);
        let eighteen = idcard.slice(17, 18);
        eighteen = isNaN(parseInt(eighteen)) ? eighteen.toLowerCase() : parseInt(eighteen);
        let remainderKeyArr = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        let remainder = 0;
        for (let i = 0; i < 17; i++) {
            remainder += sevenTeenIndex[i] * front_seventeen[i];
        }
        remainder = remainder % 11;
        let remainderKey = remainderKeyArr[remainder] === 'X' ? remainderKeyArr[remainder].toLowerCase() : remainderKeyArr[remainder];
        if (eighteen != remainderKey) {
            return false;
        }
    }
    return true;
}
function validateOrCard(card) {
    // 港澳身份证
    var reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/;
    if (reg.test(card)) {
        return true;
    }
    // 台湾身份证
    var reg1 = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/;
    if (reg1.test(card)) {
        return true;
    }
    // 护照
    var reg2 = /^([a-zA-z]|[0-9]){5,17}$/;
    if (reg2.test(card)) {
        return true;
    }
    // 军官证
    var reg3 = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
    if (reg3.test(card)) {
        return true;
    }
    return false;
}
/* 手机号码和固定电话 */
export function validatePhTelNumber(str) {
    const reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
    return reg.test(str);
}
