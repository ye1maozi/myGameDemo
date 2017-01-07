/**
 * Created by miaowenjie on 2016/12/26.
 */
/**
 * 配置接口
 * */

var config = require("../../public/config.json");
/**
 * 获取相应配置
 * @param name 配置名
 * @return 对应配置的对象
 */
getConfig = function(name){

    return {};
};
/**
 * 普通配置 key 对应的value
 * @param key
 */
getConfigValue = function(key){
    // console.log(config);
    return config[key];
}

exports.getConfigValue = getConfigValue;
exports.getConfig = getConfig;
// module.exports = configManager;