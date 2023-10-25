#!/usr/bin/env node

import chalk from 'chalk'
import { program } from 'commander'

import listTasks from './commands/listTask.js'
import listSubtasks from './commands/listSubtask.js'

import { addTask } from './commands/addTask.js'
import { addSubtask } from './commands/addSubtask.js'
import addTaskWithSubtask from './commands/addTaskWithSubtasks.js'

import deleteTask from './commands/deleteTask.js'

import updateTask from './commands/updateTask.js'
import { setMongoURI, unknownCommandHandler } from './utils.js'
import findTask from './commands/findTask.js'
import updateStatusTask from './commands/updateStatusTask.js'


program
  .description(chalk.bgGrey('TodoSH, task manager tool.'))
  .version('1.0.0')

program
  .command('list')
  .option('-a, --all', 'Lists all tasks and subtasks')
  .option('-s, --subtasks', 'Lists all subtasks of a task')
  .action(options => {
    if (options.all) listTasks()
    else if (options.subtasks) listSubtasks()
    else unknownCommandHandler('see `todo list --help` for more information')
  })

program
  .command('create')
  .option('-t, --tasks', 'Creates as many tasks as you wish.')
  .option('-s, --subtasks', 'Creates as many subtasks as you wish.')
  .option('-w, --tasks-with-subtasks', 'Creates as many tasks and subtasks as you wish.')
  .action(options => {
    if (options.tasks) addTask()
    else if (options.subtasks) addSubtask()
    else if (options.tasksWithSubtasks) addTaskWithSubtask()
    else unknownCommandHandler('see `todo create --help` for more information')
  })

program
  .command('find')
  .action(findTask)

program
  .command('update')
  .option('-t, --task', 'Update task information.')
  .option('-s, --status', 'Update the status of a task.')
  .action(options => {
    if (options.task) updateTask()
    else if (options.status) updateStatusTask()
    else unknownCommandHandler('see todo update --help for more information')
  })

program
  .command('delete')
  .description('Deletes a task.')
  .action(deleteTask)

program
  .command('set-mongo-uri')
  .description('Updates the Mongo URI')
  .action(setMongoURI)

program.parse(process.argv)
