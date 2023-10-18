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

      console.log(
        chalk.cyanBright('Task Code: ') + parentTask.code + '\n' +
        chalk.magentaBright('Parent Task Code: ') + parentTask.parentCode + '\n' +
        chalk.blueBright('Name: ') + parentTask.title + '\n' +
        chalk.yellowBright('Description: ') + printDetail('decription: ', parentTask.detail) + '\n'
      )

      if (subtasks.length === 0) {
        console.log(chalk.blueBright('You do not have any subtasks yet!'))
      } else {
        subtasks.forEach(subtask => {
          console.log(
            chalk.cyanBright('Task Code: ') + subtask.code + '\n' +
            chalk.magentaBright('Parent Task Code: ') + subtask.parentCode + '\n' +
            chalk.blueBright('Name: ') + subtask.title + '\n' +
            chalk.yellowBright('Description: ') + printDetail('decription: ', subtask.detail) + '\n'
          )
        })
        console.log(chalk.bgBlue(`${subtasks.length} subtask(s) found!`));
      }
    }
    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}
