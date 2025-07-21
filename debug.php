<?php
echo "<h1>PHP Test</h1>";
echo "<p>Current time: " . date('Y-m-d H:i:s') . "</p>";
echo "<p>Session test: ";
session_start();
echo "Session ID: " . session_id() . "</p>";

echo "<h2>File Test</h2>";
echo "<p>CSS file exists: " . (file_exists('css/styles.css') ? 'YES' : 'NO') . "</p>";
echo "<p>JS files exist:</p>";
echo "<ul>";
echo "<li>whiteboard.js: " . (file_exists('js/whiteboard.js') ? 'YES' : 'NO') . "</li>";
echo "<li>widgets.js: " . (file_exists('js/widgets.js') ? 'YES' : 'NO') . "</li>";
echo "<li>auth.js: " . (file_exists('js/auth.js') ? 'YES' : 'NO') . "</li>";
echo "<li>app.js: " . (file_exists('js/app.js') ? 'YES' : 'NO') . "</li>";
echo "</ul>";

echo "<h2>Variables Test</h2>";
$isLoggedIn = isset($_SESSION['user_id']);
$username = $_SESSION['username'] ?? '';
echo "<p>isLoggedIn: " . ($isLoggedIn ? 'true' : 'false') . "</p>";
echo "<p>username: '" . htmlspecialchars($username) . "'</p>";

echo "<p><a href='index.php'>Back to main page</a></p>";
?>
