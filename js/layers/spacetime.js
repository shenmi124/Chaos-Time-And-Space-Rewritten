function Dim1Unlocked(){
    return true
}

function Dim1Extra(){
    let base = n(0)
    if(hasUpgrade('s', 12)){base = base.add(upgradeEffect('s', 12))}
    if(player.s.green && player.s.blue){
        base = base.add(tmp.s.getCyanEffect)
    }
    return base
}

function Dim1MultExtra(){
    let base = n(0)
    if(hasUpgrade('s', 42)){
        base = n(upgradeEffect('s', 42))
    }
    return base
}

function Dim1CanMult(){
    let canMult = false
    if(hasUpgrade('s', 42)){
        canMult = true
    }
    if(player.st.SpaceTime1Dim.add(Dim1Extra()).gte(player.st.SpaceTime1Dim.mul(Dim1MultExtra()))){
        canMult = false
    }
    return canMult
}

function Dim1Base(){
    let base = player.st.SpaceTime1Dim
    if(Dim1CanMult()){
        base = base.mul(Dim1MultExtra())
    }else{
        base = base.add(Dim1Extra())
    }
    return base
}

function Dim1BaseProduction(){
    let base = Dim1Base()
    let mul = n(1)
	if(hasUpgrade('s', 13)){mul = mul.mul(upgradeEffect('s', 13))}
    if(hasUpgrade('s', 14)){mul = mul.mul(upgradeEffect('s', 14))}
    return n(base).mul(mul)
}

function Dim1Mul(){
    let base = n(1)
    if(hasUpgrade('s', 22)){base = base.add(upgradeEffect('s', 22))}
    base = base.mul(player.st.SpaceTime2Dim.mul(Dim2Mul()).max(1))
    return base
}

function Dim1Cost(){
    let id = 1
	let base = player.st['SpaceTime'+id+'Dim'].add(1).mul(n(10).pow(id-1)).pow(n(id).div(20).add(1))
	let pow = n(2).pow(id)

    let baseCost = base
    let basePow = pow
	return baseCost.pow(basePow)
}

function Dim1Production(){
    return n(Dim1BaseProduction()).mul(Dim1Mul())
}

function Dim1Gen(){
    let gain = n(0)
    if(hasUpgrade('s', 32) && !(player.st.SpaceTime2DimGen && Dim2Unlocked())){
        gain = gain.add(upgradeEffect('s', 32))
    }
    gain = gain.add(player.st.SpaceTime2Dim)
    gain = gain.mul(getTimeSpeed())
    return gain
}

function Dim2Unlocked(){
    return hasMilestone('si', 4)
}

function Dim2Extra(){
    let base = n(0)
    return base
}

function Dim2MultExtra(){
    let base = n(0)
    return base
}

function Dim2CanMult(){
    let canMult = false
    if(false){
        canMult = true
    }
    if(player.st.SpaceTime2Dim.add(Dim2Extra()).gte(player.st.SpaceTime2Dim.mul(Dim2MultExtra()))){
        canMult = false
    }
    return canMult
}

function Dim2Base(){
    let base = player.st.SpaceTime2Dim
    if(Dim2CanMult()){
        base = base.mul(Dim2MultExtra())
    }else{
        base = base.add(Dim2Extra())
    }
    return base
}

function Dim2BaseProduction(){
    let base = Dim2Base()
    let mul = n(1)
    return n(base).mul(mul)
}

function Dim2Mul(){
    let base = n(1)
    return base
}

function Dim2Production(){
    return n(Dim2BaseProduction()).mul(Dim2Mul())
}

function Dim2Gen(){
    let gain = n(0)
    if(hasUpgrade('s', 32) && (player.st.SpaceTime2DimGen && Dim2Unlocked())){
        gain = gain.add(upgradeEffect('s', 32))
    }
    gain = gain.mul(getTimeSpeed())
    return gain
}

addLayer("st", {
    name: "spacetime",
    symbol: "时空",
    symbolI18N: "Space Time",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        SpaceTime1Dim: n(0),
        SpaceTime2Dim: n(0),

        SpaceTime2DimGen: true,
    }},
    color: "#97f1ee",
    type: "none",
    row: 1, // Row the layer is in on the tree (0 is the first row)
    nodeStyle: {"background": "linear-gradient(90deg, #97f1ee 0%, #fff 50%, #97f1ee 100%)"},
    update(diff){
        player.st.SpaceTime1Dim = player.st.SpaceTime1Dim.add(n(Dim1Gen()).mul(diff))
        player.st.SpaceTime2Dim = player.st.SpaceTime2Dim.add(n(Dim2Gen()).mul(diff))

        if(window.innerWidth>=1200){
            document.body.style.setProperty('--dimTableWidth', '150px')
            document.body.style.setProperty('--dimTableFont', '20px')
        }else{
            document.body.style.setProperty('--dimTableWidth', '100px')
            document.body.style.setProperty('--dimTableFont', '15px')
        }
    },
    buyables: {
        1: {
            display(){return '+'},
            cost(){return Dim1Cost()},
            canAfford(){return player.points.gte(layers[this.layer].buyables[this.id].cost()) && !player.s.inVolumeChallenge},
            buy(){
                player.points = player.points.sub(this.cost())
                player.st.SpaceTime1Dim = player.st.SpaceTime1Dim.add(1)
            },
            tooltip(){
                return '消耗: '+format(Dim1Cost())+'时空悖论<br>*点击或长按购买一维时空*'
            },
            style(){
                if(this.canAfford()){
                    return {"background-color":"#fff"}
                }
                return {}
            },
        },
    },
    clickables: {
        2: {
            display(){return player.st.SpaceTime2DimGen ? 'ON' : 'OFF'},
            cost(){return Dim1Cost()},
            canClick(){return true},
            unlocked(){return Dim2Unlocked()},
            onClick(){
                player.st.SpaceTime2DimGen = !player.st.SpaceTime2DimGen
            },
            tooltip(){
                return '点击切换状态<br>当前状态: '+(player.st.SpaceTime2DimGen ? '启用' : '未启用')+'<br><br>启用时,[s32]将生产二维时空'
            },
            style(){
                if(this.canClick()){
                    return {"background-color":"#fff"}
                }
                return {}
            },
        }
    },
    microtabs: {
        tab: {
            "main": {
                name(){return '时空'},
                nameI18N(){return 'main'},
                content:[
                    ['row', [
                        ["display-text", function(){return '<div class="dimTable"> </div>'}],
                        ["display-text", function(){return '<div class="dimTable">数量</div>'}],
                        ["display-text", function(){return '<div class="dimTable">额外</div>'}],
                        ["display-text", function(){return '<div class="dimTable">生产</div>'}],
                        ["display-text", function(){return '<div class="dimTable">倍率</div>'}],
                        ["display-text", function(){return '<div style="width: 34px" class="dimTable"> </div>'}],
                    ]],
                    "blank",
                    ['row', [
                        ["display-text", function(){return '<div class="dimTable">一维时空</div>'}],
                        ["display-text", function(){return '<div class="dimTable">'+format(player.st.SpaceTime1Dim)+'</div>'}],
                        ["display-text", function(){return '<div class="dimTable">'+(Dim1CanMult() ? '×'+format(Dim1MultExtra()) : format(Dim1Extra()))+'</div>'}],
                        ["display-text", function(){return '<div class="dimTable">'+format(Dim1BaseProduction())+'</div>'}],
                        ["display-text", function(){return '<div class="dimTable">'+format(Dim1Mul())+'</div>'}],
                        ["buyable", 1]
                    ]],
                    "blank",
                    ['row', [
                        ["display-text", function(){
                            if(!Dim2Unlocked()){
                                return ''
                            }
                            return '<div class="dimTable">二维时空</div>'
                        }],
                        ["display-text", function(){
                            if(!Dim2Unlocked()){
                                return ''
                            }
                            return '<div class="dimTable">'+format(player.st.SpaceTime2Dim)+'</div>'
                        }],
                        ["display-text", function(){
                            if(!Dim2Unlocked()){
                                return ''
                            }
                            return '<div class="dimTable">'+(Dim2CanMult() ? '×'+format(Dim2MultExtra()) : format(Dim2Extra()))+'</div>'
                        }],
                        ["display-text", function(){
                            if(!Dim2Unlocked()){
                                return ''
                            }
                            return '<div class="dimTable">'+format(Dim2BaseProduction())+'</div>'
                        }],
                        ["display-text", function(){
                            if(!Dim2Unlocked()){
                                return ''
                            }
                            return '<div class="dimTable">'+format(Dim2Mul())+'</div>'
                        }],
                        ["clickable", 2]
                    ]],
                    "blank",
                    "blank",
                    ["display-text", function(){return '一维时空'+(n(Dim1Gen().neq()) ? '(+'+format(Dim1Gen())+'/s)' : '')+'每秒会生产(1×自身倍率)时空悖论'}],
                    ["display-text", function(){return '(+'+format(Dim1Production())+'/rs)'}],
                    "blank",
                    ["display-text", function(){
                        if(!Dim2Unlocked()){
                            return ''
                        }
                        return '二维时空'+(n(Dim2Gen().neq()) ? '(+'+format(Dim2Gen())+'/s)' : '')+'每秒会生产(1×自身倍率)一维时空'
                    }],
                    ["display-text", function(){
                        if(!Dim2Unlocked()){
                            return ''
                        }
                        return '(+'+format(Dim2Production())+'/rs)'
                    }],
                    ["display-text", function(){
                        if(!Dim2Unlocked()){
                            return ''
                        }
                        return '二维时空提升(1×自身倍率)的一维时空倍率'
                    }],
                ],
            }
        },
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
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
        clickable: {
            width: "30px",
            height: "30px",
            "border-radius": "0%",
            "z-index": "1",
            "font-size": '14px',
        },
    },
    layerShown(){return hasUpgrade('s', 11)},
})