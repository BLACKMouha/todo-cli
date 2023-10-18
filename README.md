# Task Manager on the SHell

## Description

TodoSH is a task manager command line interface. The CLI is built with:
- [NodeJS](https://nodejs.org),
- [MongoDB](https://www.mongodb.com/),
- [Mongoose](https://mongoosejs.com)
- [CommanderJS](https://github.com/tj/commander.js#readme),
- [InquirerJS](https://github.com/SBoudrias/Inquirer.js/blob/master/packages/inquirer/README.md),
- [Chalk](https://github.com/chalk/chalk#readme),
- [Ora](https://github.com/sindresorhus/ora#readme).

Its display is simple but colorful to help reading easily a long list of tasks. With TodoSH you can create tasks and subtasks and recursively. This means a subtask can hold a task and so forth. One of the key features of TodoSH is the ability to use one process to create a task followed by an intention to append as many subtasks as the user wants in a loop. The user can decide not to assign subtasks. In this case he is asked if he wants to create a new task.

A tasks should have a title, but the description is optional. Regarding the description, the default text editor of the operating system is opened for writing. This is a convenient way to more easily write a description in several lines. In additon, a text description is aligned left and indented when displayed on the terminal. For more informations take a look at the examples above or the help of a command.

## Installation

This CLI is cross-platform. It is built on Linux and tested on Windows and MacOS. To install it:

- Clone the repository: ```bash git clone https://github.com/BLACKMouha/todo-cli```
- Access the repository: ```bash cd todo-cli```
- Install [NodeJS](https://nodejs.org)
- Install [MongoDB](https://www.mongodb.com/)
- Start your MongoDB (**MongoDB should always be active!**)
- Run: ```bash npm install```
- Add permanently the following path in the PATH environnment variable
-- **On Unix/Linux systems:** ```bash echo 'export PATH="$(npm prefix -g)/bin:$PATH"' | tee -a ~/.bash_profile```
-- **On Windows:**
--- In the CMD, execute: ```bash npm prefix -g```
--- Add this path in the Windows PATH Environment Variable
    ---- If you need help, follow this [tutorial](https://helpdeskgeek.com/windows-10/add-windows-path-environment-variable/) that explains how to add to Windows PATH Environment Variable.
- Finally, run: ```bash npm link```
**Warning:** when executing ```bash npm link```, you should be in repository otherwise, it might produce errors
The command line name is **todo**.

## Examples

### Calling todo to display the help

```bash
Usage: todo [options] [command]

Your terminal task manager!

Options:
  -V, --version     output the version number
  -h, --help        display help for command

Commands:
  list [options]
  create [options]
  find
  update [options]
  delete            Deletes a task.
  help [command]    display help for command
```

### Listing all tasks and subtasks

This command displays all the tasks and subtasks without filters

```bash
todo list -a
```

### Create a task

To create a task, the user has three ways:

#### Creating only tasks

To create only tasks, execute one of the following commands

```bash
todo create -t
```

or

```bash
todo create --task

? Enter the title of the task: Test#0: adding a new task
? Describe what you want to do: Received
? Do you want to add more tasks? (Y/n) n

Successfully connected to database!!!
✔ Tasks created successfully!
Disconnected from the database.
```

The user is asked to provide a task title (required) and a description (optional).

#### Creating only subtasks

To create only subtasks, execute one of the following commands

```bash
todo create -s
```

or

```bash
todo create --subtask

? Enter the code of the parent task: zmCCKKb4qU
Successfully connected to database!!!
Task found!

? Enter the title of the subtask: Test#1: adding a subtask
? Describe what you want to do: Received
? Do you want to add more subtasks? No

Successfully connected to database!!!
✔ Subtasks created successfully!
Disconnected from the database.
```

One must provide a task code. To get it, display the tasks with **todo list -a** or **todo find**

#### Creating tasks and subtasks

To create only tasks, execute one of the following commands

```bash
todo create -w
```

or

```bash
todo create --tasks-with-subtasks

? Enter the title of the task: Test#2: adding a new task then its subtasks
? Describe what you want to do: Received
? Do you want to add a subtask? Yes
? Enter the title of the subtask: Test#3: adding a subtask immediately after its parent task creation
? Describe what you want to do: Received
? Do you want to add a subtask? No
? Do you want to add more tasks? No

Successfully connected to database!!!
Created the tasks!
Disconnected from the database.
```

A task creation is first performed then subtask creation and it can be repeated as much as desired

### Filtering tasks

Tasks are filtered by code, parent code, title and status. Filtering by title is the same as looking for tasks which titles contain the provided set of strings

```bash
FYI: You can skip a question by pressing Enter
? Filter by task code: 
? Filter by parent task code: 
? Fitler by task title: 
? Fitler by status None

Successfully connected to database!!!
Task Code: zmCCKKb4qU
Parent Task Code: undefined
Title: Test#0: adding a new task
Description:
Status: pending

Task Code: 2ItU3y5FLp
Parent Task Code: zmCCKKb4qU
Title: Test#1: adding a subtask
Description:
Status: pending

Task Code: GBjjALTui9
Parent Task Code: undefined
Title: Test#2: adding a new task then its subtasks
Description:
Status: pending

Task Code: -hDgTX5-ku
Parent Task Code: GBjjALTui9
Title: Test#3: adding a subtask immediately after its parent task creation
Description:
Status: pending
```

### Deleting a task

To delete task, its code is asked.
**Warning:** Deleting a task deletes all its subtask and recursively!

```bash
todo delete
? Enter the code of the task: -hDgTX5-ku

Successfully connected to database!!!
Disconnected from the database.


todo find
FYI: You can skip a question by pressing Enter
? Filter by task code: -hDgTX5-ku
? Filter by parent task code: 
? Fitler by task title: 
? Fitler by status None

Successfully connected to database!!!
No task found!
Disconnected from the database.
```

### Updating a task

To update task, its code is should be provided. But there is two kinds of update:

#### Update a task

This operation updates the title, description and parent task code of a task.

```bash
todo update -t

? Enter the code of the task: GBjjALTui9

Successfully connected to database!!!

Type the updated properties. Press Enter if you do not want to update the data.

? Update the name? Test#4: Updating the title of a task
? Update the Description? Received
? Update the parent task code?

✔ Task updated successfully.
Disconnected from the database.
```

The title and the description are updated.

```bash
FYI: You can skip a question by pressing Enter
? Filter by task code: GBjjALTui9
? Filter by parent task code: 
? Fitler by task title: 
? Fitler by status pending

Successfully connected to database!!!

Task Code: GBjjALTui9
Parent Task Code: 
Title: Test#4: Updating the title of a task
Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
             incididunt ut labore et dolore magna aliqua. Pharetra sit amet aliquam id diam
             maecenas ultricies mi eget. Sed egestas egestas fringilla phasellus faucibus
             scelerisque eleifend. Cum sociis natoque penatibus et. Viverra ipsum nunc
             aliquet bibendum. Quam vulputate dignissim suspendisse in. Odio morbi quis
             commodo odio aenean sed adipiscing diam donec.
Status: pending
```

### Update the status of a task

This one focuses completing a task and causes by the way its deletion process

```bash
todo update -s

? Enter the code of the task: GBjjALTui9

Successfully connected to database!!!

? Update the status (choose None if you do not want to update the status)? completed

🎉 Task completed. 🎉
Disconnected from the database.
```

```bash
todo find
FYI: You can skip a question by pressing Enter

? Filter by task code: GBjjALTui9
? Filter by parent task code: 
? Fitler by task title: 
? Fitler by status None

Successfully connected to database!!!

No task found!
Disconnected from the database.
```
