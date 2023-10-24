import dotenv from 'dotenv'
import mongoose from 'mongoose'
import ora from 'ora'
import chalk from 'chalk'

dotenv.config()

export async function connectDB() {
  try {
    const spinner = ora('Connecting to the database...').start()
    await mongoose.connect(process.env.MONGO_URI)
    spinner.stop()
    // console.log(chalk.greenBright('Successfully connected to database!!!\n'))
  } catch (error) {
    console.log(chalk.redBright('You probably need to install/start/configure MongoDB on your machine'));
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
