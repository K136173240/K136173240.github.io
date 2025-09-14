<?php
session_start();

// Si l'utilisateur est déjà connecté, rediriger vers le dashboard
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
}

include 'config/database.php';

$error = '';

if ($_POST) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    if (empty($username) || empty($password)) {
        $error = 'Veuillez remplir tous les champs';
    } else {
        // Vérifier les identifiants
        $user = fetchOne($pdo, "SELECT * FROM users WHERE username = ? AND is_active = 1", [$username]);
        
        if ($user && password_verify($password, $user['password'])) {
            // Connexion réussie
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['first_name'] = $user['first_name'];
            $_SESSION['last_name'] = $user['last_name'];
            $_SESSION['role'] = $user['role'];
            
            header('Location: index.php');
            exit();
        } else {
            $error = 'Identifiants incorrects';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connexion - Mecanica</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 1rem;
        }
        
        .login-card {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            width: 100%;
            max-width: 400px;
        }
        
        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .login-logo {
            font-size: 3rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .login-title {
            font-size: 1.5rem;
            color: var(--text-primary);
            margin-bottom: 0.5rem;
        }
        
        .login-subtitle {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
            font-weight: 500;
        }
        
        .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            font-size: 1rem;
            transition: border-color 0.2s ease;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        .login-btn {
            width: 100%;
            padding: 0.75rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }
        
        .login-btn:hover {
            background: var(--primary-dark);
        }
        
        .error-message {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger-color);
            padding: 0.75rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 0.9rem;
        }
        
        .demo-info {
            margin-top: 2rem;
            padding: 1rem;
            background: var(--background-color);
            border-radius: 0.5rem;
            font-size: 0.85rem;
            color: var(--text-secondary);
        }
        
        .demo-info strong {
            color: var(--text-primary);
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <div class="login-logo">
                    <i class="fas fa-wrench"></i>
                </div>
                <h1 class="login-title">Mecanica</h1>
                <p class="login-subtitle">Gestion de garage automobile</p>
            </div>
            
            <?php if ($error): ?>
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <?php echo htmlspecialchars($error); ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <div class="form-group">
                    <label for="username" class="form-label">
                        <i class="fas fa-user"></i> Nom d'utilisateur
                    </label>
                    <input type="text" id="username" name="username" class="form-input" 
                           value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>" 
                           required autocomplete="username">
                </div>
                
                <div class="form-group">
                    <label for="password" class="form-label">
                        <i class="fas fa-lock"></i> Mot de passe
                    </label>
                    <input type="password" id="password" name="password" class="form-input" 
                           required autocomplete="current-password">
                </div>
                
                <button type="submit" class="login-btn">
                    <i class="fas fa-sign-in-alt"></i> Se connecter
                </button>
            </form>
            
            <div class="demo-info">
                <strong>Compte de démonstration :</strong><br>
                Nom d'utilisateur : <strong>admin</strong><br>
                Mot de passe : <strong>password</strong>
            </div>
        </div>
    </div>
</body>
</html>
