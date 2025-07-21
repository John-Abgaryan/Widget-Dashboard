function showAuth() {
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
    loadAuthForms();
}

function showDashboard() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    loadUserLayout(); 
}

function loadAuthForms(showRegister = false) {
    document.getElementById('auth-section').innerHTML = `
        <div class="auth-box">
            <a href="https://github.com/John-Abgaryan" target="_blank" id="github-link-auth" title="View on GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
            </a>
            <button id="theme-toggle-auth">🌙</button>
            ${showRegister ? `
            <h2>Create Account</h2>
            <input id="reg-user" placeholder="Username" autocomplete="username">
            <input id="reg-pass" type="password" placeholder="Password (6+ chars, 1 number)" autocomplete="new-password">
            <button onclick="register(event)">Register</button>
            <button class="switch" onclick="loadAuthForms(false)">Already have an account? Login</button>
            ` : `
            <h2>Welcome Back</h2>
            <input id="login-user" placeholder="Username" autocomplete="username">
            <input id="login-pass" type="password" placeholder="Password" autocomplete="current-password">
            <button onclick="login(event)">Login</button>
            <button class="switch" onclick="loadAuthForms(true)">Don't have an account? Register</button>
            `}
        </div>
    `;
    
    const authThemeToggle = document.getElementById('theme-toggle-auth');
    if (authThemeToggle) {
        const isDark = document.body.classList.contains('dark-theme');
        authThemeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    document.getElementById('theme-toggle-auth').addEventListener('click', () => {
        const current = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
        setTheme(current === 'dark-theme' ? 'light-theme' : 'dark-theme');
    });
}

function login(event) {
    const username = document.getElementById('login-user').value;
    const password = document.getElementById('login-pass').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const loginBtn = event.target;
    const originalText = loginBtn.textContent;
    loginBtn.textContent = 'Logging in...';
    loginBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('action', 'login');
    formData.append('username', username);
    formData.append('password', password);
    
    fetch('auth.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            location.reload(); 
        } else {
            alert(data.error || 'Invalid username or password.');
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
        }
    })
    .catch(err => {
        alert('Login Error: ' + err.message);
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    });
}

function register(event) {
    const username = document.getElementById('reg-user').value;
    const password = document.getElementById('reg-pass').value;
    
    if (!username || !password) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (password.length < 6 || !/\d/.test(password)) {
        alert('Password must be at least 6 characters and include at least 1 number.');
        return;
    }
    
    const registerBtn = event.target;
    const originalText = registerBtn.textContent;
    registerBtn.textContent = 'Registering...';
    registerBtn.disabled = true;
    
    const formData = new FormData();
    formData.append('action', 'register');
    formData.append('username', username);
    formData.append('password', password);
    
    fetch('auth.php', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            location.reload();
        } else {
            alert(data.error || 'Registration failed.');
            registerBtn.textContent = originalText;
            registerBtn.disabled = false;
        }
    })
    .catch(err => {
        alert('Registration Error: ' + err.message);
        registerBtn.textContent = originalText;
        registerBtn.disabled = false;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.isLoggedIn) {
        showDashboard();
    } else {
        showAuth();
    }
});
