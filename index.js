#!/usr/bin/env node

import { Command } from "commander";
import fs from "fs-extra";
import path, { dirname } from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

const boilerplatesDir = path.join(__dirname, "boilerplates");

program.name("saifii").description("CLI to scaffold projects").version("1.0.0");

program
  .command("create <template> <project-name>")
  .description("Create a project from a local boilerplate")
  .action(async (template, projectName) => {
    const templatePath = path.join(boilerplatesDir, template);

    if (!fs.existsSync(templatePath)) {
      console.log(chalk.red(`❌ Template "${template}" not found.`));
      return;
    }

    const targetPath = path.resolve(projectName);
    try {
      await fs.copy(templatePath, targetPath);
      console.log(
        chalk.green(
          `✅ Project "${projectName}" created using "${template}" template.`
        )
      );

      // Git init
      execSync("git init", { cwd: targetPath, stdio: "inherit" });
      console.log(chalk.blue("📁 Git initialized."));

      // Install dependencies
      execSync("npm install", { cwd: targetPath, stdio: "inherit" });
      console.log(chalk.blue("📦 Dependencies installed."));

      console.log(chalk.green("🚀 All done! Happy coding!"));
    } catch (err) {
      console.log(chalk.red("❌ Error:"), err.message || err);
    }
  });

program.parse();
