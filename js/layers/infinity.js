addLayer("inf", {
    name: "infinity",
    symbol: "无限",
    symbolI18N: "Infinity",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#ff9800",
    nodeStyle(){
        if(!player.inf.unlocked){
            return {}
        }
    },
    symbol(){
        if(player.inf.unlocked){
            return '无限'
        }
        return '无限 <span style="font-size: 11px">解锁于1.797e308时空悖论</span>'
    },
    type: "none",
    row: 4, // Row the layer is in on the tree (0 is the first row)
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
    layerShown(){return hasMilestone('si', 1)},
})