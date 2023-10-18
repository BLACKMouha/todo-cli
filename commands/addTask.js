import inquirer from "inquirer"
import ora from "ora"
import chalk from "chalk"
import { connectDB, disconnectDB } from '../db/connectDB.js'
import Tasks from "../schema/TaskSchema.js"
import { handleError, validateTitle } from "../utils.js"
import { nanoid } from "nanoid"

export async function askTaskQ() {
  const task = await inquirer.prompt([
    {
      name: 'title', message: 'Enter the title of the task:', type: 'input',
      validate: input => validateTitle(input, 'A task should have a title. Please provide a title!')
    },
    { name: 'detail', message: 'Describe what you want to do:', type: 'editor' },
  ])

  return task
}

const askAddTaskQ = async () => {

  const tasks = []
  let taskLoop = false

  do {
    const task = await askTaskQ()
    tasks.push(task)
    const addMore = await inquirer.prompt([{ name: 'confirm', message: 'Do you want to add more tasks?', type: 'confirm' }])
    if (addMore.confirm) {
      taskLoop = true
    } else {
      taskLoop = false
    }
  } while (taskLoop)

  return tasks
}

export async function addTask() {
  try {
    const tasks = await askAddTaskQ()

    await connectDB()

    let spinner = ora('Creating the tasks...').start()

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i]
      task.code = nanoid(10)
      await Tasks.create(task)
    }

    spinner.stop()
    console.log(chalk.greenBright('✔ Tasks created successfully!'))

    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}
