import mongoose from 'mongoose'
import ora from 'ora'
import chalk from 'chalk'
import { getMongoURI } from '../utils.js'

export async function connectDB() {
  try {
    const spinner = ora('Connecting to the database...').start()
    const TODO_MONGO_URI = await getMongoURI()
    await mongoose.connect(TODO_MONGO_URI)
    spinner.stop()
    // console.log(chalk.greenBright('Successfully connected to database!!!\n'))
  } catch (error) {
    console.error(error)
    console.log(chalk.redBright('You probably need to install | start | configure MongoDB on your machine'));
    process.exit(1)
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect()
    // console.log(chalk.greenBright('Disconnected from the database.\n'))
  } catch (error) {
    console.log(chalk.redBright('Something goest wrong!\n'), error);
    process.exit(1)
  }
}
