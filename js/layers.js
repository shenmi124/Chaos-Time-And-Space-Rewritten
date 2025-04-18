addLayer("storylayer", {
    name: "storylayer",
    position: -3,
    row: 0,
    symbol() {return '次要页面'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return 'Story'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return true},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})

addLayer("storybook", {
    name: "storybook",
    position: -2,
    row: 0,
    symbol() {return '笔记'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return 'Story'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: false,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"max-width": "100%"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
	doReset(resettingLayer){
        return false
	},
    type: "none",
    tooltip(){return false},
    layerShown(){return true},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
    achievements: {
        11: {
            name: "空间",
            done(){return player.s.points.gte(1)},
            tooltip: "如果没有空间那么一切都是没有意义的...<br><br><i>给我空间时间及对数,我可以创造一个宇宙</i>",
            unlocked(){return true},
        },
        12: {
            name: "点",
            done(){return player.st.SpaceTime1Dim.gte(1)},
            tooltip: "真正的开始,从这些没有维度的点开始直到...<i>直到...</i>",
            unlocked(){return hasAchievement(this.layer, 11)},
        },
        13: {
            name: "扭曲",
            done(){return player.s.warp.gt(0)},
            tooltip: "空间并不规整<br>扭曲它能更好的塑造这个刚诞生的空间",
            unlocked(){return hasAchievement(this.layer, 12)},
        },
        14: {
            name: "线",
            done(){return hasUpgrade('s', 31)},
            tooltip: "光线是用来表示光的传播路径和方向的直线<br><br><i>一根一根弦,两点间的线</i>",
            unlocked(){return hasAchievement(this.layer, 13)},
        },
        15: {
            name: "体积",
            done(){return n(getVolume()).gte(2)},
            tooltip: "构筑三维空间<br><br><i>美包含在体积和秩序中</i>",
            unlocked(){return hasAchievement(this.layer, 14)},
        },
        21: {
            name: "光谱",
            done(){return n(getVolume()).gte(4)},
            tooltip: "频率叠加",
            unlocked(){return hasAchievement(this.layer, 15)},
        },
        22: {
            name: "升维",
            done(){return n(getVolume()).gte(12)},
            tooltip: "站在更高维度审视空间",
            unlocked(){return hasAchievement(this.layer, 21)},
        },
    },
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
        ["display-text", function(){return '距离残局: '+format(player[this.layer].achievements.length, 0)+' / 21'}],
        'blank',
        ["display-text", function(){return '<h3>———————————————— 第 零 章 ————————————————</h3>'}],
        'blank',
        ['row', [
            ['achievement', 11], ['achievement', 12], ['achievement', 13], ['achievement', 14], ['achievement', 15]
        ]],
        ['row', [
            ['achievement', 21], ['achievement', 22], ['achievement', 23], ['achievement', 24], ['achievement', 25]
        ]],
    ],
})

addLayer("sidelayer", {
    name: "Sidelayer",
    position: -999,
    row: 0,
    symbol() {return '其他页面'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return 'Side'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return true},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})

addLayer("Setting", {
    name: "Setting",
    position: -998,
    row: 0,
    symbol() {return i18n('设置', 'Setting')},
    symbolI18N() {return i18n('设置', 'Setting')},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(230, 230, 236)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("Information", {
    name: "Information",
    position: -997,
    row: 0,
    symbol() {return i18n('信息', 'Information')},
    symbolI18N() {return i18n('信息', 'Information')},
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "rgb(230, 230, 236)",
    type: "none",
    tooltip(){return false},
    tabFormat: [
        ["display-text", function() { return getPointsDisplay() }],
    ],
})

addLayer("help", {
    name: "Help",
    symbol: "帮助",
    symbolI18N: "help",
    position: -996,
    row: 0,
    startData() { return {
        unlocked: true,
		points: n(0),
    }},
    color: "rgb(230, 230, 236)",
    type: "none",
    microtabs: {
        Tab: {
            "Other": {
                name(){return '其他'},
                nameI18N(){return 'Other'},
                content:[
                    ["display-text", function(){return '杂七杂八的事项'}],
                    "blank",
                    ["microtabs", "Other"],
                ],
            },
            "Main": {
                name(){return '主体'},
                nameI18N(){return 'Main'},
                content:[
                    ["display-text", function(){return '关于整个游戏和其出现的特殊名词的解释'}],
                    "blank",
                    ["microtabs", "Main"],
                ],
            },
            "Space Time": {
                name(){return '时空'},
                nameI18N(){return 'Space Time'},
                unlocked(){return layerDisplay('st')},
                content:[
                    ["display-text", function(){return '关于时空层的一切'}],
                    "blank",
                    ["microtabs", "SpaceTime"],
                ],
            },
            "Space": {
                name(){return '空间'},
                nameI18N(){return 'Space'},
                unlocked(){return layerDisplay('s')},
                content:[
                    ["display-text", function(){return '关于空间层的一切'}],
                    "blank",
                    ["microtabs", "Space"],
                ],
            },
        },
        Other: {
            "About": {
                name(){return '关于'},
                nameI18N(){return 'About'},
                content:[
                    ["display-text", function(){return '帮助页面会对游戏中的每个机制进行解释,并随着游戏的进度而更新'}],
                    ["display-text", function(){return '如果遇到了让你疑惑的机制或者词汇时你可以在这个页面获取帮助'}],
                    ["display-text", function(){return '<br>'}],
                    ["display-text", function(){return '值得一提的是,帮助页面并不会提供游戏上的攻略'}],
                    ["display-text", function(){return '<br>'}],
                    ["display-text", function(){return '<red>此外,帮助并未完善</red>'}],
                    ["display-text", function(){return '<br>'}],
                    ["display-text", function(){return '官方QQ群:<a class="link" href="https://qm.qq.com/q/axo4Pc8xvG" target="_blank">688646311</a>'}],
                ],
            },
            "Formula": {
                name(){return '公式'},
                nameI18N(){return 'Formula'},
                content:[
                    ["display-text", function(){return '你可能注意到了,游戏中的许多的资源,升级,消耗等都会给出公式'}],
                    ["display-text", function(){return '这些公式为对应的基础公式,不过不用担心,这些公式并不会影响你去理解对应的效果,所以你无需理解这些公式仍然可以正常进行游戏'}],
                    ["display-text", function(){return '<br>'}],
                    ["display-text", function(){return '如果你还是不能理解,还有个简单的办法'}],
                    ["display-text", function(){return '通常来说,f(x)的结果就是其原始效果'}],
                    ["display-text", function(){return '<br>'}],
                    ["display-text", function(){return '你可能还注意到了<s>(也可能没有)</s>,有时公式是不成立或者无意义的'}],
                    ["display-text", function(){return '这是因为公式的主要用处在于告知玩家其效果计算方式,所以显示的公式中省去了一些不必要的计算'}],
                    ["display-text", function(){return '(如: log前最小值恒为1, 部分涉及到乘法或者除法的公式永远不可能为0)'}],
                ],
            },
        },
        Main: {
            "Resource": {
                name(){return '资源'},
                nameI18N(){return 'Resource'},
                content:[
                    ["display-text", function(){return '以下页面解释了主页中的资源的含义'}],
                    "blank",
                    ["microtabs", "Resource"],
                ],
            },
            "Special": {
                name(){return '特殊'},
                nameI18N(){return 'Special'},
                content:[
                    ["display-text", function(){return '以下页面解释了游戏中出现的一些特殊的词汇'}],
                    "blank",
                    ["microtabs", "Special"],
                ],
            },
        },
        SpaceTime: {
            "Space Time": {
                name(){return '时空'},
                nameI18N(){return 'Space Time'},
                content:[
                    ["display-text", function(){return '关于时空层中时空页面'}],
                    "blank",
                    ["microtabs", "SpaceTime2"],
                ],
            },
        },
        Space: {
            "Other": {
                name(){return '其他'},
                nameI18N(){return 'Other'},
                content:[
                    ["display-text", function(){return '杂七杂八的事项'}],
                ],
            },
        },

        Resource: {
            "Points": {
                name(){return '点'},
                nameI18N(){return 'Points'},
                content:[
                    ["display-text", function(){return '点'}],
                ],
            },
            "TimeSpeed": {
                name(){return '时间速率'},
                nameI18N(){return 'TimeSpeed'},
                content:[
                    ["display-text", function(){return '除非特殊声明,否则时间速率会等比加成所有和"每秒获取"有关的资源获取速度'}],
                    ["display-text", function(){return '除非特殊声明,否则此加成永远在公式最后生效'}],
                ],
            },
        },
        Special: {
            "Real Second": {
                name(){return '真实秒产量'},
                nameI18N(){return 'Real Second'},
                content:[
                    ["display-text", function(){return '真实秒产量,简称rs'}],
                    ["display-text", function(){return '真实秒产量指的是在时间速率加成之前的资源秒产量'}],
                    ["display-text", function(){return '而秒产量(/s)指的是在时间速率加成之后的资源秒产量'}],
                ],
            },
            "Original Gain": {
                name(){return '原始产量'},
                nameI18N(){return 'Original Gain'},
                content:[
                    ["display-text", function(){return '原始产量指的是在时间速率加成之前的产量,同真实秒产量'}],
                ],
            },
            "Extra": {
                name(){return '额外'},
                nameI18N(){return 'Extra'},
                content:[
                    ["display-text", function(){return '额外资源会提供额外的资源'}],
                    ["display-text", function(){return '这些资源会参与关于数量的计算,但并不会影响你实际资源的数量'}],
                    ["display-text", function(){return '<br>'}],
                    ["display-text", function(){return '(例:某加成基于A资源的数量提升,这里的参与计算的A的数量实际上是A经过额外资源数量计算后的最终数量)'}],
                    ["display-text", function(){return '(提示:在大多数时候你可以将额外资源看成额外的正常资源,但不会影响机制解锁和价格公式)'}],
                ],
            },
        },

        SpaceTime2: {
            "Warp Space Time": {
                name(){return '一维时空'},
                nameI18N(){return 'Warp Space Time'},
                unlocked(){return Dim1Unlocked()},
                content:[
                    ["display-text", function(){return '一维时空会生产点'}],
                    ["display-text", function(){return '<br>'}],
                    ["display-text", function(){return '通常情况下:'}],
                    ["display-text", function(){return '一维时空的总体数量为(数量+额外)'}],
                    ["display-text", function(){return '一维时空的基础生产为一维时空的总体数量'}],
                    ["display-text", function(){return '一维时空的基础真实产量为基础产量×倍率'}],
                    ["display-text", function(){return '<br>'}],
                    ["display-text", function(){return '通常情况下:'}],
                    ["display-text", function(){return '一维时空的价格公式为'}],
                    ["display-text", function(){return '(((一维时空购买数量+1)×10<sup>ID-1</sup>)<sup>ID÷20+1</sup>)<sup>2<sup>ID</sup></sup>'}],
                    ["display-text", function(){return '对于一维时空,其ID为1'}],
                ],
            },
        },

        Space: {
            "Base": {
                name(){return '基层'},
                nameI18N(){return 'Base'},
                content:[
                    ["display-text", function(){return '你的最大空间数量将会提供空间用于购买基层中的升级'}],
                ],
            },
            "Warp": {
                name(){return '扭曲'},
                nameI18N(){return 'Warp'},
                unlocked(){return tmp.s.microtabs.tab.warp.unlocked},
                content:[
                    ["display-text", function(){return '进行一次空间重置,并将所有空间转换为扭曲空间'}],
                    ["display-text", function(){return '扭曲空间可以根据公式提供加成'}],
                ],
            },
            "Prism": {
                name(){return '棱柱'},
                nameI18N(){return 'Prism'},
                unlocked(){return tmp.s.microtabs.tab.prism.unlocked},
                content:[
                    ["display-text", function(){return '棱柱中含有光的三种原色以及三种混合色和白色,这七种颜色分别具有不同的效果'}],
                    ["display-text", function(){return '你可以在对应的三种原色处插入棱柱以激活对应的颜色,并根据光强获得加成'}],
                    ["display-text", function(){return '如果你激活了两种或以上的颜色,根据颜色的混合关系你会获得其对应的混合色的加成'}],
                    ["display-text", function(){return '光强由你的点原始产量提供'}],
                ],
            },
            "Volume": {
                name(){return '体积'},
                nameI18N(){return 'Volume'},
                unlocked(){return tmp.s.microtabs.tab.volume.unlocked},
                content:[
                    ["display-text", function(){return ''}],
                ],
            },
        }
    },
    tabFormat: [
       ["display-text", function() { return getPointsDisplay() }],
       "blank",
       ["microtabs","Tab"]
    ],
    layerShown(){return true},
})

addLayer("mainlayer", {
    name: "mainlayer",
    position: -1,
    row: 0,
    symbol() {return '主要页面'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return 'Main'}, // Second name of symbol for internationalization (i18n) if internationalizationMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return true},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})