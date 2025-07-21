<?php
session_start();
require_once 'config/database.php';

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    
    switch ($action) {
        case 'login':
            $username = trim($_POST['username'] ?? '');
            $password = $_POST['password'] ?? '';
            
            if (empty($username) || empty($password)) {
                $response['message'] = 'Please fill in all fields';
                break;
            }
            
            try {
                $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ?");
                $stmt->execute([$username]);
                $user = $stmt->fetch();
                
                if ($user && password_verify($password, $user['password'])) {
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];
                    $response['success'] = true;
                    $response['message'] = 'Login successful';
                } else {
                    $response['message'] = 'Invalid credentials';
                }
            } catch(PDOException $e) {
                $response['message'] = 'Database error: ' . $e->getMessage();
            }
            break;
            
        case 'register':
            $username = trim($_POST['username'] ?? '');
            $password = $_POST['password'] ?? '';
            
            if (empty($username) || empty($password)) {
                $response['message'] = 'Please fill in all fields';
                break;
            }
            
            if (strlen($password) < 6 || !preg_match('/\d/', $password)) {
                $response['message'] = 'Password must be at least 6 characters with at least 1 number';
                break;
            }
            
            try {
                $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ?");
                $stmt->execute([$username]);
                if ($stmt->fetch()) {
                    $response['message'] = 'Username already exists';
                    break;
                }
                
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
                $stmt->execute([$username, $hashedPassword]);
                
                $response['success'] = true;
                $response['message'] = 'Registration successful! You can now login.';
            } catch(PDOException $e) {
                $response['message'] = 'Registration failed: ' . $e->getMessage();
            }
            break;
            
        case 'logout':
            session_destroy();
            $response['success'] = true;
            $response['message'] = 'Logged out successfully';
            break;
            
        case 'save_layout':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'error' => 'User not logged in.']);
                exit;
            }
            if (empty($_POST['layout'])) {
                echo json_encode(['success' => false, 'error' => 'No layout data received.']);
                exit;
            }
        
            $user_id = $_SESSION['user_id'];
            $layout_data = $_POST['layout'];
        
            $stmt = $pdo->prepare("REPLACE INTO dashboard_layouts (user_id, layout_data) VALUES (?, ?)");
            
            if ($stmt->execute([$user_id, $layout_data])) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Database operation failed.', 'details' => $stmt->errorInfo()]);
            }
            exit;
        
        case 'load_layout':
            if (!isset($_SESSION['user_id'])) {
                echo json_encode(['success' => false, 'error' => 'User not logged in.']);
                exit;
            }
        
            $user_id = $_SESSION['user_id'];
            $stmt = $pdo->prepare("SELECT layout_data FROM dashboard_layouts WHERE user_id = ?");
            $stmt->execute([$user_id]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if ($result) {
                echo json_encode(['success' => true, 'layout' => $result['layout_data']]);
            } else {
                echo json_encode(['success' => true, 'layout' => null]);
            }
            exit;
            
        default:
            $response['message'] = 'Invalid action';
            break;
    }
    
    echo json_encode($response);
}
?>
