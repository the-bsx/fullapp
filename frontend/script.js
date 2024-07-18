const backendUrl = 'http://localhost:3001/api';

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch(`${backendUrl}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        alert('logined')
        localStorage.setItem('token', data.token); // Store token upon successful login
        fetchPosts(); // Example: Fetch posts after login
    } else {
        alert(data.message); // Display error message if login fails
    }
}
async function signup() {
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    const response = await fetch(`${backendUrl}/users/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        alert('Signup successful, please log in.');
    } else {
        alert(data.message);
    }
}

async function fetchPosts() {
    const response = await fetch(`${backendUrl}/posts`);
    const posts = await response.json();

    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.textContent = `${post.username}: ${post.title}`;
        postList.appendChild(listItem);
    });
}

async function createPost() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You need to login first!');
        return;
    }

    const response = await fetch(`${backendUrl}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        alert('Post created successfully');
        fetchPosts();
    } else {
        alert(data.message);
    }
}

// Fetch posts when the page loads
fetchPosts();
