
// module.exports = {
//     plugins: {
//         autoprefixer: {
//         },
//         "postcss-px2rem-exclude": {
//             remUnit: 75,
//             exclude: /node_modules/i   // 忽略node_modules目录下的文件
//         }
//     },
// }

module.exports = ({ file }) => {
    let isVant = file && file.dirname && file.dirname.indexOf("vant") > -1;
    let rootValue = isVant ? 37.5 : 75; // 判断条件 请自行调整
    return {
        plugins: {
            autoprefixer: {},
            "postcss-pxtorem": {
                rootValue: rootValue,
                propList: ["*"],
                minPixelValue: 2,
            }
        }
    }
}

// module.exports = {
//     plugins: {
//         'postcss-pxtorem': {
//             rootValue: 37.5,
//             propList: ['*'],
//         },
//     },
// };