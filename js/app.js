const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme);
    
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark-theme' ? '☀️' : '🌙';
    }
    
    const authThemeToggle = document.getElementById('theme-toggle-auth');
    if (authThemeToggle) {
        authThemeToggle.textContent = theme === 'dark-theme' ? '☀️' : '🌙';
    }
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', function() {
    const current = document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme';
    setTheme(current === 'dark-theme' ? 'light-theme' : 'dark-theme');
});

document.getElementById('logout-btn').addEventListener('click', function() {
    const formData = new FormData();
    formData.append('action', 'logout');
    
    fetch('auth.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('auth-section').style.display = 'flex';
        loadAuthForms(false);
        setTimeout(() => {
            window.location.reload();
        }, 500);
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('auth-section').style.display = 'flex';
        loadAuthForms(false);
    });
});

document.getElementById('save-layout').addEventListener('click', function() {
    const widgets = [];
    document.querySelectorAll('.widget').forEach(widget => {
        const contentElement = widget.querySelector('.widget-content');
        
        if (contentElement) {
            const encodedContent = btoa(unescape(encodeURIComponent(contentElement.innerHTML)));
            
            widgets.push({
                id: widget.id,
                type: widget.dataset.type,
                style: widget.getAttribute('style'),
                content: encodedContent
            });
        } else {
            console.warn('Skipping a widget during save because it has no .widget-content element:', widget);
        }
    });

    const formData = new FormData();
    formData.append('action', 'save_layout');
    formData.append('layout', JSON.stringify(widgets));

    fetch('auth.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Layout saved successfully!');
        } else {
            alert('Failed to save layout: ' + (data.error || 'You might not be logged in.'));
        }
    })
    .catch(err => {
        console.error('Save layout error:', err);
        alert('An error occurred while saving the layout.');
    });
});

function loadUserLayout() {
    if (!window.isLoggedIn) return;

    const formData = new FormData();
    formData.append('action', 'load_layout');

    fetch('auth.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.layout) {
            const whiteboard = document.getElementById('whiteboard');
            whiteboard.querySelectorAll('.widget').forEach(w => w.remove());
            
            const layout = JSON.parse(data.layout);
            if (Array.isArray(layout)) {
                layout.forEach(widgetData => {
                    const widget = createWidgetFromData(widgetData);
                    whiteboard.appendChild(widget);
                });
            }
        }
    })
    .catch(err => console.error('Error loading layout:', err));
}

function applyParallax(e) {
    const bg = document.querySelector('.bg-image');
    const authBox = document.querySelector('.auth-box');

    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    
    if (bg) {
        const angleX = y * 2;
        const angleY = -x * 2;
        bg.style.transform = `translate(${angleY}px, ${angleX}px)`;
    }

    if (authBox) {
        const rotateY = x * 4;
        const rotateX = -y * 5;
        authBox.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`;
    }
}

document.body.addEventListener('mousemove', applyParallax);

window.addEventListener('resize', function() {
    initializeWhiteboard();
});

document.addEventListener('keydown', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
    }
    
    if (e.key === 'Escape') {
        if (controlsModal.style.display === 'flex') {
            e.preventDefault();
            controlsModal.style.display = 'none';
            return;
        } else {
            const widgetPanel = document.getElementById('widget-panel');
            if (widgetPanel) {
                widgetPanel.classList.remove('open');
            }
            return;
        }
    }
    
    if (controlsModal.style.display === 'flex') {
        return;
    }
    
    const key = e.key.toLowerCase();
    
    switch(key) {
        case 'w':
            e.preventDefault();
            document.getElementById('panel-toggle').click();
            break;
        case 's':
            e.preventDefault();
            document.getElementById('save-layout').click();
            break;
        case 'l':
            e.preventDefault();
            document.getElementById('theme-toggle').click();
            break;
        case 'r':
            if (e.ctrlKey) {
                e.preventDefault();
                document.getElementById('reset-view').click();
            }
            break;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light-theme';
    setTheme(savedTheme);

    if (window.isLoggedIn) {
        setTimeout(() => {
            initializeWhiteboard();
            loadUserLayout();
        }, 100);
    } else {
        loadAuthForms(false);
    }
});

const controlsModal = document.getElementById('controls-modal');
const controlsBtn = document.getElementById('controls-btn');

controlsBtn.addEventListener('click', function() {
    controlsModal.style.display = 'flex';
});

controlsModal.addEventListener('click', function(e) {
    if (e.target === controlsModal) {
        controlsModal.style.display = 'none';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && controlsModal.style.display === 'flex') {
        controlsModal.style.display = 'none';
    }
});
