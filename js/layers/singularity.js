function getReplicantiSpeed(){
    return n(2).pow(player.si.points)
}

function getReplicantiEffect(){
    return player.si.replicanti.max(1).log(10).pow(1.1).add(1)
}

function getReplicantiMax(){
    return n('1.79e308')
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
        replicanti: n(1),

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
        return n(308).mul(player.si.points.add(1))
    },
    row: 3, // Row the layer is in on the tree (0 is the first row)
    update(diff){
        player.si.replicanti = player.si.replicanti.mul(n(getReplicantiSpeed()).pow(diff)).min(getReplicantiMax()).max(1)

        if(hasMilestone('si', 2)){
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
                doReset('si', true)
                player.s.normalUpgrades = []
                player.s.upgradesBought = []
            }
        }else{
            document.body.style.setProperty('--volume', '300px');
            document.body.style.setProperty('--volumeMargin', '0px');
        }
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
            canClick(){return player.si.replicanti.gte('1.79e308') && false},
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
            effectDescription(){return '奖励: 保留第四和第八体积里程碑<br>需求: 1 奇点'},
            req(){return n(1)},
            done(){return n(player.si.points).gte(this.req())},
        },
        2: {
			requirementDescription(){return "第二奇点里程碑"},
            effectDescription(){return '奖励: 基于奇点数量,每秒获得额外体积(+0.01/rs)<br>需求: 2 奇点'},
            req(){return n(2)},
            done(){return n(player.si.points).gte(this.req())},
            effect(){
                return n(0.01)
            },
        },
    },
    microtabs: {
        tab: {
            "singularity": {
                name(){return '奇点'},
                nameI18N(){return 'Singularity'},
                unlocked(){return player.si.points.gte(1) || hasMilestone('s', 8)},
                content:[
                    ["display-text", function(){return '你需要收缩 <span class="space">'+format(player.s.points, 0)+' / '+format(tmp.si.getNextAt, 0)+' 空间</span> 以形成奇点'}],
                    ["display-text", function(){return !hasMilestone('s', 8) ? '你需要第八体积里程碑才可以进行收缩' : ''}],
                    'blank',
                    ['clickable', 'contracting'],
                    'blank',
                    ["microtabs", "singularity"]
                ]
            },
            "replicanti": {
                name(){return '复制品'},
                nameI18N(){return 'Replicanti'},
                unlocked(){return player.si.points.gte(1)},
                content:[
                    ["display-text", function(){return '你有 <span class="singularity">'+format(player.si.replicanti)+'</span> 复制品'}],
                    ["display-text", function(){return '你的奇点使你的复制品每现实秒<span class="singularity" style="font-size: 24px">×'+format(getReplicantiSpeed())+'</span> '}],
                    ["display-text", function(){return '你的复制品使时空悖论产量<span class="singularity" style="font-size: 24px">×'+format(getReplicantiEffect())+'</span>'}],
                    "blank",
                    ["microtabs", "replicanti"]
                ]
            },
        },

        singularity: {
            "milestones": {
                name(){return '里程碑'},
                nameI18N(){return 'Milestones'},
                content:[
                    ["display-text", function(){return '你已达到了 <span class="space">'+format(player.si.milestones.length, 0)+'</span> 个奇点里程碑'}],
                    ["display-text", function(){return tmp.si.milestones[player.si.milestones.length+1]!==undefined ? '下个奇点里程碑需要 <span class="space">'+format(tmp.s.milestones[player.s.milestones.length+1].req, 0)+'</span> 奇点' : ''}],
                    'blank',
                    'blank',
                    ['milestone', 1],
                    ['milestone', 2],
                ]
            },
        },

        replicanti: {
            "inform": {
                name(){return '信息'},
                nameI18N(){return 'Inform'},
                unlocked(){return true},
                content:[
                    ["display-text", function(){return '你的复制品上限为 <span class="singularity" style="font-size: 24px">'+format(getReplicantiMax())+'</span>'}],
                ]
            },
            "infinity": {
                name(){return '无限'},
                nameI18N(){return 'Infinity'},
                unlocked(){return true},
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
       ["display-text", function(){return '你拥有 <span class="singularity">'+format(player.si.points, 0)+'</span> 奇点, 你的奇点使你的复制品每现实秒<span class="singularity" style="font-size: 24px">×'+format(getReplicantiSpeed())+'</span> '}],
       'blank',
       "blank",
       ["microtabs","tab"]
    ],
    componentStyles: {
        buyable: {
            width: "30px",
            height: "30px",
            "border-radius": "0%",
            "z-index": "1",
            "font-size": '16px',
        },
    },
    layerShown(){return hasMilestone('s', 8) || player.si.points.gte(1)},
})