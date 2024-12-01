addLayer("1layer", {
    name: "sideLayer1",
    position: -1,
    row: 1,
    symbol() {return '主要'}, // This appears on the layer's node. Default is the id with the first letter capitalized
    symbolI18N() {return 'Main'}, // Second name of symbol for internationalization (i18n) if otherLanguageMod is enabled (in mod.js)
    small: true,// Set to true to generate a slightly smaller layer node
    nodeStyle: {"font-size": "15px", "height": "30px"},// Style for the layer button
    startData() { return {
        unlocked: true,
        points: new Decimal(0),// This currently does nothing, but it's required. (Might change later if you add mechanics to this layer.)
    }},
    color: "#fefefe",
    type: "none",
    tooltip(){return false},
    layerShown(){return layerDisplayTotal(['st', 's'])},// If any layer in the array is unlocked, it will returns true. Otherwise it will return false.
	tabFormat: [
        ["display-text", function() { return getPointsDisplay() }]
    ],
})