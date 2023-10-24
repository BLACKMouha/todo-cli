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
