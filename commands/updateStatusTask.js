import inquirer from 'inquirer'
import ora from 'ora'
import chalk from 'chalk'
import { connectDB, disconnectDB } from '../db/connectDB.js'
import { getTaskCode, handleError } from '../utils.js'
import Tasks from '../schema/TaskSchema.js'
import { deleteTaskLoop } from './deleteTask.js'

async function askStatusQ() {
  try {
    const update = await inquirer.prompt([
      { name: 'status', message: 'Update the status (choose None if you don\'t want to update the status)?', type: 'list', choices: ['pending', 'completed', 'None'] }
    ])

    return update
  } catch (error) {
    console.log(chalk.redBright('Something went wrong!\n'), error)
  }
}

export default async function updateStatusTask() {
  try {
    const taskCode = await getTaskCode('Enter the code of the task:')

    await connectDB()

    const spinner = ora('Finding the task...').start()

    const task = await Tasks.findOne({ code: taskCode.code })

    spinner.stop()

    if (!task) {
      console.log(chalk.redBright('Could not find a task with the code you provided.'))
    } else {
      const update = await askStatusQ()

      if (update.status === 'None') update.status = task.status

      if (update.status === 'completed') {
        spinner.text = 'Completing task...'
        spinner.start()

        const { parentCode } = task

        await deleteTaskLoop(taskCode.code)

        console.log(chalk.greenBright('🎉 Task completed. 🎉'))
        if (parentCode) {
          const parentTask = await Tasks.findOne({ code: parentCode })
          const pendingSubtasks = await Tasks.find({ parentCode, status: 'pending' })
          if (pendingSubtasks.length === 0) {
            console.log(chalk.greenBright(`🎉 You complete the task: ${parentTask.title} 🎉`))
            await deleteTaskLoop(parentTask.code)
          }
        }
        spinner.stop()
      } else {
        spinner.text = 'Updating the task...'
        spinner.start()
        await Tasks.updateOne({ code: task.code }, update)
        spinner.stop()
        console.log(chalk.greenBright('✔ Task updated successfully.'))
      }
    }
    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}
