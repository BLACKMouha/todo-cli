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
        let s = chalk.bgBlue(`${task.code}`) + ' '
        if (task.parentCode) s += chalk.gray('->') + ' ' + chalk.bgBlackBright(`${task.parentCode}`) + ' '

        s += chalk.bold(chalk.bgRedBright(task.title))
        if (task.detail) s += '\n' + chalk.blueBright(printDetail(task.detail)) + '\n'
        else s += '\n'
        console.log(s)
      })
      console.log(chalk.yellow(`${tasks.length} task(s) found!`));
    }

    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}
