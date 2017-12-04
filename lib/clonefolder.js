/*
* Created By Edward 29/11/2017
* */

const ora = require("ora")
const ncp = require("ncp").ncp;
const chalk = require("chalk")
const setUseAllTpo = require("./setusealltpo")
/*
*   CloneFolder clone folder
*   @param {source} source
*   @param {dest} dest
* */

module.exports = function cloneFolder(source, dest, data) {
	const spinner = ora(chalk.gray("    coping, please wait some seconds ^v^..."))
	spinner.start();
	ncp(source, dest, {
		filter: function(fileName) {
			// 过滤 dist|node_module
			return !(/dist|node_module/.test(fileName))
		}
	}, (err) => {
		setTimeout(() => {
			spinner.stop()
		}, 2000);
		if (err) {
			// process.exit();
		} else {
			setUseAllTpo(data, dest)
		}
	})
}
