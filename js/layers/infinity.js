addLayer("inf", {
    name: "infinity",
    symbol: "无限",
    symbolI18N: "Infinity",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#fff",
    nodeStyle(){
        if(!player.p.unlocked){
            return {}
        }
        return {"background": "linear-gradient(90deg, #fff 0%, #fff 25%, #fff 75%, #fff 100%)"}
    },
    symbol(){
        if(player.inf.unlocked){
            return '无限'
        }
        return '无限 <span style="font-size: 11px">解锁于'+format(player.points)+' / 1.797e308</span>'
    },
    type: "none",
    row: 3, // Row the layer is in on the tree (0 is the first row)
    update(diff){
        if(player.points.gte('1.797e308')){
            player.inf.unlocked = true
        }
    },
    microtabs: {
        tab: {
            "main": {
                name(){return '无限'},
                nameI18N(){return 'main'},
                content:[
                    ["display-text", function(){return '已达残局'}],
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
    layerShown(){return hasMilestone('s', 8) && false},
})