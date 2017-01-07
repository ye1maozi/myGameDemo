/**
 * Created by miaowenjie on 2016/12/27.
 */

/**
 * 基础技能
 * @constructor
 */
function BaseSkill(param){

    this.skillId = param.id;//唯一
    this.type = param.type;//类型
    this.value = param.value;//技能属性

    /**
     * 获取技能数值
     * @returns {*}
     */
    this.getValue = function(){
        return this.value;
    }
}

module.exports = BaseSkill;