function getSpaceAmount(){
    return player.s.best.sub(player.s.upgrades.length)
}

function getWarpSpaceEffect(){
    return player.s.warp.pow(1).max(1).log(2).max(1)
}

function getSpaceBaseTooltip(id){
    if(!hasUpgrade('s', id)){
        return '你需要购买所有其它升级后再来购买这个<br>购买后将解锁更多升级'
    }
    return false
}

addLayer("s", {
    name: "space",
    symbol: "空间",
    symbolI18N: "Prestige",
    position: 0,
    startData() { return {
        unlocked: true,
		points: n(0),
        warp: n(0),
    }},
    color: "#fff",
    nodeStyle: {'border-color': '#DFDFDF'},
    activeStyle: {'background-color': '#000', 'color': '#fff', 'border-color': '#FDFDFD'},
    hoverStyle: {'background-color': '#000', 'color': '#fff', 'border-color': '#DFDFDF'},
    resource: "空间",
    resourceI18N: "Space",
    baseResource: "时空悖论",
    baseResourceI18N: "Space Time Paradox",
    baseAmount() {return player.points.max(1)},
    type: "custom",
    CostBase(){
        return n(10)
    },
    CostMult(){
        let mul = n(1)
        if(hasUpgrade('s', 23)){
            mul = mul.mul(upgradeEffect('s', 23))
        }
        return mul
    },
    CostAmount(modifiers){
        return n(player.s.points).sub(1).add(modifiers)
    },
    getResetGain(){
        return n(this.baseAmount()).mul(this.CostMult()).log(this.CostBase()).sub(this.CostAmount()).floor().max(0)
    },
    getNextAt(){
        return n(this.CostBase()).pow(this.CostAmount(n(1).add(this.getResetGain()))).div(this.CostMult())
    },
    prestigeButtonText(){
        return `获得 <big>`+format(getResetGain(this.layer),0)+` 空间</big><br>并进行一次空间重置<br>下一个空间在:<br>`+format(getNextAt(this.layer, true))+`时空悖论`
    },
    prestigeNotify(){
        return n(getResetGain(this.layer)).gte(1)
    },
    canReset(){
        return n(this.getResetGain()).gte(1)
    },
    row: 2,
    update(diff){
        let gain = n(0)
        if(hasUpgrade('s', 43)){
            gain = gain.add(upgradeEffect('s', 43))
        }
        gain = gain.mul(getTimeSpeed())
        player.s.warp = player.s.warp.add(n(gain).mul(diff))

        if(hasUpgrade('s', 33)){
            player.s.points = player.s.points.add(n(this.getResetGain()))
            player.s.best = player.s.best.max(player.s.points)
        }
    },
    upgrades: {
        11: {
            title: "基层",
            description: "扩建,并解锁扭曲时空(在时空中)",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(1) && player.s.upgrades.length>=0},
            unlocked(){return true},
            tooltip(){return getSpaceBaseTooltip(this.id)}
        },

        21: {
            title: "基层",
            description: "扩建,并解锁扭曲(在空间中)",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(1) && player.s.upgrades.length>=3},
            unlocked(){return hasUpgrade('s', 11)},
            tooltip(){return getSpaceBaseTooltip(this.id)}
        },
        12: {
            title: "时空利用[s12]",
            description: "扭曲时空会给予额外的扭曲时空",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(1)},
            unlocked(){return hasUpgrade('s', 11)},
            tooltip(){return 'f(x) = ⌈log<sub>2</sub>(x)⌉<br>x = '+format(player.st.SpaceTime1Dim)+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 扭曲时空每达到一次2的倍数就会给予1个额外的扭曲时空(向上取整)*</grey>'},
            effect(){return player.st.SpaceTime1Dim.max(1).log(2).ceil()}
        },
        22: {
            title: "时空协同[s22]",
            description: "扭曲时空的基础生产将提升其自身倍率",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(1)},
            unlocked(){return hasUpgrade('s', 11)},
            tooltip(){return 'f(x) = 0.5lg(x)<br>x = '+format(Dim1BaseGain())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 扭曲时空的基础生产每达到一次10的倍数就会增加0.5倍扭曲时空的倍率*</grey>'},
            effect(){return n(Dim1BaseGain()).max(1).log(10).mul(0.5)}
        },

        31: {
            title: "基层",
            description: "扩建,并解锁棱柱(在空间中)",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(1) && player.s.upgrades.length>=8},
            unlocked(){return hasUpgrade('s', 21)},
            tooltip(){return getSpaceBaseTooltip(this.id)}
        },
        13: {
            title: "空间利用[s13]",
            description: "时空悖论产量将基于当前空间数量增加",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(1)},
            unlocked(){return hasUpgrade('s', 21)},
            tooltip(){return 'f(x) = x<br>x = '+format(player.s.points)+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 时空倍率产量乘以1倍当前空间*</grey>'},
            effect(){return player.s.points.max(1)}
        },
        23: {
            title: "空间协同[s23]",
            description: "空间需求将基于当前空间数量降低",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(1)},
            unlocked(){return hasUpgrade('s', 21)},
            tooltip(){return 'f(x) = x<br>x = '+format(player.s.points)+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 空间需求除以1倍当前空间*</grey>'},
            effect(){return player.s.points.max(1)}
        },
        32: {
            title: "时空协调[s32]",
            description: "当你可以购买扭曲时空时,会每秒自动获得扭曲时空",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(1)},
            unlocked(){return hasUpgrade('s', 21)},
            tooltip(){return 'f(x) = x<br>x = '+format(0.1)+', f(x) = '+format(0.1)+'<br><grey>*基础效果: 每秒获得0.1扭曲时空*</grey><br>实际效果: '+format(n(upgradeEffect('s', 32)).mul(getTimeSpeed()))+'/s'},
            effect(){
                return n(0.1)
            }
        },
        33: {
            title: "空间协调[s33]",
            description: "无消耗自动获得空间",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(1)},
            unlocked(){return hasUpgrade('s', 21)},
        },
        43: {
            title: "扭曲协调[s43]",
            description: "每秒自动扭曲时空",
            cost(){return n(1)},
            pay(){return n(0)},
            canAfford(){return n(getSpaceAmount()).gte(100)},
            unlocked(){return hasUpgrade('s', 21)},
            tooltip(){return 'f(x) = 0.1x<br>x = '+format(player.s.points)+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 每秒自动扭曲0.1倍的空间*</grey><br>实际效果: '+format(n(upgradeEffect('s', 43)).mul(getTimeSpeed()))+'/s'},
            effect(){
                return player.s.points.mul(0.1)
            }
        },
    },
    clickables: {
        11: {
            display(){return '打乱空间<br>进行一次空间重置,并返还已被使用的空间'},
            onClick(){
                doReset('s')
                doReset('s', true)

                let k = player.s.best.root(2).floor().min(3)
                let u = []
                for(let r = 1; r<=k; r++){
                    for(let c = 1; c<=k; c++){
                        u.push(Number(r*10+c))
                    }
                }
                player.s.upgrades = u
            },
            canClick(){return true},
        },
        12: {
            display(){return '扭曲空间<br>进行一次空间重置,并失去所有空间并获得对应数量的扭曲空间'},
            onClick(){
                player.s.warp = player.s.warp.add(player.s.points)
                player.s.points = n(0)
                
                doReset('s')
                doReset('s', true)
                doReset('s')
            },
            tooltip(){
                if(player.s.points.lt(4)){
                    return '你需要至少4空间来进行扭曲空间'
                }
                return false
            },
            canClick(){return player.s.points.gte(4)},
        },
    },
    microtabs: {
        tab: {
            "main": {
                name(){return '空间'},
                nameI18N(){return 'Space'},
                content:[
                    ["display-text", function(){return '你还有 <span class="space">'+format(getSpaceAmount(), 0)+' / '+format(player.s.best, 0)+' 空间</span> 未被使用'}],
                    'blank',
                    'blank',
                    ['row', [
                        ["display-text", function(){return hasUpgrade('s', 21) ? '<div class="dimTable">基层3</div>' : ''}],
                        ['upgrade', 31],
                        ['upgrade', 32],
                        ['upgrade', 33],
                    ]],
                    ['row', [
                        ["display-text", function(){return hasUpgrade('s', 11) ? '<div class="dimTable">基层2</div>' : ''}],
                        ['upgrade', 21],
                        ['upgrade', 22],
                        ['upgrade', 23],
                    ]],
                    ['row', [
                        ["display-text", function(){return '<div class="dimTable">基层1</div>'}],
                        ['upgrade', 11],
                        ['upgrade', 12],
                        ['upgrade', 13],
                    ]],
                    'blank',
                    'blank',
                    ['clickable', 11],
                ],
            },
            "warp": {
                name(){return '扭曲'},
                nameI18N(){return 'Warp'},
                unlocked(){return hasUpgrade('s', 21)},
                content:[
                    ["display-text", function(){return '你有 <span class="space">'+format(player.s.warp)+' 扭曲空间</span>, 它们使得你的时间速率×<span class="timespeed">'+format(getWarpSpaceEffect())+'</span>'}],
                    ["display-text", function(){return '<span style="font-family: Courier New">f(x) = log<sub>2</sub>(x<sup></sup>)</span>'}],
                    'blank',
                    'blank',
                    ['clickable', 12],
                ],
            },
            "prism": {
                name(){return '棱柱'},
                nameI18N(){return 'Prism'},
                unlocked(){return hasUpgrade('s', 31)},
                content:[
                    ["display-text", function(){return '你过关!所以这里没有任何东西'}],
                ],
            }
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       ["display-text", function(){return '你有 <span class="space">'+format(player.s.points)+' 空间</span>'}],
       "blank",
       "prestige-button",
       "blank",
       ["microtabs","tab"]
    ],
    componentStyles: {
        upgrades: {
        },
    },
    layerShown(){return true},
})