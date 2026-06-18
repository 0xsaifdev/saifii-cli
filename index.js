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

function detectPackageManager(targetPath) {
  if (
    fs.existsSync(path.join(targetPath, "requirements.txt")) ||
    fs.existsSync(path.join(targetPath, "pyproject.toml"))
  ) {
    return "python";
  }
  if (fs.existsSync(path.join(targetPath, "composer.json"))) {
    return "composer";
  }
  if (
    fs.existsSync(path.join(targetPath, "pnpm-workspace.yaml")) ||
    fs.existsSync(path.join(targetPath, "pnpm-lock.yaml"))
  ) {
    return "pnpm";
  }
  if (fs.existsSync(path.join(targetPath, "yarn.lock"))) {
    return "yarn";
  }
  if (fs.existsSync(path.join(targetPath, "package.json"))) {
    return "npm";
  }
  return "none";
}

program.name("saifii").description("CLI to scaffold projects").version("1.1.1");

program
  .command("create <template> <project-name>")
  .description("Create a project from a boilerplate")
  .action(async (template, projectName) => {
    const templatePath = path.join(boilerplatesDir, template);

    if (!fs.existsSync(templatePath)) {
      console.log(chalk.red(`❌ Template "${template}" not found.`));
      console.log(chalk.yellow('Run "saifii list" to see available templates.'));
      return;
    }

    const targetPath = path.resolve(projectName);

    if (fs.existsSync(targetPath)) {
      console.log(chalk.red(`❌ Directory "${projectName}" already exists.`));
      return;
    }

    try {
      await fs.copy(templatePath, targetPath);
      console.log(
        chalk.green(`✅ Project "${projectName}" created using "${template}" template.`)
      );

      // Copy .env.example → .env if present
      const envExample = path.join(targetPath, ".env.example");
      const envFile = path.join(targetPath, ".env");
      if (fs.existsSync(envExample) && !fs.existsSync(envFile)) {
        fs.copySync(envExample, envFile);
        console.log(chalk.blue("📄 .env created from .env.example"));
      }

      // Git init
      execSync("git init", { cwd: targetPath, stdio: "inherit" });
      console.log(chalk.blue("📁 Git initialized."));

      const pkgManager = detectPackageManager(targetPath);

      if (pkgManager === "python") {
        console.log(chalk.yellow("\n🐍 Python project detected."));
        console.log(chalk.cyan("  To install dependencies, run:"));
        console.log(chalk.white(`    cd ${projectName}`));
        console.log(chalk.white("    python -m venv venv"));
        console.log(chalk.white("    source venv/bin/activate  # Windows: venv\\Scripts\\activate"));
        console.log(chalk.white("    pip install -r requirements.txt"));
      } else if (pkgManager === "composer") {
        console.log(chalk.blue("🐘 PHP project detected. Running composer install..."));
        execSync("composer install", { cwd: targetPath, stdio: "inherit" });
        console.log(chalk.blue("📦 Composer dependencies installed."));
        // Generate Laravel app key if artisan is present
        if (fs.existsSync(path.join(targetPath, "artisan"))) {
          execSync("php artisan key:generate --ansi", { cwd: targetPath, stdio: "inherit" });
        }
      } else if (pkgManager === "none") {
        console.log(chalk.blue("⚡ No dependencies to install."));
      } else {
        const installCmd =
          pkgManager === "pnpm"
            ? "pnpm install"
            : pkgManager === "yarn"
            ? "yarn install"
            : "npm install";
        console.log(chalk.blue(`📦 Installing dependencies with ${pkgManager}...`));
        execSync(installCmd, { cwd: targetPath, stdio: "inherit" });
        console.log(chalk.blue("📦 Dependencies installed."));
      }

      console.log(chalk.green("\n🚀 All done! Happy coding!"));
      console.log(chalk.cyan(`   cd ${projectName}`));
    } catch (err) {
      console.log(chalk.red("❌ Error:"), err.message || err);
    }
  });

program
  .command("list")
  .alias("ls")
  .description("List all available templates")
  .action(() => {
    const templates = fs
      .readdirSync(boilerplatesDir)
      .filter((f) => fs.statSync(path.join(boilerplatesDir, f)).isDirectory());

    console.log(chalk.cyan("\nAvailable templates:\n"));
    templates.forEach((t) => console.log(chalk.yellow(`  • ${t}`)));
    console.log("");
  });

program.parse();
