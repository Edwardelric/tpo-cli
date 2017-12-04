#!/usr/bin/env node

/*
* Created By Edward 27/11/2017
* */

const program = require("commander")
const chalk = require("chalk")
const inquirer = require('inquirer')
const path = require("path")
const generate = require("../lib/generate")
const existsFile = require("../lib/existsfile")

program
	.usage("<template-name> [project-name]")
	.parse(process.argv)

/**
 * help
 */

program.on("--help", () => {
	console.log("Example:")
	console.log()
	console.log(chalk.gray("    # create a new project with base template"));
	console.log("    $ tpo init my-project")
	console.log()
})

function help() {
	if (program.args.length < 1) {
		return program.help()
	}
}

/*
*   Settings
* */

const rawName = program.args[0]
const inPlace = !rawName || rawName === "."
const to = path.resolve(rawName || ".")
const basePath = path.resolve("storeselect");
// const fs = require("fs");

if (existsFile(to) && existsFile(basePath)) {
	inquirer.prompt([{
		type: "confirm",
		message: inPlace ? "Generate project in current directory" : "Target directory exists. Continue?",
		name: "ok"
	}]).then(answers => {
		if (answers.ok) {
			generate(rawName)
		}
	})
} else {
	if (existsFile(basePath)) {
		generate(rawName)
	} else {
		// 不存在base模板在报错
		console.log(chalk.red("    # base template unexists"));
		process.exit()
	}
}

process.on("exit", (msg) => {
	if (msg) {
		console.log();
		console.log(chalk.gray(`    # ${msg}`))
		console.log();
	} else {
		console.log();
		console.log(chalk.gray("    # init completed && exit "))
		console.log(chalk.gray(`    # goto new project: ${rawName}`));
		console.log(chalk.gray(`    # (c)npm install`));
		console.log();
	}
})

help();