import chalk from 'chalk'
import ora from 'ora'
import { connectDB, disconnectDB } from '../db/connectDB.js'
import Tasks from '../schema/TaskSchema.js'
import { getTaskCode, handleError, printDetail } from '../utils.js'

export default async function listSubtasks() {
  try {
    const parentCode = await getTaskCode('Enter the code of the parent task:')

    await connectDB()

    const spinner = ora('Finding the parent task...').start()

    const parentTask = await Tasks.findOne({ code: parentCode.code })

    spinner.stop()

    if (!parentTask) {
      console.log(chalk.redBright('Task not found with the provided code.'))
    } else {
      const spinner = ora('Fetching all subtasks...').start()

      const subtasks = await Tasks.find({ parentCode: parentTask.code })

      spinner.stop()

      let s = chalk.bgBlue(`${parentTask.code}`) + ' '
      if (parentTask.parentCode) s += '-> ' + chalk.bgBlackBright(`${parentTask.parentCode}`) + ' '
      else s += ' '
      s += chalk.bold(chalk.bgRedBright(parentTask.title))
      if (parentTask.detail) s += '\n' + chalk.blueBright(printDetail(parentTask.detail)) + '\n'
      else s += '\n'
      console.log(s)

      if (subtasks.length === 0) {
        console.log(chalk.blueBright('You do not have any subtasks yet!'))
      } else {
        subtasks.forEach(subtask => {
          let s = ' '.repeat(4) + chalk.bgBlue(subtask.code) + ' '
          s += chalk.bold(chalk.bgRedBright(subtask.title))
          if (subtask.detail) s += '\n' + chalk.blueBright(printDetail(subtask.detail)) + '\n'
          else s += '\n'
          console.log(s)
        })
        console.log(chalk.yellow(`${subtasks.length} subtask(s) found!`));
      }
    }
    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}
