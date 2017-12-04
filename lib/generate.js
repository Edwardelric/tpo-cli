/*
* Created By Edward 29/11/2017
* */

const Metalsmith = require("metalsmith")
const meta = require("./meta")
const getGitUser = require("./gituser")
const ask = require("./ask")
const cloneFolder = require("./clonefolder")

/*
*   Generate a template
*   @param {rawName} new Template name
* */

module.exports = function generate(rawName) {
	const prompts = meta.prompts;
	prompts.name.default = rawName;
	prompts.author.default = getGitUser();
	const metalsmith = Metalsmith(__dirname)
	const data = Object.assign(metalsmith.metadata(), {})
	metalsmith.use(askQuestions(meta.prompts))
	metalsmith.clean(false)
		.source(".")
		.destination(".")
		.build((err,files) => {
			cloneFolder("storeselect", rawName, metalsmith.metadata())
		})
}

/*
*   AskQuestions
*   @param {prompts} keys of package.json
* */

function askQuestions(prompts) {
	return (file, metalsmith, done) => {
		// file 不能剔除
		ask(prompts, metalsmith.metadata(), done)
	}
}

