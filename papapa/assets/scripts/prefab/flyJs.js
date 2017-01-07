cc.Class({
    extends: cc.Component,

    properties: {
        anim: {
            default: null,
            type: cc.Animation
        },
        label:{
            default:null,
            type:cc.Label
        }
    },

    init (game) {
        this.game = game;
        this.anim.getComponent('flyAniJs').init(this);
    },

    dispose () {
        this.game.despawnScoreFX(this.node);
    },

    play: function (txt) {
        this.label.string = txt;
        this.anim.play('flytext');
    }
    
});
