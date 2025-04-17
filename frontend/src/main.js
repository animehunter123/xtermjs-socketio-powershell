import './style.css'
import { executeCommand, onCommandOutput } from './socket.js'

// Create the UI
document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>WebSocket Command Terminal</h1>

    <div class="terminal-container">
      <div id="output" class="terminal-output"></div>

      <form id="command-form" class="command-form">
        <input
          type="text"
          id="command-input"
          class="command-input"
          placeholder="Enter a command..."
          autocomplete="off"
        />
        <button type="submit" class="submit-btn">Execute</button>
      </form>
    </div>
  </div>
`

// Get DOM elements
const outputElement = document.getElementById('output')
const commandForm = document.getElementById('command-form')
const commandInput = document.getElementById('command-input')

// Command history management with localStorage persistence
const HISTORY_STORAGE_KEY = 'terminal_command_history'
const MAX_HISTORY_LENGTH = 50

// Load command history from localStorage or initialize empty array
const commandHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]')
let historyIndex = commandHistory.length

// Handle form submission
commandForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const command = commandInput.value.trim()
  if (!command) return

  // Handle special client-side commands
  if (command === 'clear-history') {
    // Clear command history
    commandHistory.length = 0
    localStorage.removeItem(HISTORY_STORAGE_KEY)
    historyIndex = 0

    // Add feedback to output
    appendToOutput('Command history cleared', 'info')
  } else if (command === 'clear' || command === 'cls') {
    // Clear terminal output
    outputElement.innerHTML = ''
    appendToOutput('Terminal cleared', 'info')
  } else if (command === 'history') {
    // Display command history
    appendToOutput('Command History:', 'info')
    if (commandHistory.length === 0) {
      appendToOutput('No commands in history', 'info')
    } else {
      commandHistory.forEach((cmd, index) => {
        appendToOutput(`${index + 1}  ${cmd}`, 'history')
      })
    }
  } else if (command === 'help') {
    // Display help information
    appendToOutput('Available Commands:', 'info')
    appendToOutput('clear or cls - Clear the terminal screen', 'help')
    appendToOutput('clear-history - Clear command history', 'help')
    appendToOutput('history - Show command history', 'help')
    appendToOutput('help - Show this help message', 'help')
    appendToOutput('\nUse Up/Down arrows to navigate through command history', 'help')
  } else {
    // Don't add duplicate commands in a row
    if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== command) {
      // Add command to history
      commandHistory.push(command)

      // Limit history length
      if (commandHistory.length > MAX_HISTORY_LENGTH) {
        commandHistory.shift() // Remove oldest command
      }

      // Save to localStorage
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(commandHistory))
    }

    // Set history index to end of history
    historyIndex = commandHistory.length

    // Add command to output
    appendToOutput(`$ ${command}`, 'command')

    // Send command to server
    executeCommand(command)
  }

  // Clear input
  commandInput.value = ''
})

// Handle keyboard events for command history navigation
commandInput.addEventListener('keydown', (e) => {
  // Up arrow key - navigate to previous command
  if (e.key === 'ArrowUp') {
    e.preventDefault() // Prevent cursor from moving to start of input

    if (historyIndex > 0) {
      historyIndex--
      commandInput.value = commandHistory[historyIndex]

      // Move cursor to end of input
      setTimeout(() => {
        commandInput.selectionStart = commandInput.selectionEnd = commandInput.value.length
      }, 0)
    }
  }

  // Down arrow key - navigate to next command
  else if (e.key === 'ArrowDown') {
    e.preventDefault() // Prevent cursor from moving to end of input

    if (historyIndex < commandHistory.length - 1) {
      historyIndex++
      commandInput.value = commandHistory[historyIndex]
    } else {
      // Clear input if we're at the end of history
      historyIndex = commandHistory.length
      commandInput.value = ''
    }
  }
})

// Track current command execution
let currentCommandElement = null

// Listen for command output from server
onCommandOutput(({ error, output, complete }) => {
  // If this is a new command output or a completion message
  if (complete || !currentCommandElement) {
    if (error) {
      appendToOutput(output, 'error')
    } else {
      appendToOutput(output, 'success')
    }

    // Reset current command element if command is complete
    if (complete) {
      currentCommandElement = null
    }
  } else {
    // Update existing output for streaming data
    if (error) {
      updateOutput(output, 'error')
    } else {
      updateOutput(output, 'success')
    }
  }
})

// Function to append text to the output element
function appendToOutput(text, type) {
  const element = document.createElement('div')
  element.classList.add('output-line')
  element.classList.add(type)
  element.textContent = text
  outputElement.appendChild(element)

  // Store reference to current element for streaming updates
  if (type === 'success' || type === 'error') {
    currentCommandElement = element
  }

  // Auto-scroll to bottom
  outputElement.scrollTop = outputElement.scrollHeight

  return element
}

// Function to update existing output (for streaming)
function updateOutput(text, type) {
  if (!currentCommandElement) {
    return appendToOutput(text, type)
  }

  // Append the new text to the existing element
  currentCommandElement.textContent += text

  // Auto-scroll to bottom
  outputElement.scrollTop = outputElement.scrollHeight
}

// Add initial messages
appendToOutput('WebSocket Terminal Ready. Enter a command to begin.', 'info')
appendToOutput('Type "help" for available commands.', 'info')
