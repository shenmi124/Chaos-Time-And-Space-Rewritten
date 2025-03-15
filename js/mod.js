let modInfo = {
	name: "混乱时空重置版",
	nameI18N: "CTS: Rewritten",// When you enabled the internationalizationMod, this is the name in the second language
	id: "ChaosTimeAndSpaceRewritten",
	author: "辉影神秘(Shinwmyste)",
	pointsName: "时空悖论",
	pointsNameI18N: "Space Time Paradox",// When you enabled the internationalizationMod, this is the name in the second language
	modFiles: ["layers.js", "tree.js", "layers/spacetime.js", "layers/space.js", "layers/singularity.js", "layers/infinity.js"],

	internationalizationMod: false,
	changedDefaultLanguage: true,

	forceOneTab: false,// Enable Single-Tab Mode (This feature doesn't work as smoothly as you might expect; it's designed for experts)
	showTab: 'tree-node',// If forceOneTab is enabled, it will always show this page when the page is refreshed

	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

var colors = {
	button: {
		width: '250px',// Table Button
		height: '40px',// Table Button
		font: '25px',// Table Button
		border: '3px'// Table Button
	},
	default: {
		1: "#ffffff",//Branch color 1
		2: "#bfbfbf",//Branch color 2
		3: "#7f7f7f",//Branch color 3
		color: "#dfdfdf",
		points: "#ffffff",
		locked: "#bf8f8f",
		background: "#0f0f0f",
		background_tooltip: "rgba(0, 0, 0, 0.75)",
	},
}

// Set your version in num and name
let VERSION = {
	num: "0.2",
	name: "Infinity!",
}

function changelog(){
	return ''
}

function winText(){
	return i18n(`你暂时完成了游戏!`, `Congratulations! You have reached the end and beaten this game, but for now...`)
}

function n(x){
	return new Decimal(x)
}

function amountDisplay(base, amount){
	return (n(base).neq(amount) ? ' ('+(n(amount).sub(base).gt(0) ? '+' : '')+format(n(amount).sub(base))+')' : '')
}

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
	return n(getPointGen()).lt(resourcesMax())
}

function getOriginalPointGain(){
	let base = n(0)
	base = base.add(Dim1Production())

	let mul = n(1)
	if(player.s.red){
		mul = mul.mul(tmp.s.getRedEffect)
	}
    if(hasUpgrade('s', 44)){mul = mul.mul(upgradeEffect('s', 44))}
	if(player.s.inVolumeChallenge){
		mul = mul.div(getChallengeAffect())
	}

	if(hasMilestone('si', 1)){
		mul = mul.mul(getThermalEnergyEffect())
	}

	let pow = n(1)
	if(hasMilestone('s', 2) && base.mul(mul).gte(1)){
		pow = n(tmp.s.milestones[2].effect)
	}
	return base.mul(mul).pow(pow)
}

function getPointGen(){
	if(player.s.contracting){
		return n(0)
	}
	let gen = n(getOriginalPointGain()).mul(getTimeSpeed())
	if(player.points.gte(getPointMax())){
		player.points = n(getPointMax())
	}
	return gen
}

function getTimeSpeed(){
	let time = n(1)
	time = time.mul(getWarpSpaceEffect())
	if(player.s.blue){
		time = time.mul(tmp.s.getBlueEffect)
	}
	return time
}

function getPointMax(){
	return n('1.797e308')
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra information at the top of the page
var displayThings = [
	function() {
		if(options.ch==undefined && modInfo.internationalizationMod==true){return '<big><br>You should choose your language first<br>你需要先选择语言</big>'}
		return '<div class="res">'+displayThingsRes()+'</div><br><div class="vl2"></div></span>'
	}
]

// You can write code here to easily display information in the top-left corner
function displayThingsRes(){
	let spacetime = ''
	spacetime = `
	${(i18n("时空悖论", "时空悖论"))}: `+format(player.points)+` (+`+format(getPointGen())+`/s) | 
	<br>
	${(i18n("时间速率", "时间速率"))}: `+format(getTimeSpeed())+`× | `

	let space = ''
	let warp = ''
	let prism = ''
	if(tmp.s.layerShown){
		space = `<br>
		${(i18n("空间", "空间"))}: `+format(player.s.points)+amountDisplay(player.s.points, getSpaceAmount())+` | `
		if(tmp.s.microtabs.tab.warp.unlocked){
			warp = `${(i18n("扭曲空间", "扭曲空间"))}: `+format(player.s.warp)+amountDisplay(player.s.warp, getWarpAmount())+` | `
		}
		if(tmp.s.microtabs.tab.prism.unlocked){
			prism = `<br>
			${(i18n("光强", "光强"))}: `+format(getIllumination())+amountDisplay(getIlluminationBase(), getIllumination())+` | `
		}
	}

	let singularity = ''
	let thermalEnergy = ''
	if(tmp.si.layerShown){
		singularity = `<br>
		${(i18n("奇点", "奇点"))}: `+format(player.si.points)+` | `
		if(tmp.si.microtabs.tab.thermalEnergy.unlocked){
			thermalEnergy = `${(i18n("热量", "热量"))}: `+format(player.si.thermalEnergy)+` | `
		}
	}

	return spacetime+space+warp+prism+singularity+thermalEnergy
}

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte('1.797e308')
}

function infinityDisplay(res){
	if(n(res).gte(getPointMax())){
		return '<b style="font-size: 36px">∞</b>'
	}
	return format(res)
}

function getPointsDisplay(){
	let a = ''
	if(player.devSpeed && player.devSpeed!=1){
		a += options.ch ? '<br>时间加速: '+format(player.devSpeed)+'x' : '<br>Dev Speed: '+format(player.devSpeed)+'x'
	}
	if(player.offTime!==undefined){
		a += options.ch ? '<br>离线加速剩余时间: '+formatTime(player.offTime.remain) : '<br>Offline Time: '+formatTime(player.offTime.remain)
	}
	a += '<br>'
	if(!(options.ch==undefined && modInfo.internationalizationMod==true)){
		a += `<span style="font-size: 22px" class="overlayThing">${(i18n("你有", "You have"))} <span style="font-size: 30px" class="overlayThing" id="points">${infinityDisplay(player.points)} ${i18n(modInfo.pointsName, modInfo.pointsNameI18N)}</span></span>`

		if(canGenPoints()){
			a += `<br><span style="font-size: 20px" class="overlayThing">(+`+(tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OoM" + (tmp.other.oompsMag < 0 ? "^OoM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen()))+`/sec)</span>`
		}

		a += '<br><span style="font-size: 22px">时间速率×<span class="timespeed">'+format(getTimeSpeed())+'</span></span>'
		
		a += `<div style="margin-top: 3px"></div>`
	}
	a += player.s.inVolumeChallenge ? '<red>!</red>你正在体积挑战中<red>!</red><br>' : ''
	a += player.si.contracting ? '<red>!</red>奇点正在收缩<red>!</red><br>' : ''
	a += tmp.displayThings
	a += '<br><br>'
	return a
}

// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
