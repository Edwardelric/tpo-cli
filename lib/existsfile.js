/*
* Created By Edward 29/11/2017
* */

const fs = require("fs")

/*
*   ExistsFile check has file
*   @param {file} file path
* */

module.exports = function existsFile(file) {
	return fs.existsSync(file)
}