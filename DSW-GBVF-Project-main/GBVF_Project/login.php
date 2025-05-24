<?php
session_start();

if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    header("location: home.php");
    exit;
}

$username = $password = "";
$username_err = $password_err = $login_err = "";

$conn = new mysqli("localhost", "root", "", "registration_db", 3306);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    if (empty(trim($_POST["username"]))) {
        $username_err = "Please enter your username.";
    } else {
        $username = trim($_POST["username"]);
    }

    if (empty(trim($_POST["password"]))) {
        $password_err = "Please enter your password.";
    } else {
        $password = trim($_POST["password"]);
    }

    if (empty($username_err) && empty($password_err)) {
        $sql = "SELECT id, username, password FROM users WHERE username = ?";
        
        if ($stmt = $conn->prepare($sql)) {
            $stmt->bind_param("s", $param_username);
            $param_username = $username;

            if ($stmt->execute()) {
                $stmt->store_result();

                if ($stmt->num_rows == 1) {
                    $stmt->bind_result($id, $username, $hashed_password);
                    if ($stmt->fetch()) {
                        
                        if (password_verify($password, $hashed_password)) {
                            session_start();
                            $_SESSION["loggedin"] = true;
                            $_SESSION["id"] = $id;
                            $_SESSION["username"] = $username;
                           
                            header("location: home.php");
                            exit;
                        } else {
                            $login_err = "Invalid password.";
                        }
                    }
                } else {
                    $login_err = "No account found with that username.";
                }
            } else {
                $login_err = "Oops! Something went wrong. Please try again later.";
            }
            $stmt->close();
        }
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/loginstyle.css">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
</head>
<body>
    <div class="wrapper">
        <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="post">
            <h1>Login</h1>
            <?php 
            if(!empty($login_err)){
                echo '<div class="alert">' . $login_err . '</div>';
            }        
            ?>
            <div class="input-box">
                <input type="text" name="username" placeholder="Username" required 
                class="<?php echo (!empty($username_err)) ? 'is-invalid' : ''; ?>" value="<?php echo htmlspecialchars($username); ?>">
                <i class='bx bxs-user'></i>
            </div>

            <div class="input-box">
                <input type="password" name="password" placeholder="Password" required 
                class="<?php echo (!empty($password_err)) ? 'is-invalid' : ''; ?>">
                <i class='bx bxs-lock-alt'></i>
            </div>

            <div class="remember-forget">
                 <label><input type="checkbox">Remember Me</label>
                 <a href="#">Forget Password?</a>
            </div>

            <button type="submit" class="btn">Login</button>

            <div class="register-link">
                <p>Don't have an account?
                    <a href="register.php">Register</a>
                </p>
            </div>
        </form>
    </div>
</body>
</html>