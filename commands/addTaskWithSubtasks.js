import { nanoid } from 'nanoid'
import inquirer from "inquirer"
import ora from "ora"
import chalk from "chalk"
import { connectDB, disconnectDB } from '../db/connectDB.js'
import Tasks from '../schema/TaskSchema.js'
import { handleError } from '../utils.js'
import { askTaskQ } from './addTask.js'
import { askSubtaskQ } from './addSubtask.js'

const askAllQ = async () => {

  const todoArray = []
  let repeatAddTask = true

  do {
    const task = await askTaskQ()
    task.code = nanoid(10)
    const subtasks = []
    let repeatAddSubtask = false
    do {
      const addSubtaskQ = await inquirer.prompt([{ name: 'confirm', message: 'Do you want to add a subtask?', type: 'confirm' }])
      if (addSubtaskQ.confirm) {
        repeatAddSubtask = true
        const subtask = await askSubtaskQ()
        subtask.code = nanoid(10)
        subtask.parentCode = task.code
        subtasks.push(subtask)
      }
      else repeatAddSubtask = false
    } while (repeatAddSubtask)
    const confirmQ = await inquirer.prompt([{ name: 'confirm', message: 'Do you want to add more tasks?', type: 'confirm' }])
    if (confirmQ.confirm) repeatAddTask = true
    else repeatAddTask = false

    todoArray.push(task)
    if (subtasks.length !== 0) todoArray.push(...subtasks)
  } while (repeatAddTask)

  return todoArray
}

export default async function addTaskWithSubtask() {
  try {
    const allTasks = await askAllQ()

    await connectDB()

    let spinner = ora('Creating the todos...').start()

    for (let i = 0; i < allTasks.length; i++) {
      const response = allTasks[i]
      await Tasks.create(response)
    }

    spinner.stop()
    console.log(chalk.greenBright('Created the todos!'))

    await disconnectDB()
  } catch (error) {
    handleError(error)
  }
}
