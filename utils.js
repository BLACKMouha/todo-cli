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
    console.log('❌ Something went wrong!\n', error)
  }
}

export function printDetail(intro, TaskDetail) {
  if (!TaskDetail || TaskDetail.trim() === '') return ''

  const lines = TaskDetail.split('\n')
  const indentation = ' '.repeat(intro.length)
  let text = lines[0] + '\n'
  for (let i = 1; i < lines.length; i++) {
    text += `${indentation}${lines[i]}\n`
  }
  return text
}

export function handleError(error) {
  console.log(chalk.redBright('❌ Something went wrong!\n'), error)
  process.exit(1)
}

export function unknownCommandHandler(message) {
  console.log(message)
}
