function Dim1Extra(){
    let base = n(0)
    if(hasUpgrade('s', 12)){base = base.add(upgradeEffect('s', 12))}
    return base
}

function Dim1BaseGain(){
    let mul = n(1)
	if(hasUpgrade('s', 13)){
		mul = mul.mul(upgradeEffect('s', 13))
	}
    return player.st.SpaceTime1Dim.add(Dim1Extra()).mul(mul)
}

function Dim1Mul(){
    let base = n(1)
    if(hasUpgrade('s', 22)){base = base.add(upgradeEffect('s', 22))}
    return base
}

function Dim1Cost(){
    let id = 1
	let base = player.st['SpaceTime'+id+'Dim'].add(1).mul(Decimal.add(10).pow(id-1)).pow(n(id).div(20).add(1))
	let pow = n(2).pow(id)

    let baseCost = base
    let basePow = pow
	return baseCost.pow(basePow)
}

function Dim1Gain(){
    return n(Dim1BaseGain()).mul(Dim1Mul())
}

addLayer("st", {
    name: "spacetime",
    symbol: "时空",
    symbolI18N: "Prestige",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
        SpaceTime1Dim: n(0),
    }},
    color: "#97f1ee",
    type: "none",
    row: 1, // Row the layer is in on the tree (0 is the first row)
    nodeStyle: {"background": "linear-gradient(90deg, #97f1ee 0%, #fff 50%, #97f1ee 100%)"},
    update(diff){
        let gain = n(0)
        if(hasUpgrade('s', 32)){
            gain = gain.add(upgradeEffect('s', 32))
        }
        gain = gain.mul(getTimeSpeed())
        player.st.SpaceTime1Dim = player.st.SpaceTime1Dim.add(n(gain).mul(diff))
    },
    buyables: {
        1: {
            display(){return '+'},
            cost(){return Dim1Cost()},
            canAfford(){return player.points.gte(layers[this.layer].buyables[this.id].cost())},
            buy(){
                player.points = player.points.sub(this.cost())
                player.st.SpaceTime1Dim = player.st.SpaceTime1Dim.add(1)
            },
            style(){
                if(this.canAfford()){
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
                        ["display-text", function(){return '<div class="dimTable">消耗</div>'}],
                        ["display-text", function(){return '<div style="width: 34px" class="dimTable"> </div>'}],
                    ]],
                    "blank",
                    ['row', [
                        ["display-text", function(){return '<div class="dimTable">扭曲时空</div>'}],
                        ["display-text", function(){return '<div class="dimTable">'+format(player.st.SpaceTime1Dim)+'</div>'}],
                        ["display-text", function(){return '<div class="dimTable">'+format(Dim1Extra())+'</div>'}],
                        ["display-text", function(){return '<div class="dimTable">'+format(Dim1BaseGain())+'</div>'}],
                        ["display-text", function(){return '<div class="dimTable">'+format(Dim1Mul())+'</div>'}],
                        ["display-text", function(){return '<div class="dimTable">'+format(Dim1Cost())+'</div>'}],
                        ["buyable", 1]
                    ]],
                    "blank",
                    "blank",
                    ["display-text", function(){return '扭曲时空每秒会生产(1×自身倍率)时空悖论<br>(+'+format(Dim1Gain())+'/rs)'}],
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
    },
    layerShown(){return hasUpgrade('s', 11)},
})