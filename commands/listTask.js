import chalk from 'chalk'
import ora from 'ora'
import { connectDB, disconnectDB } from '../db/connectDB.js'
import Tasks from '../schema/TaskSchema.js'
import { handleError, printDetail } from '../utils.js'

export default async function listTasks() {
  try {
    await connectDB()

    const spinner = ora('Fetching all tasks...').start()

    const tasks = await Tasks.find({})

    spinner.stop()

    if (tasks.length === 0) {
      console.log(chalk.blueBright('You do not have any tasks yet! Enjoy...!'))
    } else {
      tasks.forEach(task => {
        console.log(
          chalk.cyanBright('Task Code: ') + task.code + '\n' +
          chalk.magentaBright('Parent Task Code: ') + task.parentCode + '\n' +
          chalk.blueBright('Name: ') + task.title + '\n' +
          chalk.yellowBright('Description: ') + printDetail('Decription:  ', task.detail) + '\n'
        )
      })
      console.log(chalk.bgBlue(`${tasks.length} task(s) found!`));
    }

    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}
