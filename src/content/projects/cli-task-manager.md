# CLI Task Manager

A command-line task management application built with Python.

![CLI Interface](/images/cli-task-preview.png)

## Overview

A powerful yet simple task manager that runs entirely in the terminal. Features include task prioritization, due dates, tags, and persistent storage.

## Features

- **Task Management**: Create, update, delete, and list tasks
- **Priority Levels**: High, medium, and low priority sorting
- **Due Dates**: Set and track deadlines
- **Tags**: Organize tasks with custom tags
- **Search**: Find tasks by keyword or tag
- **Export**: Export tasks to JSON or CSV

## Usage

```bash
# Add a new task
task add "Complete project documentation" --priority high --due 2024-03-01

# List all tasks
task list

# Mark task as complete
task done 1

# Search tasks
task search "documentation"
```

## Technologies

- Python 3.10+
- Click (CLI framework)
- SQLite for storage
- Rich for terminal formatting

---

*Making productivity terminal-friendly*
