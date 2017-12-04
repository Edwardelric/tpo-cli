#!/usr/bin/env node

/*
* Created By Edward 27/11/2017
* */

const program = require("commander")

program
	.version(require("../package.json").version)
	.usage("<command> [options]")
	.command("init", "generate a new project from base")
	.command("init1", "generate a new project from base")
	.parse(process.argv)
