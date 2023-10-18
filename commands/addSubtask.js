import inquirer from "inquirer"
import ora from "ora"
import chalk from "chalk"
import { connectDB, disconnectDB } from '../db/connectDB.js'
import Tasks from "../schema/TaskSchema.js"
import { getTaskCode, handleError, validateTitle } from "../utils.js"
import { nanoid } from "nanoid"

export async function askSubtaskQ() {
  const task = await inquirer.prompt([
    {
      name: 'title', message: 'Enter the title of the subtask:', type: 'input',
      validate: input => validateTitle(input, 'A subtask should have a title. Please provide a title!')
    },
    { name: 'detail', message: 'Describe what you want to do:', type: 'editor' },
  ])

  return task
}

const askAddSubtaskQ = async () => {
  const parentCode = await getTaskCode('Enter the code of the parent task:')

  await connectDB()

  const spinner = ora('Finding the parent task...').start()

  const parentTask = await Tasks.findOne({ code: parentCode.code })

  spinner.stop()

  if (!parentTask) {
    console.log(chalk.redBright('Task not found with the provided code.'))
  } else {
    console.log(chalk.greenBright('Task found!'))

    const subtasks = []
    let taskLoop = false

    do {
      const subtask = await askSubtaskQ()
      subtasks.push(subtask)
      subtask.parentCode = parentTask.code
      const addMore = await inquirer.prompt([{ name: 'confirm', message: 'Do you want to add more subtasks?', type: 'confirm' }])
      if (addMore.confirm) {
        taskLoop = true
      } else {
        taskLoop = false
      }
    } while (taskLoop)

    return subtasks
  }
}

export async function addSubtask() {
  try {
    const subtasks = await askAddSubtaskQ()

    if (!subtasks || subtasks.length === 0) {
      console.log(chalk.redBright('Looks like no stains are present '))
    } else {
      await connectDB()

      let spinner = ora('Creating the subtasks...').start()

      for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i]
        subtask.code = nanoid(10)
        await Tasks.create(subtask)
      }

      spinner.stop()
      console.log(chalk.greenBright('✔ Subtasks created successfully!'))

      await disconnectDB()
    }
  } catch (error) {
    handleError(error)
  }
}
