import fs from 'fs'
import chalk from "chalk";
import inquirer from "inquirer";

export function validateTitle(input, message) {
  if (input.trim() === '') {
    return message
  } else return true
}

export async function getTaskCode(message) {
  try {
    const answers = await inquirer.prompt([
      {
        name: 'code', message, type: 'input',
        validate: input => validateTitle(input, 'You should provide an existing task code!')
      },
    ])

    answers.code = answers.code.trim()

    return answers
  } catch (error) {
    console.log(chalk.redBright('❌ Something went wrong!\n'), error)
  }
}

export function printDetail(taskDetail) {
  let line = "";
  let formattedText = "";
  const words = taskDetail.split(" ");
  const indentation = ' '.repeat(13)

  for (const word of words) {
    if (line.length + word.length + 1 <= 80) {
      if (line.length === 0) {
        line = word;
      } else {
        line += " " + word;
      }
    } else {
      formattedText += indentation + line + "\n";
      line = word;
    }
  }

  if (line) {
    formattedText += indentation + line;
  }

  return formattedText;
}

export function handleError(error) {
  console.log(chalk.redBright('❌ Something went wrong!\n'), error)
  process.exit(1)
}

export function unknownCommandHandler(message) {
  console.log(message)
}


function loadConfig() {
  try {
    const configData = fs.readFileSync('config.json', 'utf-8');
    return JSON.parse(configData);
  } catch (err) {
    console.error('Error loading configuration:', err);
    return {};
  }
}

export function getMongoURI() {
  const config = loadConfig();
  return config.mongodb_uri;
}

function saveConfig(config) {
  fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
}

async function askMongoUriQ(message) {
  try {
    const answers = await inquirer.prompt([
      { name: 'mongoUri', message, type: 'input', default: getMongoURI() },
    ])

    answers.mongoUri = answers.mongoUri.trim()

    return answers
  } catch (error) {
    console.log(chalk.redBright('❌ Something went wrong!\n'), error)
  }
}

export async function setMongoURI() {
  const mongoUriR = await askMongoUriQ()
  const {mongoUri} = mongoUriR
  const config = loadConfig()
  config.mongodb_uri = mongoUri
  saveConfig(config);
  console.log('MongoDB URI updated successfully.')
}
