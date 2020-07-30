module.exports = function override(config, env) {
    // add browserify transform compatibility to webpack for custom plotly.js bundle
    // https://github.com/plotly/plotly.js/blob/master/BUILDING.md
    config.module.rules.push({
        test: /\.js$/,
        loader: "ify-loader",
    })
    return config
}
