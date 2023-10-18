import inquirer from "inquirer";
import Tasks from '../schema/TaskSchema.js'
import { connectDB, disconnectDB } from '../db/connectDB.js'
import ora from "ora";
import chalk from "chalk"
import { handleError, printDetail } from "../utils.js";

async function askFindQ() {
  try {
    const answers = await inquirer.prompt([
      { name: 'code', message: 'Filter by task code:', type: 'input', default: undefined },
      { name: 'parentCode', message: 'Filter by parent task code:', type: 'input', default: undefined },
      { name: 'title', message: 'Fitler by task title:', type: 'input', default: undefined },
      { name: 'status', message: 'Fitler by status', type: 'list', choices: ['pending', 'completed', 'None'] },
    ])

    return answers
  } catch (error) {
    console.error('Something went wrong!\n', error);
  }
}

export default async function findTask() {
  try {
    console.log('FYI: You can skip a question if you want')

    const answers = await askFindQ()
    const filters = {}

    for (const key in answers) {
      if (answers[key]) {
        if (key === 'name' && answers[key].trim() !== '') {
          const regex = new RegExp(`.*${answers[key].trim()}.*`, 'i')
          filters[key] = { $regex: regex }
        } else if (key === 'status' && answers[key] === 'None') delete answers.status
        else {
          filters[key] = answers[key]
        }
      }
    }

    console.log(filters);

    await connectDB()

    const spinner = ora('Applying filters...').start()

    spinner.stop()

    spinner.text = 'Finding the task(s)...'
    spinner.start()

    const tasks = await Tasks.find(filters)

    spinner.stop()

    if (tasks.length === 0) {
      console.log(chalk.blueBright('No task found!'))
    } else {
      tasks.forEach(task => {
        console.log(
          chalk.cyanBright('Task Code: ') + task.code + '\n' +
          chalk.magentaBright('Parent Task Code: ') + task.parentCode + '\n' +
          chalk.blueBright('Title: ') + task.title + '\n' +
          chalk.yellowBright('Description: ') + printDetail('Decription:  ', task.detail) +
          chalk.whiteBright('Status: ') + task.status + '\n'
        )
      })
      console.log(chalk.bgBlue(`${tasks.length} task(s) found!`))
    }

    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}
