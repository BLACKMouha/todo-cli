#!/bin/bash

file_to_remove="$(npm prefix -g)/bin/todo)"

if [ -e "$file_to_remove" ]; then
    rm "$file_to_remove"
    echo "File $file_to_remove removed."

    npm link
    echo "**todo** command is a global now!"
else
    echo "File $file_to_remove does not exist."
    npm link
fi
