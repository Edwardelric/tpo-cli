/*
* Created By Edward 29/11/2017
* */

const async = require('async')
const inquirer = require('inquirer')
const chalk = require("chalk")

const promptMapping = {
	string: 'input',
	boolean: 'confirm'
}

/*
*   Ask
*   @param {prompts} keys of package.json
*   @param {data} metalsmith.data
*   @param {done} callback
* */

module.exports = function ask(prompts, data, done) {
	async.eachSeries(Object.keys(prompts), (key, next) => {
		prompt(key, prompts[key], data, next)
	}, done)
}

/*
*   Prompt
*   @param {key} answers key
*   @param {prompt} keylist
*   @param {metaData} metalsmith.data
*   @param {done} callback
* */

function prompt(key, prompt, metaData, done) {
	if (key === "name") {
		console.log(chalk.gray("    # follow questions is not necessary, you can press 'enter' and pass quickly  "))
	}
	inquirer.prompt([{
		type: promptMapping[prompt.type] || prompt.type,
		name: key,
		message: prompt.message || prompt.lalbe || key,
		default: prompt.default || "",
		choices: prompt.choices || [],
		validate: prompt.validate || (() => true)
	}]).then(answers => {
		metaData[key] = answers[key]
		done()
	})
}