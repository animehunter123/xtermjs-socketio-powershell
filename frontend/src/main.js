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

// Handle form submission
commandForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const command = commandInput.value.trim()
  if (!command) return

  // Add command to output
  appendToOutput(`$ ${command}`, 'command')

  // Send command to server
  executeCommand(command)

  // Clear input
  commandInput.value = ''
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

// Add initial message
appendToOutput('WebSocket Terminal Ready. Enter a command to begin.', 'info')
