// Hold items in an array (this is your single source of truth)
let items = [];

// Select necessary DOM elements
const form = document.getElementById('add-form');
const input = document.getElementById('name');
const list = document.getElementById('list');
const count = document.getElementById('count');

// Write a render() function to rebuild the list from the array
function render() {
    // Clear the current list
    list.innerHTML = '';
    
    // Loop through the items array
    items.forEach(item => {
        // Create list item
        const li = document.createElement('li');
        li.dataset.id = item.id;
        
        // Add 'done' class if item is bought
        if (item.done) {
            li.classList.add('done');
        }
        
        // Create item name span
        const span = document.createElement('span');
        span.textContent = item.name;
        
        // Create toggle button (Buy/Undo)
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = item.done ? 'Undo' : 'Buy';
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Remove';
        
        // Assemble the list item
        li.appendChild(span);
        li.appendChild(toggleBtn);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    });
    
    // Update the live count paragraph
    count.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;
}

// Handle form submission
form.addEventListener('submit', function(e) {
    // Prevent page reload
    e.preventDefault();
    
    // Read and validate the input
    const name = input.value.trim();
    
    if (name === '') {
        alert('Please enter an item name');
        return;
    }
    
    // Push a new object to the items array
    items.push({
        id: Date.now(),
        name: name,
        done: false
    });
    
    // Clear input field
    input.value = '';
    
    // Re-render the list
    render();
});

// Set up event delegation on the #list
list.addEventListener('click', function(e) {
    // Find the clicked list item using closest()
    const li = e.target.closest('li');
    if (!li) return;
    
    // Get the item id from data-id attribute
    const id = parseInt(li.dataset.id);
    
    // Find the corresponding item in the array
    const item = items.find(item => item.id === id);
    if (!item) return;
    
    // Determine if the user is toggling ".done" or removing a row
    const buttonText = e.target.textContent;
    
    if (buttonText === 'Buy' || buttonText === 'Undo') {
        // Toggle the done status
        item.done = !item.done;
        render();
    } else if (buttonText === 'Remove') {
        // Remove the item from the array
        items = items.filter(item => item.id !== id);
        render();
    }
});

// Initial render to show empty state
render();