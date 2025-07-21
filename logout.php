<?php
session_start();
session_destroy();
echo "<h1>Logged Out!</h1>";
echo "<p>Session cleared successfully.</p>";
echo "<p><a href='index.php'>Go back to dashboard</a></p>";
?>
