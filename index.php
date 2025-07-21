<?php
session_start();
$isLoggedIn = isset($_SESSION['user_id']);
$username = $_SESSION['username'] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Widget Dashboard</title>
    <link rel="icon" type="image/x-icon" href="favicon.svg">
    <link rel="stylesheet" href="css/styles.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="light-theme">
    <div class="bg-image"></div>

    <div id="auth-section" <?php echo $isLoggedIn ? 'style="display: none;"' : ''; ?>>
    </div>

    
    <div id="dashboard" <?php echo $isLoggedIn ? '' : 'style="display: none;"'; ?>>
        <div class="top-bar">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <h1>Widget Dashboard</h1>
                <?php if ($isLoggedIn): ?>
                    <span class="user-welcome">Welcome, <?php echo htmlspecialchars($username); ?>!</span>
                <?php endif; ?>
                <a href="https://github.com/John-Abgaryan" target="_blank" id="github-link" title="View on GitHub">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                </a>
            </div>
            <div class="top-bar-controls">
                <button id="panel-toggle">Widgets</button>
                <button id="save-layout">Save</button>
                <button id="theme-toggle">🌙</button>
                <button id="controls-btn">Controls</button>
                <button id="logout-btn">Logout</button>
            </div>
        </div>

        <div id="widget-panel" class="widget-panel">
            <h3>Drag Widgets to Canvas</h3>
            <div class="widget-grid">
                <div class="widget-btn" draggable="true" data-type="chart">📊 Chart</div>
                <div class="widget-btn" draggable="true" data-type="table">📋 Table</div>
                <div class="widget-btn" draggable="true" data-type="text">📝 Text</div>
                <div class="widget-btn" draggable="true" data-type="image">🖼️ Image</div>
                <div class="widget-btn" draggable="true" data-type="video">🎥 Video</div>
                <div class="widget-btn" draggable="true" data-type="clock">🕐 Clock</div>
                <div class="widget-btn" draggable="true" data-type="weather">🌤️ Weather</div>
                <div class="widget-btn" draggable="true" data-type="news">📰 News</div>
            </div>
            <div class="widget-panel-footer">
                <button id="clear-widgets" class="clear-all-btn">🗑️ Clear All</button>
            </div>
        </div>

        <div class="whiteboard-container">
            <div id="whiteboard">
                <div class="whiteboard-grid"></div>
            </div>
        </div>

        <div class="zoom-controls">
            <button class="zoom-btn" id="zoom-in">+</button>
            <button class="zoom-btn" id="zoom-out">−</button>
            <button class="zoom-btn" id="reset-view">⌂</button>
        </div>
    </div>

    <div id="controls-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <h2>Keyboard Shortcuts</h2>
            <div class="controls-list">
                <div class="control-item">
                    <span class="key">W</span>
                    <span class="description">Toggle Widget Panel</span>
                </div>
                <div class="control-item">
                    <span class="key">S</span>
                    <span class="description">Save Layout</span>
                </div>
                <div class="control-item">
                    <span class="key">L</span>
                    <span class="description">Toggle Theme (Light/Dark)</span>
                </div>
                <div class="control-item">
                    <span class="key">Ctrl + R</span>
                    <span class="description">Reset View</span>
                </div>
                <div class="control-item">
                    <span class="key">Escape</span>
                    <span class="description">Close Widget Panel</span>
                </div>
            </div>
            <p class="modal-note">Click anywhere outside this box to close</p>
        </div>
    </div>

    <script>
        window.isLoggedIn = <?php echo json_encode($isLoggedIn); ?>;
        window.username = <?php echo json_encode($username); ?>;
    </script>
    <script src="js/whiteboard.js"></script>
    <script src="js/widgets.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/app.js"></script>
</body>
</html>
