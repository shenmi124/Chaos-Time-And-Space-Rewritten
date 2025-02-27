function getSingularityBaseEffect(){
    return n(10).mul(buyableEffect('si', 21))
}

function getSingularityEffect(){
    return n(getSingularityBaseEffect()).pow(player.si.points)
}

function getThermalEnergyOriginalGen(){
    let base = n(getSingularityEffect())
    base = base.mul(buyableEffect('si', 11))
    base = base.mul(buyableEffect('si', 22))
    return n(base)
}

function getThermalEnergyGen(){
    let base = n(getThermalEnergyOriginalGen())
    return n(base).mul(getTimeSpeed())
}

function getThermalEnergyEffect(){
    return player.si.thermalEnergyBest.max(1).log(10).pow(1.1).add(1).pow(buyableEffect('si', 23))
}

function getThermalEnergyMax(){
    return n('1.79e308')
}

function thermalEnergyReset(upg=false){
    for(let i in player.si.buyables){
        if(upg && i==31){
            break
        }
        player.si.buyables[i] = n(0)
    }
    player.si.thermalEnergy = n(0)
    player.si.thermalEnergyBest = n(0)
    if(upg==true){
        doReset('s')
    }
}

/*function singularityReset(){
    player.s.points = n(0)
    player.s.best = n(0)
    player.s.warp = n(0)

    player.s.red = false
    player.s.green = false
    player.s.blue = false

    player.si.replicanti = n(1)
    doReset('s', true)
}*/

addLayer("si", {
    name: "singularity",
    symbol: "奇点",
    symbolI18N: "Singularity",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        thermalEnergy: n(0),
        thermalEnergyBest: n(0),

        contracting: false,
        tempSpace: n(0),
    }},
    color: "#fff",
    nodeStyle: {'border-color': 'rgb(201 201 201)'},
    type: "custom",
    getResetGain(){
        return n(1)
    },
    getNextAt(){
        return n(308).mul(player.si.points.mul(0.1).add(1))
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    update(diff){
        if(hasMilestone('si', 1)){
            player.si.thermalEnergy = player.si.thermalEnergy.add(n(getThermalEnergyGen()).mul(diff)).min(getThermalEnergyMax())
            player.si.thermalEnergyBest = player.si.thermalEnergyBest.max(player.si.thermalEnergy)
        }
/*
		if(hasUpgrade("co",15) && player[this.layer].points.gte(b)){setBuyableAmount(this.layer, 11, getBuyableAmount(this.layer, 11).add(1))}
		if(hasUpgrade("co",15) && player[this.layer].points.gte(d)){setBuyableAmount(this.layer, 12, getBuyableAmount(this.layer, 12).add(1))}
		if(hasUpgrade("co",15) && player[this.layer].points.gte(g)){setBuyableAmount(this.layer, 13, getBuyableAmount(this.layer, 13).add(1))}*/

        if(false){
            player.s.extraVolume = player.s.extraVolume.add(n(tmp.si.milestones[1].effect).mul(diff))
        }

        if(player.si.contracting){
            player.s.points = player.s.points.div(n(1.2).pow(diff)).sub(n(1).mul(diff)).max(0)
            player.points = player.points.div(n(player.points).mul(0.2).max(1).pow(diff)).sub(n(1).mul(diff)).max(0)
            player.s.warp = player.s.warp.div(n(player.s.warp).mul(0.2).max(1).pow(diff)).sub(n(1).mul(diff)).max(0)
            document.body.style.setProperty('--volume', player.s.points.div(player.si.tempSpace).mul(270).add(30)+'px');
            document.body.style.setProperty('--volumeMargin', n(1).sub(player.s.points.div(player.si.tempSpace)).mul(270).div(2)+'px');
            if(player.s.points.eq(0)){
                player.si.points = player.si.points.add(tmp.si.getResetGain)
                player.si.contracting = false
                player.si.tempSpace = n(0)
                thermalEnergyReset()
                doReset('si', true)
                player.s.normalUpgrades = []
                player.s.upgradesBought = []     
                if(hasMilestone('si', 1) || layers.si.milestones[1].done()){
                    player.s.milestones.push('4')
                    player.s.milestones.push('8')
                }
                if(hasMilestone('si', 2) || layers.si.milestones[2].done()){
                    player.s.milestones.push('2')
                    player.s.milestones.push('3')
                }
                if(hasMilestone('si', 3) || layers.si.milestones[3].done()){
                    player.s.milestones.push('1')
                    player.s.milestones.push('5')
                }
            }
        }else{
            document.body.style.setProperty('--volume', '300px');
            document.body.style.setProperty('--volumeMargin', '0px');
        }
    },
    buyables: {
        11: {
            display(){return '热能速度[si11]<br>(数量: '+format(getBuyableAmount(this.layer, this.id), 0)+')<br><br>提升热能生产<br><br>当前效果: ×'+format(this.effect())+'<br><br>价格: '+format(this.cost())+' 热能'},
            cost(x){
                return n(8).pow(x).div(buyableEffect('si', 13))
            },
            effect(x){
                let base = n(0.5).add(buyableEffect('si', 12)).add(buyableEffect('si', 24)).mul(buyableEffect('si', 14)).mul(x).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            effecNext(x=n(getBuyableAmount(this.layer, this.id)).add(1)){
                let base = n(0.5).add(buyableEffect('si', 12)).add(buyableEffect('si', 24)).mul(buyableEffect('si', 14)).mul(x).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            canAfford(){return player.si.thermalEnergy.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                if(n(getBuyableAmount('si', 31)).lt(4) || true){
                    player.si.thermalEnergy = player.si.thermalEnergy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            tooltip(){
                return format(this.effect())+' -> '+format(this.effecNext())
            },
            style(){
                return {}
            },
        },
        12: {
            display(){return '协同速度[si12]<br>(数量: '+format(getBuyableAmount(this.layer, this.id), 0)+')<br><br>提升[si11]的基础效果<br><br>当前效果: +'+format(this.effect())+'<br><br>价格: '+format(this.cost())+' 热能'},
            cost(x){
                return n(x.add(5)).pow(x.add(5).mul(0.5)).div(buyableEffect('si', 13))
            },
            effect(x){
                let base = n(0.5).add(buyableEffect('si', 14)).add(buyableEffect('si', 24)).mul(x)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            effecNext(x=n(getBuyableAmount(this.layer, this.id)).add(1)){
                let base = n(0.5).add(buyableEffect('si', 14)).add(buyableEffect('si', 24)).mul(x)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            canAfford(){return player.si.thermalEnergy.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                if(n(getBuyableAmount('si', 31)).lt(4) || true){
                    player.si.thermalEnergy = player.si.thermalEnergy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            tooltip(){
                return format(this.effect())+' -> '+format(this.effecNext())
            },
            style(){
                return {}
            },
        },
        13: {
            display(){return '压缩速度[si13]<br>(数量: '+format(getBuyableAmount(this.layer, this.id), 0)+')<br><br>降低[si11]和[si12]的价格<br><br>当前效果: ÷'+format(this.effect())+'<br><br>价格: '+format(this.cost())+' 热能'},
            cost(x){
                return n(20).mul(x.add(5)).pow(x.add(2).mul(0.5))
            },
            effect(x){
                let base = n(2).add(buyableEffect('si', 14)).add(buyableEffect('si', 24)).pow(x)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                return base
            },
            effecNext(x=n(getBuyableAmount(this.layer, this.id)).add(1)){
                let base = n(2).add(buyableEffect('si', 14)).add(buyableEffect('si', 24)).pow(x)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                return base
            },
            canAfford(){return player.si.thermalEnergy.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                if(n(getBuyableAmount('si', 31)).lt(4) || true){
                    player.si.thermalEnergy = player.si.thermalEnergy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            tooltip(){
                return format(this.effect())+' -> '+format(this.effecNext())
            },
            style(){
                return {}
            },
        },
        14: {
            display(){return '膨胀速度[si14]<br>(数量: '+format(getBuyableAmount(this.layer, this.id), 0)+')<br><br>提升前三者的基础效果底数<br><br>当前效果: ×'+format(this.effect())+'<br><br>价格: '+format(this.cost())+' 热能'},
            cost(x){
                let base = n(2).pow(x.add(2).mul(0.5)).pow(x.add(2).mul(0.5)).mul(1e6)
                if(n(getBuyableAmount('si', 31)).gte(2)){
                    base = base.div(buyableEffect('si', 13))
                }
                return base
            },
            effect(x){
                let base = n(0.25).add(buyableEffect('si', 24)).mul(x).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            effecNext(x=n(getBuyableAmount(this.layer, this.id)).add(1)){
                let base = n(0.25).add(buyableEffect('si', 24)).mul(x).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            canAfford(){return player.si.thermalEnergy.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                if(n(getBuyableAmount('si', 31)).lt(4) || true){
                    player.si.thermalEnergy = player.si.thermalEnergy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            tooltip(){
                return format(this.effect())+' -> '+format(this.effecNext())
            },
            style(){
                return {}
            },
        },
        21: {
            display(){return '奇点增幅[si21]<br>(数量: '+format(getBuyableAmount(this.layer, this.id), 0)+')<br><br>奇点基础效果提升<br><br>当前效果: ×'+format(this.effect())+'<br><br>价格: '+format(this.cost())+' 热能'},
            cost(x){
                let base = n(1e8).pow(x.mul(0.05).add(1)).pow(1.01)
                if(n(getBuyableAmount('si', 31)).gte(2)){
                    base = base.div(buyableEffect('si', 13))
                }
                return base
            },
            effect(x){
                let base = n(0.5).mul(x).pow(1.01).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            effecNext(x=n(getBuyableAmount(this.layer, this.id)).add(1)){
                let base = n(0.5).mul(x).pow(1.01).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            canAfford(){return player.si.thermalEnergy.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                if(n(getBuyableAmount('si', 31)).lt(4) || true){
                    player.si.thermalEnergy = player.si.thermalEnergy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            tooltip(){
                return format(this.effect())+' -> '+format(this.effecNext())
            },
            style(){
                return {}
            },
        },
        22: {
            display(){return '协同增幅[si22]<br>(数量: '+format(getBuyableAmount(this.layer, this.id), 0)+')<br><br>热能加成自身获取<br><br>当前效果: ×'+format(this.effect())+'<br><br>价格: '+format(this.cost())+' 热能'},
            cost(x){
                let base = n(1e9).mul(x.mul(5).add(1)).pow(n(1.05).add(x.mul(0.01)))
                if(n(getBuyableAmount('si', 31)).gte(2)){
                    base = base.div(buyableEffect('si', 13))
                }
                return base
            },
            effect(x){
                let base = n(player.si.thermalEnergy).max(1).log(10).mul(x).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            effecNext(x=n(getBuyableAmount(this.layer, this.id)).add(1)){
                let base = n(player.si.thermalEnergy).max(1).log(10).mul(x).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            canAfford(){return player.si.thermalEnergy.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                if(n(getBuyableAmount('si', 31)).lt(4) || true){
                    player.si.thermalEnergy = player.si.thermalEnergy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            tooltip(){
                return format(this.effect())+' -> '+format(this.effecNext())
            },
            style(){
                return {}
            },
        },
        23: {
            display(){return '热能增幅[si23]<br>(数量: '+format(getBuyableAmount(this.layer, this.id), 0)+')<br><br>指数提升热能效果<br><br>当前效果: ^'+format(this.effect())+'<br><br>价格: '+format(this.cost())+' 热能'},
            cost(x){
                return n(x).pow(x.mul(0.5)).add(1).mul(1e10)
            },
            effect(x){
                let base = n(0.15).mul(x).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                return base
            },
            effecNext(x=n(getBuyableAmount(this.layer, this.id)).add(1)){
                let base = n(0.15).mul(x).add(1)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                return base
            },
            canAfford(){return player.si.thermalEnergy.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                if(n(getBuyableAmount('si', 31)).lt(4) || true){
                    player.si.thermalEnergy = player.si.thermalEnergy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            tooltip(){
                return format(this.effect())+' -> '+format(this.effecNext())
            },
            style(){
                return {}
            },
        },
        24: {
            display(){return '速度增幅[si24]<br>(数量: '+format(getBuyableAmount(this.layer, this.id), 0)+')<br><br>提升第一行的效果底数<br><br>当前效果: +'+format(this.effect())+'<br><br>价格: '+format(this.cost())+' 热能'},
            cost(x){
                let base = n(1e14).pow(n(1.05).add(x.mul(0.01))).pow(n(1.05).add(x.mul(0.01)))
                if(n(getBuyableAmount('si', 31)).gte(2)){
                    base = base.div(buyableEffect('si', 13))
                }
                return base
            },
            effect(x){
                let base = n(0.05).mul(x)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            effecNext(x=n(getBuyableAmount(this.layer, this.id)).add(1)){
                let base = n(0.05).mul(x)
                if(n(getBuyableAmount('si', 31)).gte(1)){
                    base = base.mul(n(base).max(1).log(10).max(1))
                }
                if(n(getBuyableAmount('si', 31)).gte(3)){
                    base = base.mul(x.max(1).log(10).max(1))
                }
                return base
            },
            canAfford(){return player.si.thermalEnergy.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                if(n(getBuyableAmount('si', 31)).lt(4) || true){
                    player.si.thermalEnergy = player.si.thermalEnergy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            tooltip(){
                return format(this.effect())+' -> '+format(this.effecNext())
            },
            style(){
                return {}
            },
        },
        31: {
            display(){return '最终升级[si31]<br>(数量: '+format(getBuyableAmount(this.layer, this.id), 0)+')<br><br>'+tmp.si.buyables[31].effectText[getBuyableAmount(this.layer, this.id).add(1)]+'<br><br>价格: '+format(this.cost())+' 热能'},
            cost(x){
                return n(1e20).mul(n(1e10).pow(x))
            },
            effectText: {
                1(){return '前两行的效果对数提升自身'},
                2(){return '[si13]的效果同样对[si14],[si21],[si22],[si24]生效'},
                3(){return '[si11],[si12],[si14],[si21],[si22],[si24]的数量分别对数提升自身'},
                4(){return '无效果'},
                5(){return '无效果'},
                6(){return '自动购买前两行,购买前两行不消耗任何'},
            },
            tooltip(){
                let t = '当前已获得效果:'
                for(let i in tmp.si.buyables[31].effectText){
                    if(n(getBuyableAmount(this.layer, this.id)).gte(i)){
                        t += '<br>'+i+': '+tmp.si.buyables[31].effectText[i]
                    }else{
                        break
                    }
                }
                return t
            },
            canAfford(){return player.si.thermalEnergy.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                if(n(getBuyableAmount('si', 31)).lt(4) || true){
                    player.si.thermalEnergy = player.si.thermalEnergy.sub(this.cost())
                }
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                thermalEnergyReset(true)
            },
            style(){
                /*if(n(getBuyableAmount('si', 31)).eq(1)){
                    return {'color': 'darkorange', 'box-shadow': 'inset 0 0 30px 0 darkorange', 'border-color': 'darkorange', 'width': '1100px'}
                }*/
                return {'width': '1100px'}
            },
        },
    },
    clickables: {
        contracting: {
            onClick(){
                player.si.tempSpace = player.s.points
                player.si.contracting = true
            },
            canClick(){return player.s.points.gte(tmp.si.getNextAt) && !player.si.contracting && hasMilestone('s', 8)},
            tooltip(){
            },
            style(){
                return {'background': '#000', "border-radius": "100%", 'width': 'var(--volume)', 'height': 'var(--volume)', 'margin': 'var(--volumeMargin)'}
            },
        },
        infinity: {
            display(){
                return '你需要达到 <span class="singularity" style="font-size: 24px">'+format('1.79e308')+'</span> 复制品以达到复制品无限'
            },
            onClick(){
            },
            canClick(){return player.si.thermalEnergy.gte('1.79e308') && false},
            tooltip(){
            },
            style(){
                return {'background': '#fff0', 'color': 'white'}
            },
        },
    },
    milestones: {
        1: {
			requirementDescription(){return "第一奇点里程碑"},
            effectDescription(){return '奖励: 解锁热能(在奇点中),保留第四和第八体积里程碑<br>需求: 1 奇点'},
            req(){return n(1)},
            done(){return n(player.si.points).gte(this.req())},
        },
        2: {
			requirementDescription(){return "第二奇点里程碑"},
            effectDescription(){return '奖励: 保留第二和第三体积里程碑<br>需求: 3 奇点'},
            req(){return n(3)},
            done(){return n(player.si.points).gte(this.req())},
        },
        3: {
			requirementDescription(){return "第三奇点里程碑"},
            effectDescription(){return '奖励: 保留第一和第五体积里程碑<br>需求: 5 奇点'},
            req(){return n(5)},
            done(){return n(player.si.points).gte(this.req())},
        },
    },
    microtabs: {
        tab: {
            "singularity": {
                name(){return '奇点'},
                nameI18N(){return 'Singularity'},
                unlocked(){return player.si.points.gte(1) || hasMilestone('s', 8)},
                content:[
                    ["display-text", function(){return '你需要收缩 <span class="space">'+format(player.s.points)+' / '+format(tmp.si.getNextAt)+' 空间</span> 以形成奇点'}],
                    ["display-text", function(){return !hasMilestone('s', 8) ? '你需要第八体积里程碑才可以进行收缩' : ''}],
                    'blank',
                    ['clickable', 'contracting'],
                    'blank',
                    ["microtabs", "singularity"]
                ]
            },
            "thermalEnergy": {
                name(){return '热能'},
                nameI18N(){return 'ThermalEnergy'},
                unlocked(){return player.si.points.gte(1)},
                content:[
                    ["display-text", function(){return '你有 <span class="ThermalEnergy">'+format(player.si.thermalEnergy)+'</span> 热能'}],
                    ["display-text", function(){return '你的奇点每秒产生 <span class="ThermalEnergy" style="font-size: 24px">'+format(getThermalEnergyGen())+'</span> 的热能'}],
                    ["display-text", function(){return '你的最大热能使你的混乱时空产量<span class="ThermalEnergy" style="font-size: 24px"><mul>×</mul>'+format(getThermalEnergyEffect())+'</span>'}],
                    "blank",
                    ["microtabs", "thermalEnergy"]
                ]
            },
        },

        singularity: {
            "milestones": {
                name(){return '里程碑'},
                nameI18N(){return 'Milestones'},
                content:[
                    ["display-text", function(){return '你已达到了 <span class="space">'+format(player.si.milestones.length, 0)+'</span> 个奇点里程碑'}],
                    ["display-text", function(){return tmp.si.milestones[player.si.milestones.length+1]!==undefined ? '下个奇点里程碑需要 <span class="space">'+format(tmp.si.milestones[player.si.milestones.length+1].req, 0)+'</span> 奇点' : ''}],
                    'blank',
                    'blank',
                    ['milestone', 1],
                    ['milestone', 2],
                    ['milestone', 3],
                ]
            },
        },

        thermalEnergy: {
            "inform": {
                name(){return '信息'},
                nameI18N(){return 'Inform'},
                unlocked(){return true},
                content:[
                    ["display-text", function(){return '最大热量 <span class="ThermalEnergy" style="font-size: 24px">'+format(player.si.thermalEnergyBest)+'</span>'}],
                    ["display-text", function(){return '热能上限 <span class="ThermalEnergy" style="font-size: 24px">'+format(getThermalEnergyMax())+'</span>'}],
                    'blank',
                    ["display-text", function(){return '奇点基础效果 <span class="singularity" style="font-size: 24px">'+format(getSingularityBaseEffect())+'</span>'}],
                    ["display-text", function(){return '奇点总加成 <span class="singularity" style="font-size: 24px">'+format(getSingularityEffect())+'</span>'}],
                    'blank',
                    ["display-text", function(){return '热量基础生产 <span class="ThermalEnergy" style="font-size: 24px">'+format(getThermalEnergyOriginalGen())+'</span>'}],
                    ["display-text", function(){return '热量实际生产 <span class="ThermalEnergy" style="font-size: 24px">'+format(getThermalEnergyGen())+'</span>'}],
                ]
            },
            "main": {
                name(){return '主要'},
                nameI18N(){return 'Main'},
                unlocked(){return true},
                content:[
                    ["display-text", function(){return '你的热能上限为 <span class="ThermalEnergy" style="font-size: 24px">'+format(getThermalEnergyMax())+'</span>'}],
                    'blank',
                    ['row', [
                        ["buyable", 11],
                        ["buyable", 12],
                        ["buyable", 13],
                        ["buyable", 14],
                    ]],
                    ['row', [
                        ["buyable", 21],
                        ["buyable", 22],
                        ["buyable", 23],
                        ["buyable", 24],
                    ]],
                    ['row', [
                        ["buyable", 31],
                        ["buyable", 32],
                        ["buyable", 33],
                        ["buyable", 34],
                    ]],
                ]
            },
            "infinity": {
                name(){return '无限'},
                nameI18N(){return 'Infinity'},
                unlocked(){return false},
                content:[                  
                    'blank',
                    ['clickable', 'infinity'],
                    ["display-text", function(){return '已达残局'}],
                ]
            },
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       ["display-text", function(){return '你拥有 <span class="singularity">'+format(player.si.points, 0)+'</span> 奇点'+(player.si.points.gte(1) ? ', 你的奇点使你每真实秒获得 <span class="ThermalEnergy" style="font-size: 24px">'+format(getSingularityEffect())+'</span> 热能' : '')}],
       'blank',
       "blank",
       ["microtabs","tab"]
    ],
    componentStyles: {
        buyable: {
            "background-color": "#000",
        },
    },
    layerShown(){return hasMilestone('s', 8) || player.si.points.gte(1)},
})