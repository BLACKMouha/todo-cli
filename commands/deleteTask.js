import ora from "ora";
import chalk from "chalk";
import { getTaskCode, handleError } from '../utils.js';
import { connectDB, disconnectDB } from '../db/connectDB.js'
import Tasks from '../schema/TaskSchema.js';

export default async function deleteTask() {
  try {
    const taskCode = await getTaskCode('Enter the code of the task:')

    await connectDB()

    await deleteTaskLoop(taskCode.code)

    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}

export async function deleteTaskLoop(taskCode) {
  const spinner = ora('Finding and Deleting the task....').start()

  const deletedTask = await Tasks.findOneAndDelete({ code: taskCode })

  spinner.stop()

  if (!deletedTask) {
    console.log(chalk.redBright('Task not found!'))
    return
  } else {
    spinner.text = 'Finding subtasks...'
    spinner.start()
    const subtasks = await Tasks.find({ parentCode: taskCode })
    spinner.stop()
    if (subtasks.length !== 0) {
      for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i]
        await deleteTaskLoop(subtask.code)
      }
      console.log(chalk.greenBright('Task and eventual subtasks deleted successfully!'))
    } else {
      return
    }
  }
}
