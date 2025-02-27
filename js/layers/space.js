function getUnusedSpace(){
    let cost = n(0)
    for(let i in player.s.normalUpgrades){
        if(tmp.s.upgrades[player.s.normalUpgrades[i]].dimShift==undefined){
            if(hasUpgrade('s', player.s.normalUpgrades[i])){
                cost = cost.add(tmp.s.upgrades[player.s.normalUpgrades[i]].cost)
            }
        }
    }
    return player.s.best.sub(cost)
}

function getSpaceAmount(){
    let ex = n(0)
    if(player.s.green){
        ex = ex.add(tmp.s.getGreenEffect)
    }

    let mul = n(1)
    if(player.s.red && player.s.green){
        mul = mul.mul(tmp.s.getYellowEffect)
    }

    let div = n(1)
    if(player.s.inVolumeChallenge){
        div = n(getVolumeAffect()[0])
    }
    return player.s.points.add(ex).mul(mul).div(div)
}

function getDimShiftClass(id){
    if(id=='reset'){
        for(let i in tmp.s.upgrades){
            if(tmp.s.upgrades[i].dimShift!==undefined){
                player.s.dimboostUpgrades.push(id)
            }
        }
        return
    }
    if(!hasUpgrade('s', id) && hasUpgrade('s', id.slice(1)) && player.s.dimboostUpgrades.indexOf(id)==-1){
        player.s.dimboostUpgrades.push(id)
        return {'transform': 'scale(1.15, 1.15)', "animation": "spaceDimShift 5s infinite"}
    }
    return {"animation": "spaceDimShift 5s infinite"}
}

function getUnusedDimShift(){
    let cost = n(0)
    for(let i in player.s.upgrades){
        if(tmp.s.upgrades[player.s.upgrades[i]].dimShift!==undefined){
            if(hasUpgrade('s', player.s.upgrades[i])){
                cost = cost.add(1)
            }
        }
    }
    return n(getDimShiftAmount()).sub(cost)
}

function getDimShiftAmount(){
    let num = n(0)
    if(hasMilestone('s', 5)){
        num = num.add(tmp.s.milestones[5].effect)
    }
    return n(num)
}

function getDimShiftAffect(){
    return n(1.5)
}

function spaceUpgradesText(num, eff){
    let display = num
    if(n(num).eq(format(num, 0))){
        display = format(num, 0)
    }else if(n(num).eq(format(num, 1))){
        display = format(num, 1)
    }else if(n(num).eq(format(num, 2))){
        display = format(num, 2)
    }else{
        display = format(num)
    }
    if(eff){
        return '<green>'+display+'</green>'
    }
    return '<red>'+display+'</red>'
}

function getWarpGain(){
    let mul = n(1)
    if(hasUpgrade('s', 24)){
        mul = mul.mul(upgradeEffect('s', 24))
    }
    return player.s.points.mul(mul)
}

function getWarpGen(){
    let gain = n(0)
    if(hasUpgrade('s', 34)){
        gain = gain.add(upgradeEffect('s', 34))
    }
    gain = gain.mul(getTimeSpeed())
    return gain
}

function getWarpAmount(){
    let milestone = n(0)
    if(hasMilestone('s', 1)){
        milestone = n(tmp.s.milestones[1].effect)
    }
    let div = n(1)
    if(player.s.inVolumeChallenge){
        div = n(getVolumeAffect()[1])
    }
    return player.s.warp.div(div).add(milestone)
}

function getWarpSpaceEffect(){
    return n(getWarpAmount()).max(1).log(2).max(1).pow(1.5)
}

function getSpaceBaseTooltip(id){
    if(!hasUpgrade('s', id)){
        if(id==41){
            return '你需要购买所有其它升级后再来购买这个'
        }
        return '你需要购买所有其它升级后再来购买这个<br>购买后将解锁更多升级'
    }
    return false
}

function getPrismAmount(){
    let amount = 0
    if(hasUpgrade('s', 31)){
        amount++
    }
    if(hasMilestone('s', 3)){
        amount++
    }
    return Number(player.s.red+player.s.green+player.s.blue) < Number(amount)
}

function getIlluminationBase(){
    return n(getOriginalPointGain()).max(1).log(2)
}

function getIllumination(){
    let ex = n(0)
    
    let milestone = n(0)
    if(hasMilestone('s', 1)){
        milestone = n(tmp.s.milestones[1].effect)
    }
    let div = n(1)
    if(player.s.inVolumeChallenge){
        div = n(getVolumeAffect()[2])
    }
    return n(getIlluminationBase()).add(ex).div(div).add(milestone)
}

function getChallengeDone(){
    return player.s.xSet.mul(3).add(7)
}

function getChallengeDifficulty(){
    return player.s.ySet.sub(1).mul(0.25).add(1)
}

function getChallengeAffect(){
    return n(5).pow(player.s.zSet.sub(1))
}

function getVolumeChallengeUpgradesCost(id){
    let upgAmount = n(player.s.normalUpgrades.length).sub(4)
    if(player.s.normalUpgrades.indexOf(Number(id))!==-1){
        return n(player.s.normalUpgrades.indexOf(Number(id))).sub(4)
    }
    return upgAmount
}

function getVolume(){
    return player.s.x.mul(player.s.y).mul(player.s.z)
}

function getVolumeAmount(){
    return n(getVolume()).add(player.s.extraVolume)
}

function volumeExpectGain(){
    return player.s.xSet.mul(player.s.ySet).mul(player.s.zSet)
}

function getVolumeAffect(){
    let baseAffect = n(volumeExpectGain())
    baseAffect = baseAffect.pow(getChallengeDifficulty())
    return [baseAffect, baseAffect, baseAffect]
}

function volumeReset(){
    player.s.upgrades = []
    player.s.normalUpgrades = []
    player.s.dimboostUpgrades = []
    player.s.points = n(0)
    player.s.best = n(0)
    player.s.warp = n(0)

    player.s.red = false
    player.s.green = false
    player.s.blue = false
    
    doReset('s', true)
}

addLayer("s", {
    name: "space",
    symbol: "空间",
    symbolI18N: "Space",
    position: 0,
    startData() { return {
        unlocked: true,
		points: n(0),
        warp: n(0),

        extraVolume: n(0),

        red: false,
        green: false,
        blue: false,

        x: n(1),
        y: n(1),
        z: n(1),
        xSet: n(1),
        ySet: n(1),
        zSet: n(1),

        inVolumeChallenge: false,

        normalUpgrades: [],
        dimboostUpgrades: []
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
        let base = n(10)
        if(hasUpgrade('s', 43)){
            base = base.sub(n(upgradeEffect('s', 43)).mul(8))
        }
        return base
    },
    CostMult(){
        let mul = n(1)
        if(hasUpgrade('s', 23)){
            mul = mul.mul(upgradeEffect('s', 23))
        }
        return mul
    },
    CostAmount(modifiers=n(1).add(this.getResetGain())){
        return n(player.s.points).sub(1).add(modifiers)
    },
    getResetGain(){
        return n(this.baseAmount()).mul(this.CostMult()).log(this.CostBase()).sub(this.CostAmount(0)).floor().max(0)
    },
    getNextAt(){
        return n(this.CostBase()).pow(this.CostAmount(n(1).add(this.getResetGain()))).div(this.CostMult())
    },
    prestigeButtonText(){
        return `获得 <big>`+format(this.getResetGain(),0)+` 空间</big><br>并进行一次空间重置<br>下一个空间在:<br>`+format(this.getNextAt())+`时空悖论`
    },
    prestigeNotify(){
        return n(this.getResetGain()).gte(1)
    },
    canReset(){
        return n(this.getResetGain()).gte(1) && !hasMilestone('s', 4) && !player.si.contracting
    },
    row: 2,
    doReset(resettingLayer){
        if (layers[resettingLayer].row > layers[this.layer].row) {
            let keep = []
            layerDataReset(this.layer, keep)
        }
    },
    getRedEffect(){
        return n(getIllumination()).pow(1.75).max(1)
    },
    getGreenEffect(){
        let pow = n(1.25)
        return n(getIllumination()).pow(pow)
    },
    getBlueEffect(){
        let pow = n(0.75)
        if(hasMilestone('s', 7)){
            pow = pow.add(tmp.s.milestones[7].effect)
        }
        return n(getIllumination()).pow(pow).max(1)
    },
    getYellowEffect(){
        let pow = n(2)
        return n(getIllumination()).pow(pow).max(1)
    },
    getMagentaEffect(){
        let pow = n(0.5)
        if(hasMilestone('s', 7)){
            pow = pow.add(tmp.s.milestones[7].effect)
        }
        return n(getIllumination()).pow(pow).min(15)
    },
    getCyanEffect(){
        let pow = n(1.5)
        if(hasMilestone('s', 7)){
            pow = pow.add(tmp.s.milestones[7].effect)
        }
        return n(getIllumination()).pow(pow).max(1)
    },
    update(diff){
        let gain = n(getWarpGen())
        player.s.warp = player.s.warp.add(n(gain).mul(diff))

        if(hasMilestone('s', 4) && !player.si.contracting){
            player.s.points = player.s.points.add(n(this.getResetGain()))
            player.s.best = player.s.best.max(player.s.points)
        }

        if(hasMilestone('si', 1)){

        }
    },
    upgrades: {
        11: {
            title: "基层利用",
            description: "扩建,并解锁一维时空(在时空中)",
            cost(){return n(0)},
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost()) && player.s.normalUpgrades.length>=0},
            unlocked(){return true},
            tooltip(){return getSpaceBaseTooltip(this.id)}
        },

        21: {
            title: "基层协同",
            description: "扩建,并解锁扭曲(在空间中)",
            cost(){
                if(player.s.inVolumeChallenge){
                    return n(0)
                }
                return n(1)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost()) && player.s.normalUpgrades.length>=3},
            unlocked(){return hasUpgrade('s', 11)},
            tooltip(){return getSpaceBaseTooltip(this.id)}
        },
        12: {
            title: "时空利用[s12]",
            description: "一维时空数量给予额外的一维时空",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(1)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 11) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = ⌈log<sub>'+spaceUpgradesText(n(this.red()), false)+'</sub>(x)⌉<br>x = '+format(Dim1Base())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: log<sub>'+spaceUpgradesText(n(this.red()), false)+'</sub>(一维时空数量)会给与额外的一维时空(向上取整)*</grey><br>基础效果: +'+format(this.effect())},
            red(){
                let red = n(2)
                if(hasUpgrade('s', 'd'+this.id)){
                    red = red.div(upgradeEffect('s', 'd'+this.id))
                }
                return red
            },
            effect(){return n(Dim1Base()).max(1).log(this.red()).ceil()}
        },
        22: {
            title: "时空协同[s22]",
            description: "一维时空基础生产提升其乘数",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(1)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 11) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = '+spaceUpgradesText(n(this.green()), true)+'lg(x)<br>x = '+format(Dim1BaseGain())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: lg(一维时空的基础生产)×'+spaceUpgradesText(n(this.green()), true)+'提升其倍率*</grey><br>基础效果: +'+format(this.effect())+'×'},
            green(){
                let green = n(0.5)
                if(hasUpgrade('s', 'd'+this.id)){
                    green = green.mul(upgradeEffect('s', 'd'+this.id))
                }
                return green
            },
            effect(){return n(Dim1BaseGain()).max(1).log(10).mul(this.green())}
        },

        31: {
            title: "基层协调",
            description: "扩建,并解锁棱柱(在空间中)",
            cost(){
                if(player.s.inVolumeChallenge){
                    return n(0)
                }
                return n(2)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost()) && player.s.normalUpgrades.length>=8},
            unlocked(){return hasUpgrade('s', 21)},
            tooltip(){return getSpaceBaseTooltip(this.id)}
        },
        13: {
            title: "空间利用[s13]",
            description: "空间数量提升一维时空产量",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(2)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 21) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = '+spaceUpgradesText(n(this.green()), true)+'x<br>x = '+format(getSpaceAmount())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 空间数量×'+spaceUpgradesText(n(this.green()), true)+'提升一维时空产量*</grey><br>基础效果: ×'+format(this.effect())},
            green(){
                let green = n(1.2)
                if(hasUpgrade('s', 'd'+this.id)){
                    green = green.mul(upgradeEffect('s', 'd'+this.id))
                }
                return green
            },
            effect(){return n(getSpaceAmount()).mul(this.green()).max(1)}
        },
        23: {
            title: "空间协同[s23]",
            description: "空间数量降低空间需求",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(2)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 21) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = x<sup>'+spaceUpgradesText(n(this.green()), true)+'</sup><br>x = '+format(getSpaceAmount())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: (空间数量)<sup>'+spaceUpgradesText(n(this.green()), true)+'</sup>降低空间需求*</grey><br>基础效果: ÷'+format(this.effect())},
            green(){
                let green = n(2)
                if(hasUpgrade('s', 'd'+this.id)){
                    green = green.mul(upgradeEffect('s', 'd'+this.id))
                }
                return green
            },
            effect(){return n(getSpaceAmount()).pow(this.green()).max(1)}
        },
        32: {
            title: "时空协调[s32]",
            description: "被动获取一维时空",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(2)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 21) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = '+spaceUpgradesText(n(this.green()), true)+'x<br>x = '+(hasUpgrade('s', 23) ? '(s33)' : '1')+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 每秒获得'+spaceUpgradesText(n(this.green()), true)+'一维时空*</grey><br>基础效果: '+format(this.effect())+'/s<br>实际效果: '+format(n(this.effect()).mul(getTimeSpeed()))+'/s'},
            green(){
                let green = n(0.2)
                if(hasUpgrade('s', 'd'+this.id)){
                    green = green.mul(upgradeEffect('s', 'd'+this.id))
                }
                return green
            },
            effect(){
                let effect = n(1)
                if(hasUpgrade('s', 33)){
                    effect = effect.mul(upgradeEffect('s', 33))
                }
                return effect.mul(this.green())
            }
        },
        33: {
            title: "空间协调[s33]",
            description: "[s32]的效果将基于当前空间数量提升",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(2)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 21) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = x<sup>'+spaceUpgradesText(n(this.green()), true)+'</sup><br>x = '+format(getSpaceAmount())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: (空间数量)<sup>'+spaceUpgradesText(n(this.green()), true)+'</sup>提升[s32]的效果*</grey><br>基础效果: ×'+format(this.effect())},
            green(){
                let green = n(2)
                if(hasUpgrade('s', 'd'+this.id)){
                    green = green.mul(upgradeEffect('s', 'd'+this.id))
                }
                return green
            },
            effect(){return n(getSpaceAmount()).pow(this.green()).max(1)}
        },
        
        41: {
            title: "基层改善",
            description: "扩建,并解锁体积(在空间中)",
            cost(){
                if(player.s.inVolumeChallenge){
                    return n(0)
                }
                return n(3)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost()) && player.s.normalUpgrades.length>=15},
            unlocked(){return hasUpgrade('s', 31)},
            tooltip(){return getSpaceBaseTooltip(this.id)}
        },
        14: {
            title: "扭曲利用[s14]",
            description: "扭曲空间效果提升一维时空产量",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(3)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 31) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = '+spaceUpgradesText(n(this.green()), true)+'x<br>x = '+format(getWarpSpaceEffect())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 扭曲空间效果×'+spaceUpgradesText(n(this.green()), true)+'提升一维时空产量*</grey><br>基础效果: ×'+format(this.effect())},
            green(){
                let green = n(0.8)
                if(hasUpgrade('s', 'd'+this.id)){
                    green = green.mul(upgradeEffect('s', 'd'+this.id))
                }
                return green
            },
            effect(){return n(getWarpSpaceEffect()).mul(this.green()).max(1)}
        },
        24: {
            title: "扭曲协同[s24]",
            description: "扭曲空间提升「进行空间扭曲」的效果",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(3)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 31) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = log<sub>'+spaceUpgradesText(n(this.red()), false)+'</sub>(x)<br>x = '+format(getWarpAmount())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: log<sub>'+spaceUpgradesText(n(this.red()), false)+'</sub>(扭曲空间数量)提升「进行空间扭曲」的效果*</grey><br>基础效果: ×'+format(this.effect())},
            red(){
                let red = n(2)
                if(hasUpgrade('s', 'd'+this.id)){
                    red = red.div(upgradeEffect('s', 'd'+this.id))
                }
                return red
            },
            effect(){return n(getWarpAmount()).max(1).log(this.red()).max(1)}
        },
        34: {
            title: "扭曲协调[s34]",
            description: "基于「进行空间扭曲」的效果被动获得扭曲空间",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(3)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 31) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = x<sup>'+spaceUpgradesText(n(this.green()), true)+'</sup>/'+spaceUpgradesText(n(this.red()), false)+'<br>x = '+format(getWarpGain())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 每秒被动获得<br>(「进行空间扭曲」的效果)<sup>'+spaceUpgradesText(n(this.green()), true)+'</sup>/'+spaceUpgradesText(n(this.red()), false)+'扭曲空间*</grey><br>基础效果: '+format(this.effect())+'/s<br>实际效果: '+format(n(this.effect()).mul(getTimeSpeed()))+'/s'},
            red(){
                let red = n(100)
                if(hasUpgrade('s', 'd'+this.id)){
                    red = red.div(upgradeEffect('s', 'd'+this.id))
                }
                return red
            },
            green(){
                let green = n(0.5)
                if(hasUpgrade('s', 'd'+this.id)){
                    green = green.mul(upgradeEffect('s', 'd'+this.id))
                }
                return green
            },
            effect(){
                return n(getWarpGain()).pow(this.green()).div(this.red())
            }
        },
        42: {
            title: "时空改善[s42]",
            description: "额外一维时空的效果更改为直接倍增一维时空数量",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(3)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 31) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = '+spaceUpgradesText(n(this.green()), true)+'x<br>x = '+format(Dim1Extra())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 额外一维时空数量×'+spaceUpgradesText(n(this.green()), true)+'直接倍增一维时空数量*</grey><br><darkgrey>*如果此升级不能提升一维时空的产量则不会生效*</darkgrey><br>基础效果: ×'+format(this.effect())},
            green(){
                let green = n(2)
                if(hasUpgrade('s', 'd'+this.id)){
                    green = green.mul(upgradeEffect('s', 'd'+this.id))
                }
                return green
            },
            effect(){return n(Dim1Extra()).mul(this.green())}
        },
        43: {
            title: "空间改善[s43]",
            description: "时空悖论的原始产量降低空间价格底数",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(3)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 31) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = (x-'+spaceUpgradesText(n(this.red()), false)+')/(x-'+spaceUpgradesText(n(this.red()), false)+'+'+spaceUpgradesText(n(this.red2()), false)+')<br>x = '+format(n(getOriginalPointGain()).max(1).log(10).max(1))+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: 空间价格底数降低<br>(时空悖论的原始产量的数量级-'+spaceUpgradesText(n(this.red()), false)+')/(时空悖论的原始产量的数量级-'+spaceUpgradesText(n(this.red()), false)+'+'+spaceUpgradesText(n(this.red2()), false)+')的八倍*</grey><br><darkgrey>*八倍的效果公式在空间价格公式之中*</darkgrey><br>基础效果: -'+format(this.effect())},
            red(){
                let red = n(15)
                if(hasUpgrade('s', 'd'+this.id)){
                    red = red.div(upgradeEffect('s', 'd'+this.id))
                }
                if(player.s.red && player.s.blue){
                    red = red.sub(tmp.s.getMagentaEffect)
                }
                if(hasMilestone('s', 6)){
                    red = red.sub(tmp.s.milestones[6].effect)
                }
                return red.max(0)
            },
            red2(){
                let red2 = n(1)
                if(hasUpgrade('s', 'd'+this.id)){
                    red2 = red2.div(upgradeEffect('s', 'd'+this.id))
                }
                return red2
            },
            effect(){
                let x = n(getOriginalPointGain()).max(1).log(10).max(1).sub(this.red()).max(0)
                return n(x).div(n(x).add(this.red2())).max(0)
            }
        },
        44: {
            title: "扭曲改善[s44]",
            description: "扭曲空间效果提升时空悖论获取",
            cost(){
                if(player.s.inVolumeChallenge){
                    return getVolumeChallengeUpgradesCost(this.id)
                }
                return n(3)
            },
            pay(){player.s.normalUpgrades.push(Number(this.id))},
            hardAfford(){return n(getUnusedSpace()).gte(this.cost())},
            unlocked(){return hasUpgrade('s', 31) && (!hasUpgrade('s', this.id) || n(getUnusedDimShift()).lte(0) && !hasUpgrade('s', 'd'+this.id))},
            tooltip(){return 'f(x) = x<sup>'+spaceUpgradesText(n(this.green()), true)+'</sup><br>x = '+format(getWarpSpaceEffect())+', f(x) = '+format(this.effect())+'<br><grey>*基础效果: (扭曲空间效果)<sup>'+spaceUpgradesText(n(this.green()), true)+'</sup>提升时空悖论获取*</grey><br>基础效果: ×'+format(this.effect())},
            green(){
                let green = n(1.2)
                if(hasUpgrade('s', 'd'+this.id)){
                    green = green.mul(upgradeEffect('s', 'd'+this.id))
                }
                return green
            },
            effect(){return n(getWarpSpaceEffect()).pow(this.green())}
        },

        d12: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
        d22: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },

        d13: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
        d23: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
        d32: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
        d33: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },

        d14: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
        d24: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
        d34: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
        d42: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
        d43: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
        d44: {
            dimShift(){return true},
            title(){return tmp.s.upgrades[this.id.slice(1)].title+'<span class="dimShift">维度提升</span>'},
            description(){return tmp.s.upgrades[this.id.slice(1)].description},
            cost(){return n(1)},
            currencyDisplayName(){return '维度提升'},
            hardAfford(){return n(getUnusedDimShift()).gte(this.cost())},
            unlocked(){return (hasUpgrade('s', this.id.slice(1)) && n(getUnusedDimShift()).gte(1)) || hasUpgrade('s', this.id)},
            tooltip(){
                let dim = ''
                if(!hasUpgrade('s', this.id)){
                    dim = '<br><br><span class="dimShift">再次购买以进行维度提升</span><br>维度提升后公式中所有<br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }else{
                    dim = '<br><br><span class="dimShift">维度提升</span><br><green>绿色数值</green>×升维效果(×'+format(this.effect())+')<br><red>红色数值</red>÷升维效果(÷'+format(this.effect())+')'
                }
                return tmp.s.upgrades[this.id.slice(1)].tooltip+dim
            },
            effect(){
                return getDimShiftAffect()
            },
            style(){return getDimShiftClass(this.id)},
        },
    },
    clickables: {
        red: {
            onClick(){
                player.s.red = true
            },
            canClick(){return getPrismAmount() && !player.s.red},
            branches(){return ['green']},
            tooltip(){
                let effect = '<redlit><big>红光源</big></redlit><br>红光源可以提升时空悖论的产量<br>'
                effect += 'f(x) = x<sup>1.75</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getRedEffect)
                
                let unlock = ''
                if(player.s.red && getPrismAmount()){
                    unlock += '<br><br>混合光<br>同时激活其他色光以解锁对应的混合光加成'
                    unlock += '<br><br><yellowlit><big>黄光源</big></yellowlit><br>黄光源可以倍增空间数量<br>'
                    unlock += 'f(x) = x<sup>2</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getYellowEffect)
                    unlock += '<br><br><magentalit><big>紫光源</big></magentalit><br>紫光源可以使[s43]提前生效<br>'
                    unlock += 'f(x) = x<sup>0.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getMagentaEffect)
                }

                if(player.s.green && getPrismAmount()){
                    unlock += '<br><br>混合光<br>同时激活其他色光以解锁对应的混合光加成'
                    unlock += '<br><br><yellowlit><big>黄光源</big></yellowlit><br>黄光源可以倍增空间数量<br>'
                    unlock += 'f(x) = x<sup>2</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getYellowEffect)
                }

                if(player.s.blue && getPrismAmount()){
                    unlock += '<br><br>混合光<br>同时激活其他色光以解锁对应的混合光加成'
                    unlock += '<br><br><magentalit><big>紫光源</big></magentalit><br>紫光源可以使[s43]提前生效<br>'
                    unlock += 'f(x) = x<sup>0.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getMagentaEffect)
                }

                if(player.s.red && player.s.green){
                    effect += '<br><br><yellowlit><big>黄光源</big></yellowlit><br>黄光源可以倍增空间数量<br>'
                    effect += 'f(x) = x<sup>2</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getYellowEffect)
                }

                if(player.s.red && player.s.blue){
                    effect += '<br><br><magentalit><big>紫光源</big></magentalit><br>紫光源可以使[s43]提前生效<br>'
                    effect += 'f(x) = x<sup>0.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getMagentaEffect)
                }

                let tip = ''
                if(!player.s.red && getPrismAmount()){
                    tip = !player.s.red && getPrismAmount() ? '<br>*插入棱柱以激活效果*' : ''
                }

                return effect+unlock+tip
            },
            style(){
                if(player.s.red && player.s.green){
                    return {'background': 'yellow', "border-radius": "100%", 'width': '30px', 'height': '30px'}
                }else if(player.s.red && player.s.blue){
                    return {'background': 'magenta', "border-radius": "100%", 'width': '30px', 'height': '30px'}
                }else if(player.s.red){
                    return {'background': 'red', "border-radius": "100%", 'width': '30px', 'height': '30px'}
                }
                return {"background": "#000", "border-radius": "100%", 'width': '30px', 'height': '30px'}
            },
        },
        green: {
            onClick(){
                player.s.green = true
            },
            canClick(){return getPrismAmount() && !player.s.green},
            branches(){return ['blue']},
            tooltip(){
                let effect = '<greenlit><big>绿光源</big></greenlit><br>绿光源可以给于额外空间<br>'
                effect += 'f(x) = x<sup>1.25</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getGreenEffect)
                
                let unlock = ''
                if(player.s.green && getPrismAmount()){
                    unlock += '<br><br>混合光<br>同时激活其他色光以解锁对应的混合光加成'
                    unlock += '<br><br><yellowlit><big>黄光源</big></yellowlit><br>黄光源可以倍增空间数量<br>'
                    unlock += 'f(x) = x<sup>2</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getYellowEffect)
                    unlock += '<br><br><cyanlit><big>青光源</big></cyanlit><br>青光源可以给于额外的一维时空<br>'
                    unlock += 'f(x) = x<sup>1.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getCyanEffect)
                }

                if(player.s.red && getPrismAmount()){
                    unlock += '<br><br>混合光<br>同时激活其他色光以解锁对应的混合光加成'
                    unlock += '<br><br><yellowlit><big>黄光源</big></yellowlit><br>黄光源可以倍增空间数量<br>'
                    unlock += 'f(x) = x<sup>2</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getYellowEffect)
                }

                if(player.s.blue && getPrismAmount()){
                    unlock += '<br><br>混合光<br>同时激活其他色光以解锁对应的混合光加成'
                    unlock += '<br><br><cyanlit><big>青光源</big></cyanlit><br>青光源可以给于额外的一维时空<br>'
                    unlock += 'f(x) = x<sup>1.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getCyanEffect)
                }

                if(player.s.red && player.s.green){
                    effect += '<br><br><yellowlit><big>黄光源</big></yellowlit><br>黄光源可以倍增空间数量<br>'
                    effect += 'f(x) = x<sup>2</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getYellowEffect)
                }

                if(player.s.green && player.s.blue){
                    unlock += '<br><br><cyanlit><big>青光源</big></cyanlit><br>青光源可以给于额外的一维时空<br>'
                    unlock += 'f(x) = x<sup>1.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getCyanEffect)
                }

                let tip = ''
                if(!player.s.green && getPrismAmount()){
                    tip = !player.s.green && getPrismAmount() ? '<br>*插入棱柱以激活效果*' : ''
                }

                return effect+unlock+tip
            },
            style(){
                if(player.s.green && player.s.blue){
                    return {'background': 'cyan', "border-radius": "100%", 'width': '30px', 'height': '30px'}
                }else if(player.s.green && player.s.red){
                    return {'background': 'yellow', "border-radius": "100%", 'width': '30px', 'height': '30px'}
                }else if(player.s.green){
                    return {'background': 'green', "border-radius": "100%", 'width': '30px', 'height': '30px'}
                }
                return {"background": "#000", "border-radius": "100%", 'width': '30px', 'height': '30px'}
            },
        },
        blue: {
            onClick(){
                player.s.blue = true
            },
            canClick(){return getPrismAmount() && !player.s.blue},
            branches(){return ['red']},
            tooltip(){
                let effect = '<bluelit><big>蓝光源</big></bluelit><br>蓝光源可以提升你的时间速率<br>'
                effect += 'f(x) = x<sup>0.75'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getBlueEffect)

                let unlock = ''
                if(player.s.blue && getPrismAmount()){
                    unlock += '<br><br>混合光<br>同时激活其他色光以解锁对应的混合光加成'
                    unlock += '<br><br><magentalit><big>紫光源</big></magentalit><br>紫光源可以使[s43]提前生效<br>'
                    unlock += 'f(x) = x<sup>0.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getMagentaEffect)
                    unlock += '<br><br><cyanlit><big>青光源</big></cyanlit><br>青光源可以给于额外的一维时空<br>'
                    unlock += 'f(x) = x<sup>1.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getCyanEffect)
                }

                if(player.s.red && getPrismAmount()){
                    unlock += '<br><br>混合光<br>同时激活其他色光以解锁对应的混合光加成'
                    unlock += '<br><br><magentalit><big>紫光源</big></magentalit><br>紫光源可以使[s43]提前生效<br>'
                    unlock += 'f(x) = x<sup>0.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getMagentaEffect)
                }

                if(player.s.green && getPrismAmount()){
                    unlock += '<br><br>混合光<br>同时激活其他色光以解锁对应的混合光加成'
                    unlock += '<br><br><cyanlit><big>青光源</big></cyanlit><br>青光源可以给于额外的一维时空<br>'
                    unlock += 'f(x) = x<sup>1.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getCyanEffect)
                }

                if(player.s.red && player.s.blue){
                    unlock += '<br><br><magentalit><big>紫光源</big></magentalit><br>紫光源可以使[s43]提前生效<br>'
                    unlock += 'f(x) = x<sup>0.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getMagentaEffect)
                }

                if(player.s.green && player.s.blue){
                    unlock += '<br><br><cyanlit><big>青光源</big></cyanlit><br>青光源可以给于额外的一维时空<br>'
                    unlock += 'f(x) = x<sup>1.5'+(hasMilestone('s', 7) ? '+'+format(tmp.s.milestones[7].effect) : '')+'</sup><br>x = '+format(getIllumination())+', f(x) = '+format(tmp.s.getCyanEffect)
                }

                let tip = ''
                if(!player.s.blue && getPrismAmount()){
                    tip = !player.s.blue && getPrismAmount() ? '<br>*插入棱柱以激活效果*' : ''
                }

                return effect+unlock+tip
            },
            style(){
                if(player.s.blue && player.s.red){
                    return {'background': 'magenta', "border-radius": "100%", 'width': '30px', 'height': '30px'}
                }else if(player.s.blue && player.s.green){
                    return {'background': 'cyan', "border-radius": "100%", 'width': '30px', 'height': '30px'}
                }else if(player.s.blue){
                    return {'background': 'blue', "border-radius": "100%", 'width': '30px', 'height': '30px'}
                }
                return {"background": "#000", "border-radius": "100%", 'width': '30px', 'height': '30px'}
            },
        },

        challenge: {
            display(){
                return `
                `+(player.s.inVolumeChallenge ? '<red>!</red>你正在体积膨胀挑战中<red>!</red>' : '进入并以上配置进行体积膨胀挑战')+`
                `+(player.s.inVolumeChallenge ? (player.s.points.gte(getChallengeDone()) ? '再次点击以完成挑战' : '以下效果对你产生了影响') : '在挑战中你会获得以下效果')+`<br>
                挑战目标: <span class="space non-color">`+format(getChallengeDone())+`</span> 空间<br>
                效果:
                <span class="challengeTable">时空悖论生产</span><span class="effectTable">/`+format(getChallengeAffect())+`</span>
                <span class="challengeTable">空间数量</span><span class="effectTable">/`+format(getVolumeAffect()[0])+`</span>
                <span class="challengeTable">扭曲空间数量</span><span class="effectTable">/`+format(getVolumeAffect()[1])+`</span>
                <span class="challengeTable">光强数量</span><span class="effectTable">/`+format(getVolumeAffect()[2])+`</span><br>
                奖励:
                `+((!player.s.inVolumeChallenge && !hasUpgrade('s', 41)) ? '你需要获得[s41]才能进入挑战' : (n(volumeExpectGain()).gt(getVolume()) ? `获得 `+format(n(volumeExpectGain()).sub(getVolume()))+` 体积` : '你需要进行更难的挑战以获得奖励'))+`
                `
            },
            tooltip(){
                if(player.s.inVolumeChallenge){
                    return `
                    体积膨胀挑战<br><br>
                    `+(n(getChallengeDone()).sub(player.s.points).gt(0) ? `你还需要 `+format(n(getChallengeDone()).sub(player.s.points))+` 空间以完成挑战` : '点击退出并完成挑战')+`<br><br>
                    完成挑战你将获得 `+format(volumeExpectGain())+` 体积`+(n(volumeExpectGain()).gt(getVolume()) ? ` (+`+format(n(volumeExpectGain()).sub(getVolume()))+`)` : ``)+`
                    `
                }else{
                    return `
                    体积膨胀挑战<br><br>
                    进入体积膨胀挑战将重置空间点数,基层(最左侧一列除外),扭曲空间和棱柱并进行一次空间重置<br><br>
                    在挑战中<br><br>
                    购买一维时空将被禁用<br>
                    打乱空间将被禁用<br>
                    进行扭曲空间将被禁用<br>
                    拔出棱柱将被禁用<br>
                    基层的消耗将基于基层数量更改<br><br>
                    基于你的预设变量和预设体积更改挑战难度并获得对应效果<br>
                    体积将减少空间,扭曲空间,光强的数量<br>
                    变量X会提升空间完成的需求量<br>
                    变量Y会提升你的体积惩罚的指数<br>
                    变量Z会降低时空悖论的生产<br><br>
                    完成挑战后<br>
                    预设体积的数值将覆盖至空间体积<br>
                    (首次完成挑战将在体积中解锁里程碑页面)<br><br>
                    (预设体积为变量XYZ三者的乘积)<br><br>
                    `+(n(volumeExpectGain()).gt(getVolume()) ? `点击进入挑战` : '你需要更多的预设体积才能开始挑战')+`
                    `
                }
            },
            canClick(){return n(volumeExpectGain()).gt(getVolume()) && (player.s.inVolumeChallenge || hasUpgrade('s', 41))},
            onClick(){
                if(player.s.inVolumeChallenge && player.s.points.gte(getChallengeDone())){
                    player.s.x = player.s.xSet
                    player.s.y = player.s.ySet
                    player.s.z = player.s.zSet
                }

                player.s.inVolumeChallenge = !player.s.inVolumeChallenge
                volumeReset()
                if(player.s.inVolumeChallenge){
                    player.s.upgrades = [11,21,31,41]
                    player.s.normalUpgrades = [11,21,31,41]
                }else{
                    player.s.points = n(34)
                    player.s.best = n(34)
                    player.s.upgrades = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]
                    player.s.normalUpgrades = [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]
                }
            },
            style(){
                if(player.s.inVolumeChallenge && player.s.points.gte(getChallengeDone())){
                    return {'background': '#fff', "color": "#000", 'border-color': '#000', 'animation': 'spaceMilestoneDone 5s infinite'}
                }
                if(player.s.inVolumeChallenge){
                    return {'background': '#fff', "color": "#000", 'border-color': '#000'}
                }
                return {}
            },
        },

        xSub: {
            display(){return '-'},
            canClick(){return player.s.xSet.gte(2) && !player.s.inVolumeChallenge},
            onClick(){player.s.xSet = player.s.xSet.sub(1)},
            style(){
                if(!this.canClick()){
                    return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px', "border": "2px dashed"}
                }
                return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px'}
            },
        },
        xAdd: {
            display(){return '+'},
            canClick(){return player.s.xSet.lte(9) && !player.s.inVolumeChallenge},
            onClick(){player.s.xSet = player.s.xSet.add(1)},
            style(){
                if(!this.canClick()){
                    return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px', "border": "2px dashed"}
                }
                return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px'}
            },
        },
        ySub: {
            display(){return '-'},
            canClick(){return player.s.ySet.gte(2) && !player.s.inVolumeChallenge},
            onClick(){player.s.ySet = player.s.ySet.sub(1)},
            style(){
                if(!this.canClick()){
                    return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px', "border": "2px dashed"}
                }
                return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px'}
            },
        },
        yAdd: {
            display(){return '+'},
            canClick(){return player.s.ySet.lte(9) && !player.s.inVolumeChallenge},
            onClick(){player.s.ySet = player.s.ySet.add(1)},
            style(){
                if(!this.canClick()){
                    return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px', "border": "2px dashed"}
                }
                return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px'}
            },
        },
        zSub: {
            display(){return '-'},
            canClick(){return player.s.zSet.gte(2) && !player.s.inVolumeChallenge},
            onClick(){player.s.zSet = player.s.zSet.sub(1)},
            style(){
                if(!this.canClick()){
                    return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px', "border": "2px dashed"}
                }
                return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px'}
            },
        },
        zAdd: {
            display(){return '+'},
            canClick(){return player.s.zSet.lte(9) && !player.s.inVolumeChallenge},
            onClick(){player.s.zSet = player.s.zSet.add(1)},
            style(){
                if(!this.canClick()){
                    return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px', "border": "2px dashed"}
                }
                return {width: "30px", height: "30px", "border-radius": "0%", "z-index": "1", "font-size": '16px'}
            },
        },

        11: {
            display(){return '打乱空间<br>进行一次空间重置,并返还已被使用的空间'},
            onClick(){
                doReset('s')
                doReset('s', true)

                let b = n(0)
                for(let i in player.s.normalUpgrades){
                    if(tmp.s.upgrades[player.s.normalUpgrades[i]].dimShift==undefined){
                        b = b.add(1)
                    }
                }
                let k = n(b).root(2).floor().min(4)
                player.s.upgrades = []
                player.s.normalUpgrades = []
                for(let r = 1; r<=k; r++){
                    for(let c = 1; c<=k; c++){
                        player.s.upgrades.push(Number(r*10+c))
                        player.s.normalUpgrades.push(Number(r*10+c))
                    }
                }
                getDimShiftClass('reset')
            },
            canClick(){return true},
            unlocked(){return !player.s.inVolumeChallenge && !player.si.contracting},
            style(){return {'background-color': '#000'}},
        },
        12: {
            display(){return '进行空间扭曲<br>进行一次空间重置,并失去所有空间并获得对应数量的扭曲空间'},
            onClick(){
                doReset('s')
                player.s.warp = player.s.warp.add(getWarpGain())
                player.s.points = n(0)
                
                doReset('s', true)
                doReset('s')
            },
            tooltip(){
                if(player.s.points.lt(3)){
                    return '你需要至少3空间来进行扭曲空间'
                }
                return '进行空间扭曲并获得'+format(getWarpGain())+'扭曲时空'
            },
            canClick(){return player.s.points.gte(3)},
            unlocked(){return !player.s.inVolumeChallenge && !player.si.contracting},
            style(){
                if(this.canClick()){
                    return {'background-color': '#000'}
                }
                return {'background-color': '#000', "border": "2px dashed"}
            },
        },
        13: {
            display(){return '拔出棱柱<br>进行一次空间重置并返还你的棱柱'},
            onClick(){
                player.s.red = false
                player.s.green = false
                player.s.blue = false

                doReset('s')
                doReset('s', true)
            },
            unlocked(){return !player.s.inVolumeChallenge && !player.si.contracting},
            canClick(){return true},
        }
    },
    milestones: {
        1: {
			requirementDescription(){return "第一体积里程碑"},
            effectDescription(){return '奖励: 基于体积使扭曲空间和光强的最终数量增加(+'+format(this.effect())+')<br>目标: '+format(getVolume(), 0)+' / '+format(this.req(), 0)+' 体积'},
            req(){return n(2)},
            done(){return n(getVolume()).gte(this.req())},
            effect(){
                return n(getVolumeAmount()).add(16).pow(0.25).max(0)
            },
        },
        2: {
			requirementDescription(){return "第二体积里程碑"},
            effectDescription(){return '奖励: 当时空悖论生产大于1时基于体积提升时空悖论产量的指数(^'+format(this.effect())+')<br>目标: '+format(getVolume(), 0)+' / '+format(this.req(), 0)+' 体积'},
            req(){return n(3)},
            done(){return n(getVolume()).gte(this.req())},
            effect(){
                let base = n(getVolumeAmount()).max(1).log(10)
                return n(base).pow(2).div(n(base).add(2).pow(2)).add(1.3)
            },
        },
        3: {
			requirementDescription(){return "第三体积里程碑"},
            effectDescription(){return '奖励: 获得一根额外的棱柱<br>目标: '+format(getVolume(), 0)+' / '+format(this.req(), 0)+' 体积'},
            req(){return n(4)},
            done(){return n(getVolume()).gte(this.req())},
        },
        4: {
			requirementDescription(){return "第四体积里程碑"},
            effectDescription(){return '奖励: 自动获得空间,购买空间不再重置任何东西<br>目标: '+format(getVolume(), 0)+' / '+format(this.req(), 0)+' 体积'},
            req(){return n(8)},
            done(){return n(getVolume()).gte(this.req())},
        },
        5: {
			requirementDescription(){return "第五体积里程碑"},
            effectDescription(){return '奖励: 基于你的体积,你可以对已购买的基层进行升维(+'+format(this.effect())+')<br>目标: '+format(getVolume(), 0)+' / '+format(this.req(), 0)+' 体积'},
            req(){return n(12)},
            done(){return n(getVolume()).gte(this.req())},
            tooltip(){return '下一个升维在: '+format(n(this.nextAt()), 0)+' 体积'},
            nextAt(){
                return n(this.effect()).add(1).sub(2).mul(180)
            },
            effect(){
                return n(getVolumeAmount()).div(180).floor().add(2)
            },
        },
        6: {
			requirementDescription(){return "第六体积里程碑"},
            effectDescription(){return '奖励: 基于体积使[s43]提前生效(+'+format(this.effect())+')<br>目标: '+format(getVolume(), 0)+' / '+format(this.req(), 0)+' 体积'},
            req(){return n(15)},
            done(){return n(getVolume()).gte(this.req())},
            effect(){
                return n(getVolumeAmount()).max(1).log(4)
            }
        },
        7: {
			requirementDescription(){return "第七体积里程碑"},
            effectDescription(){return '奖励: 基于体积使蓝光源和其复合色效果指数增加(+'+format(this.effect())+')<br>目标: '+format(getVolume(), 0)+' / '+format(this.req(), 0)+' 体积'},
            req(){return n(20)},
            done(){return n(getVolume()).gte(this.req())},
            effect(){
                return n(getVolumeAmount()).max(1).log(100).div(2)
            },
        },
        8: {
			requirementDescription(){return "第八体积里程碑"},
            effectDescription(){return '奖励: 解锁寄点(新层级)<br>目标: '+format(getVolume(), 0)+' / '+format(this.req(), 0)+' 体积'},
            req(){return n(200)},
            done(){return n(getVolumeAmount()).gte(this.req())},
        },
        /*9: {
			requirementDescription(){return "第九体积里程碑"},
            effectDescription(){return '奖励: 解锁二维时空(在时空中)<br>目标: '+format(getVolume(), 0)+' / '+format(this.req(), 0)+' 体积'},
            req(){return n(1000)},
            done(){return n(getVolume()).gte(this.req())},
        },*/
    },
    microtabs: {
        tab: {
            "base": {
                name(){return '基层'},
                nameI18N(){return 'Base'},
                content:[
                    ["display-text", function(){return '你还有 <span class="space">'+format(getUnusedSpace(), 0)+' / '+format(player.s.best, 0)+' 空间</span> 未被使用'}],
                    ["display-text", function(){return n(getDimShiftAmount()).gte(1) ? '你还可以提升 <span class="dimShift">'+format(getUnusedDimShift(), 0)+' / '+format(getDimShiftAmount(), 0)+' </span> 个已购买的基层的维度' : ''}],
                    ["display-text", function(){return n(getDimShiftAmount()).gte(1) ? '<br>你的升维基础效果为 <span class="dimShift">'+format(getDimShiftAffect())+'</span>' : ''}],
                    ["display-text", function(){return player.s.inVolumeChallenge ? '你正在体积挑战中,它使你的基层价格发生了改变' : ''}],
                    'blank',
                    'blank',
                    ['row', [
                        ['upgrade', 41],
                        ['upgrade', 42], ['upgrade', 'd42'],
                        ['upgrade', 43], ['upgrade', 'd43'],
                        ['upgrade', 44], ['upgrade', 'd44'],
                    ]],
                    ['row', [
                        ['upgrade', 31],
                        ['upgrade', 32], ['upgrade', 'd32'],
                        ['upgrade', 33], ['upgrade', 'd33'],
                        ['upgrade', 34], ['upgrade', 'd34'],
                    ]],
                    ['row', [
                        ['upgrade', 21],
                        ['upgrade', 22], ['upgrade', 'd22'],
                        ['upgrade', 23], ['upgrade', 'd23'],
                        ['upgrade', 24], ['upgrade', 'd24'],
                    ]],
                    ['row', [
                        ['upgrade', 11],
                        ['upgrade', 12], ['upgrade', 'd12'],
                        ['upgrade', 13], ['upgrade', 'd13'],
                        ['upgrade', 14], ['upgrade', 'd14'],
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
                    ["display-text", function(){return '你有 <span class="space">'+format(player.s.warp)+amountDisplay(player.s.warp, getWarpAmount())+' 扭曲空间</span>'+(n(getWarpGen()).neq(0) ? '(+'+format(getWarpGen())+'/s)' : '')+', 它们使得你的时间速率×<span class="timespeed">'+format(getWarpSpaceEffect())+'</span>'+(hasUpgrade('s', 44) ? ', 时空悖论×<span class="space">'+format(upgradeEffect('s', 44))+'</span>' : '')+(hasUpgrade('s', 14) ? ', 一维时空产量×<span class="space">'+format(upgradeEffect('s', 14))+'</span>' : '')}],
                    ["display-text", function(){return `<span style="font-family: Courier New">
                        f(x) = log<sub>2</sub>(x)<sup>1.5</sup><br>
                        x = `+format(getWarpAmount())+`, f(x) = `+format(getWarpSpaceEffect())+`
                        </span>
                    `}],
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
                    ["display-text", function(){return '你的时空悖论的原始产量为 <span class="space">'+format(getOriginalPointGain())+'/rs</span>, 它们为你提供了 <span class="space">'+format(getIlluminationBase())+amountDisplay(getIlluminationBase(), getIllumination())+' 光强</span>'}],
                    ["display-text", function(){return `<span style="font-family: Courier New">
                        f(x) = log<sub>2</sub>(x)<br>
                        x = `+format(getOriginalPointGain())+`, f(x) = `+format(getIllumination())+`
                        </span>
                    `}],
                    'blank',
                    ['clickable', 'red'],
                    ['row', [
                    ]],
                    ['row', [
                        ['clickable', 'green'],
                        'blank',
                        ['clickable', 'blue'],
                    ]],
                    'blank',
                    ["display-text", function(){return getPrismAmount() ? '*你还有可插入的棱柱未插入*' : ''}],
                    ["display-text", function(){return getPrismAmount() ? '<darkgrey>*点击上方黑色圆圈以插入棱柱*</darkgrey>' : ''}],
                    ["display-text", function(){return player.s.red ? '基于你的光强, <redlit>红光源</redlit>为你提供了 '+format(tmp.s.getRedEffect)+' 倍一维时空倍率' : ''}],
                    ["display-text", function(){return player.s.green ? '基于你的光强, <greenlit>绿光源</greenlit>为你提供了 '+format(tmp.s.getGreenEffect)+' 额外空间' : ''}],
                    ["display-text", function(){return player.s.blue ? '基于你的光强, <bluelit>蓝光源</bluelit>为你提供了 '+format(tmp.s.getBlueEffect)+' 倍时间速率' : ''}],
                    'blank',
                    ["display-text", function(){return player.s.red && player.s.green ? '基于你的光强, <yellowlit>黄光源</yellowlit>为你提供了 '+format(tmp.s.getYellowEffect)+' 倍额外空间' : ''}],
                    ["display-text", function(){return player.s.red && player.s.blue ? '基于你的光强, <magentalit>紫光源</magentalit>为你提供了 [s43]提前 '+format(tmp.s.getMagentaEffect)+' 生效' : ''}],
                    ["display-text", function(){return player.s.green && player.s.blue ? '基于你的光强, <cyanlit>青光源</cyanlit>为你提供了 '+format(tmp.s.getCyanEffect)+' 额外一维时空' : ''}],
                    'blank',
                    'blank',
                    ['clickable', 13],
                ],
            },
            "volume": {
                name(){return '体积'},
                nameI18N(){return 'Volume'},
                unlocked(){return hasUpgrade('s', 41) || player.s.inVolumeChallenge || hasMilestone('si', 1)},
                content:[
                    ["display-text", function(){return '你的空间具有 <span class="space">'+format(getVolume())+amountDisplay(getVolume(), getVolumeAmount())+' 体积</span>'}],
                    'blank',
                    ["microtabs", "volume"]
                ]
            },
        },

        volume: {
            "expansion": {
                name(){return '膨胀'},
                nameI18N(){return 'Expansion'},
                unlocked(){return true},
                content:[
                    ["display-text", function(){return '你预获得 <span class="space">'+format(volumeExpectGain())+' 体积'+(n(volumeExpectGain()).gt(getVolume()) ? ' (+'+format(n(volumeExpectGain()).sub(getVolume()))+')' : '')+'</span>'}],
                    "blank",
                    ['row', [
                        ["display-text", function(){return '<div class="spaceTable"><span class="space" style="width: 50px">X</span></div>'}],
                        ['clickable', 'xSub'],
                        ["display-text", function(){return '<div class="spaceTable" style="width: 15px"></div>'}],
                        ["display-text", function(){return '<div class="spaceTable" style="width: 30px"><span class="space">'+format(player.s.xSet, 0)+'</span></div>'}],
                        ["display-text", function(){return '<div class="spaceTable"><span class="space">'+(player.s.x.neq(player.s.xSet) ? '('+(player.s.xSet.sub(player.s.x).gt(0) ? '+' : '')+format(player.s.xSet.sub(player.s.x) ,0)+')' : '')+'</span></div>'}],
                        ["display-text", function(){return '<div class="spaceTable">/10</div>'}],
                        ['clickable', 'xAdd']
                    ]],
                    "blank",
                    ['row', [
                        ["display-text", function(){return '<div class="spaceTable"><span class="space" style="width: 50px">Y</span></div>'}],
                        ['clickable', 'ySub'],
                        ["display-text", function(){return '<div class="spaceTable" style="width: 15px"></div>'}],
                        ["display-text", function(){return '<div class="spaceTable" style="width: 30px"><span class="space">'+format(player.s.ySet, 0)+'</span></div>'}],
                        ["display-text", function(){return '<div class="spaceTable"><span class="space">'+(player.s.y.neq(player.s.ySet) ? '('+(player.s.ySet.sub(player.s.y).gt(0) ? '+' : '')+format(player.s.ySet.sub(player.s.y) ,0)+')' : '')+'</span></div>'}],
                        ["display-text", function(){return '<div class="spaceTable">/10</div>'}],
                        ['clickable', 'yAdd']
                    ]],
                    "blank",
                    ['row', [
                        ["display-text", function(){return '<div class="spaceTable"><span class="space" style="width: 50px">Z</span></div>'}],
                        ['clickable', 'zSub'],
                        ["display-text", function(){return '<div class="spaceTable" style="width: 15px"></div>'}],
                        ["display-text", function(){return '<div class="spaceTable" style="width: 30px"><span class="space">'+format(player.s.zSet, 0)+'</span></div>'}],
                        ["display-text", function(){return '<div class="spaceTable"><span class="space">'+(player.s.z.neq(player.s.zSet) ? '('+(player.s.zSet.sub(player.s.z).gt(0) ? '+' : '')+format(player.s.zSet.sub(player.s.z) ,0)+')' : '')+'</span></div>'}],
                        ["display-text", function(){return '<div class="spaceTable">/10</div>'}],
                        ['clickable', 'zAdd']
                    ]],
                    "blank",
                    ['clickable', 'challenge'],
                    "blank",
                    ["microtabs", "affect"]
                ]
            },
            "milestones": {
                name(){return '里程碑'},
                nameI18N(){return 'Milestones'},
                unlocked(){return n(getVolume()).gte(2) || hasMilestone('si', 1)},
                content:[
                    ["display-text", function(){return '你已完成了 <span class="space">'+format(player.s.milestones.length, 0)+'</span> 个体积里程碑'}],
                    ["display-text", function(){return tmp.s.milestones[player.s.milestones.length+1]!==undefined && tmp.si.unlocked ? '下个体积里程碑需要 <span class="space">'+format(tmp.s.milestones[player.s.milestones.length+1].req, 0)+'</span> 体积' : ''}],
                    'blank',
                    'blank',
                    ['milestone', 1],
                    ['milestone', 2],
                    ['milestone', 3],
                    ['milestone', 4],
                    ['milestone', 5],
                    ['milestone', 6],
                    ['milestone', 7],
                    ['milestone', 8],
                    //['milestone', 9],
                    'blank',
                    'blank',
                ]
            },
        },

        affect:{
            "affect": {
                name(){return '影响'},
                nameI18N(){return 'Affect'},
                unlocked(){return true},
                content:[
                    ['row', [
                        ['column', [
                            ["display-text", function(){return '你的体积造成了困难'}],
                            ["display-text", function(){return '基于你的预设变量,挑战的难度受到影响'}],
                            "blank",
                            ['row', [
                                ["display-text", function(){return '<div class="spaceTable"><span class="space">X</span></div>'}],
                                ["display-text", function(){return '<div class="spaceTable"><span class="space">('+format(player.s.xSet, 0)+')</span></div>'}],
                                ["display-text", function(){return '<span class="space"><div class="dimTable">完成挑战需求</div></space>'}],
                                ["display-text", function(){return '<div class="spaceTable"><span class="space">+'+format(getChallengeDone())+'</span></div>'}],
                            ]],
                            ['row', [
                                ["display-text", function(){return '<div class="spaceTable"><span class="space">Y</span></div>'}],
                                ["display-text", function(){return '<div class="spaceTable"><span class="space">('+format(player.s.ySet, 0)+')</span></div>'}],
                                ["display-text", function(){return '<span class="space"><div class="dimTable">体积惩罚指数</div></space>'}],
                                ["display-text", function(){return '<div class="spaceTable"><span class="space">^'+format(getChallengeDifficulty())+'</span></div>'}],
                            ]],
                            ['row', [
                                ["display-text", function(){return '<div class="spaceTable"><span class="space">Z</span></div>'}],
                                ["display-text", function(){return '<div class="spaceTable"><span class="space">('+format(player.s.zSet, 0)+')</span></div>'}],
                                ["display-text", function(){return '<span class="space"><div class="dimTable">时空悖论生产</div></space>'}],
                                ["display-text", function(){return '<div class="spaceTable"><span class="space">/'+format(getChallengeAffect())+'</span></div>'}],
                            ]],
                        ]],
                        "blank",
                        "blank",
                        "blank",
                        "blank",
                        "blank",
                        "blank",
                        "blank",
                        "blank",
                        "blank",
                        "blank",
                        ['column', [
                            ["display-text", function(){return '你的体积稀释了空间'}],
                            ["display-text", function(){return '基于你的预设体积,以下资源的数量受到影响'}],
                            "blank",
                            ['row', [
                                ["display-text", function(){return '<div class="dimTable"><span class="space">空间</span></div>'}],
                                ["display-text", function(){return '<div class="dimTable"><span class="space">/'+format(getVolumeAffect()[0])+'</span></div>'}],
                            ]],
                            ['row', [
                                ["display-text", function(){return '<div class="dimTable"><span class="space">扭曲空间</span></div>'}],
                                ["display-text", function(){return '<div class="dimTable"><span class="space">/'+format(getVolumeAffect()[1])+'</span></div>'}],
                            ]],
                            ['row', [
                                ["display-text", function(){return '<div class="dimTable"><span class="space">光强</span></div>'}],
                                ["display-text", function(){return '<div class="dimTable"><span class="space">/'+format(getVolumeAffect()[2])+'</span></div>'}],
                            ]]
                        ]]
                    ]],
                    'blank',
                ]
            },
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       ["display-text", function(){return '你有 <span class="space">'+format(player.s.points)+amountDisplay(player.s.points, getSpaceAmount())+' 空间</span>'}],
       ["display-text", function(){return `<span style="font-family: Courier New">
           f(x) = `+(hasUpgrade('s', 43) ? '(10-8×(s43))' : '10')+`<sup>x</sup>`+(hasUpgrade('s', 23) ? '/(s23)' : '')+`<br>
           x = `+format(tmp.s.CostAmount)+`, f(x) = `+format(getNextAt(this.layer))+`
           </span>
       `}],
       "blank",
       "prestige-button",
       "blank",
       ["microtabs", "tab"]
    ],
    layerShown(){return true},
})