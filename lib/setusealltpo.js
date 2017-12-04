/*
* Created By Edward 29/11/2017
* */

const fs = require("fs")
const path = require("path")
/*
*   SetUseAllTpo
*   @param {useAllTpo} boolean
* */

module.exports = function setUseAllTpo(prompts, dest) {
	let filePath = path.resolve(dest,"./build/webpack.base.conf.js");
	if (prompts.useAllTpo) {
		// useAllTpo: true
		fs.readFile(filePath, "utf8", (err, data) => {
			if (err) { return;}
			let newValue = data.replace(/useAllTpo\:.*,/g, "useAllTpo: true,")
			fs.writeFileSync(filePath, newValue, "utf-8");
		})
	} else {
		// useAllTpo: false
		fs.readFile(filePath, "utf8", (err, data) => {
			if (err) { return;}
			let newValue = data.replace(/useAllTpo\:.*,/g, "useAllTpo: false,")
			fs.writeFileSync(filePath, newValue, "utf-8");
		})
	}
}