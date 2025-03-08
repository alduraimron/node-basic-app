document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const userForm = document.getElementById('userForm');
    const userList = document.getElementById('userList');
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Load users when page loads
    loadUsers();
    
    // Add event listeners
    userForm.addEventListener('submit', addUser);
    refreshBtn.addEventListener('click', loadUsers);
    
    // Function to load users
    function loadUsers() {
        fetch('/users')
            .then(response => response.json())
            .then(users => {
                // Clear existing list
                userList.innerHTML = '';
                
                // Add each user to the table
                users.forEach(user => {
                    const row = document.createElement('tr');
                    
                    // Format date
                    const createdAt = new Date(user.created_at).toLocaleString();
                    
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${createdAt}</td>
                    `;
                    
                    userList.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error loading users:', error);
                alert('Failed to load users. Please try again.');
            });
    }
    
    // Function to add a new user
    function addUser(e) {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        // Send POST request
        fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add user');
            }
            return response.json();
        })
        .then(newUser => {
            // Reset form
            userForm.reset();
            
            // Reload users
            loadUsers();
            
            // Show success message
            alert(`User ${newUser.name} added successfully!`);
        })
        .catch(error => {
            console.error('Error adding user:', error);
            alert('Failed to add user. Please try again.');
        });
    }
});