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
    //<svg style="transform: scale(1.3) rotate(-25deg)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="currentColor" d="M278.535 276.134q18.47 32.88 42.854 49.503q24.75 16.255 55.782 16.255q37.311 0 60.955-24.752q23.643-25.12 23.644-63.91q0-37.313-21.795-62.064q-21.798-24.751-54.676-24.752q-29.925 0-54.306 24.752q-24.014 24.382-52.46 84.968m-45.07-39.53q-18.101-32.508-42.853-48.763q-24.381-16.253-55.782-16.254q-37.312 0-60.955 24.752Q50.229 220.72 50.23 259.51q0 37.312 21.795 62.063t54.676 24.752q29.924 0 53.937-24.382q24.381-24.382 52.828-85.338m26.23 67.605q-26.23 50.242-55.045 73.516Q176.203 401 141.108 401q-49.872 0-84.598-41.376q-34.357-41.376-34.357-102.33q0-64.65 30.662-104.55q31.032-39.896 80.535-39.897q35.094 0 62.803 22.905q27.705 22.535 55.414 74.624q25.121-50.98 54.306-74.994Q335.058 111 370.893 111q49.13 0 83.86 41.745q35.093 41.745 35.094 103.07q0 64.28-31.032 104.18q-30.663 39.526-80.165 39.527q-35.098 0-62.433-21.426q-26.97-21.796-56.523-73.886z"></path></svg>
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