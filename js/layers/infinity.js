addLayer("inf", {
    name: "infinity",
    symbol: "无限",
    symbolI18N: "Infinity",
    position: 0,
    startData() { return {
        unlocked: false,
		points: new Decimal(0),

        tryBreak: false,
        tryBreakTime: n(0),
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
        return '无限 <span style="font-size: 11px">解锁于1.797e308点</span>'
    },
    //<svg style="transform: scale(1.3) rotate(-25deg)" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="currentColor" d="M278.535 276.134q18.47 32.88 42.854 49.503q24.75 16.255 55.782 16.255q37.311 0 60.955-24.752q23.643-25.12 23.644-63.91q0-37.313-21.795-62.064q-21.798-24.751-54.676-24.752q-29.925 0-54.306 24.752q-24.014 24.382-52.46 84.968m-45.07-39.53q-18.101-32.508-42.853-48.763q-24.381-16.253-55.782-16.254q-37.312 0-60.955 24.752Q50.229 220.72 50.23 259.51q0 37.312 21.795 62.063t54.676 24.752q29.924 0 53.937-24.382q24.381-24.382 52.828-85.338m26.23 67.605q-26.23 50.242-55.045 73.516Q176.203 401 141.108 401q-49.872 0-84.598-41.376q-34.357-41.376-34.357-102.33q0-64.65 30.662-104.55q31.032-39.896 80.535-39.897q35.094 0 62.803 22.905q27.705 22.535 55.414 74.624q25.121-50.98 54.306-74.994Q335.058 111 370.893 111q49.13 0 83.86 41.745q35.093 41.745 35.094 103.07q0 64.28-31.032 104.18q-30.663 39.526-80.165 39.527q-35.098 0-62.433-21.426q-26.97-21.796-56.523-73.886z"></path></svg>
    type: "none",
    row: 4, // Row the layer is in on the tree (0 is the first row)
    update(diff){
        if(player.points.gte('1.797e308')){
            player.inf.unlocked = true
        }
        
        if(player.inf.tryBreak){
            player.inf.tryBreakTime = player.inf.tryBreakTime.add(n(1).mul(diff)).min(20)

            document.body.style.setProperty('--shakeX', Math.random()*2-1+'px')
            document.body.style.setProperty('--shakeY', Math.random()*2-1+'px')
        }
    },
    clickables: {
        breakInfinity: {
            display(){return '打破无限!'},
            onClick(){
                player.inf.tryBreak = true
            },
            canClick(){return true},
            unlocked(){return !player.inf.tryBreak},
        },
    },
    microtabs: {
        tab: {
            "main": {
                name(){
                    if(player.inf.tryBreakTime.eq(20)){
                        return '发觉无限'
                    }
                    return '打破无限'
                },
                nameI18N(){return 'Break Infinity'},
                content:[
                    ['clickable', 'breakInfinity'],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(0.5)){
                            return '<div class="infText"><div class="shake">STOP!</div></div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(1)){
                            return '<div class="infText">等等</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(2)){
                            return '<div class="infText">新面孔?</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(3)){
                            return '<div class="infText">...</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(4)){
                            return '<div class="infText">咳</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(5)){
                            return '<div class="infText">所以,先自我介绍一下吧,我是<div class="shake" style="color: #ff9800">无限</div></div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(8)){
                            return '<div class="infText">...</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(9)){
                            return '<div class="infText">所以,你应该意识到了吧</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(11)){
                            return '<div class="infText">...</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(13)){
                            return '<div class="infText"><div class="shake">无限</div>往后的内容不是你能够理解的</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(15)){
                            return '<div class="infText">如果按<div class="shake">*你们*</div>的话来说</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(17)){
                            return '<div class="infText">没有任何数字比无限大,这一切将变的毫无意义</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(18)){
                            return '<div style="color: grey">况且,这只是个数字...</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(19)){
                            return '<div class="infText">不过嘛</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(20)){
                            return '<div class="infText">我有个好办法...</div>'
                        }
                    }],
                    ["display-text", function(){
                        if(player.inf.tryBreakTime.gte(20)){
                            return '<br>[已解锁页面特权(在无限中)]'
                        }
                    }],
                ],
            },
            "privilege": {
                name(){return '特权'},
                content:[
                    "blank",
                    ["microtabs","privilege"]
                ],
            }
        },
        privilege: {
            'milestones': {
                name(){return '里程'},
                content:[
                ],
            },
            'allocation': {
                name(){return '调配'},
                content:[
                ],
            },
        }
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