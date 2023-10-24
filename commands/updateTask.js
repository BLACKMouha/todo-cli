import inquirer from 'inquirer'
import ora from 'ora'
import chalk from 'chalk'
import { connectDB, disconnectDB } from '../db/connectDB.js'
import { getTaskCode, handleError } from '../utils.js'
import Tasks from '../schema/TaskSchema.js'

async function askUpdateQ(task) {
  try {
    const update = await inquirer.prompt([
      { name: 'title', message: 'Update the title?', type: 'input', default: task.title },
      { name: 'detail', message: 'Update the Description?', type: 'editor', default: task.detail },
      { name: 'parentCode', message: 'Update the parent task code?', type: 'input', default: task.parentCode },
    ])

    return update
  } catch (error) {
    console.log(chalk.redBright('Something went wrong!\n'), error)
  }
}

export default async function updateTask() {
  try {
    const taskCode = await getTaskCode('Enter the code of the task:')

    await connectDB()

    const spinner = ora('Finding the task...').start()

    const task = await Tasks.findOne({ code: taskCode.code })

    spinner.stop()

    if (!task) {
      console.log(chalk.redBright('Could not find a task with the code you provided.'))
    } else {
      console.log(chalk.blueBright('Type the updated properties. Press Enter if you don\'t want to update the data.'))

      const update = await askUpdateQ(task)

      spinner.text = 'Updating the task...'
      spinner.start()

      await Tasks.updateOne({ code: task.code }, { $set: update })

      spinner.stop()

      console.log(chalk.greenBright('✔ Task updated successfully.'))
    }
    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}
