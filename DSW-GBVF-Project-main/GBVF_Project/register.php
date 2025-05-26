<?php
session_start();

$host = 'localhost';
$db = 'registration_db';
$user = 'root';
$pass = 'Qwerty123';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$error = "";
$success = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $conn->real_escape_string($_POST["username"]);
    $name = $conn->real_escape_string($_POST["name"]);
    $surname = $conn->real_escape_string($_POST["surname"]);
    $email = $conn->real_escape_string($_POST["email"]);
    $phone = $conn->real_escape_string($_POST["phone"]);
    $address = $conn->real_escape_string($_POST["address"]);
    $password = $_POST["password"];
    $confirm_password = $_POST["confirm_password"];

    if ($password !== $confirm_password) {
        $error = "Passwords do not match.";
    } else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $check = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $check->bind_param("s", $username);
        $check->execute();
        $check->store_result();

        if ($check->num_rows > 0) {
            $error = "Username already taken.";
        } else {
            $stmt = $conn->prepare("INSERT INTO users (username, name, surname, email, phone, address, password) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssss", $username, $name, $surname, $email, $phone, $address, $hashed_password);
            $stmt->execute();
            $user_id = $stmt->insert_id;
            $stmt->close();

            if (isset($_POST["contact_name"]) && is_array($_POST["contact_name"])) {
                $stmt = $conn->prepare("INSERT INTO emergency_contacts (user_id, contact_name, contact_phone, relationship) VALUES (?, ?, ?, ?)");
                for ($i = 0; $i < count($_POST["contact_name"]); $i++) {
                    $contact_name = $conn->real_escape_string($_POST["contact_name"][$i]);
                    $contact_phone = $conn->real_escape_string($_POST["contact_phone"][$i]);
                    $relationship = $conn->real_escape_string($_POST["relationship"][$i]);
                    if (!empty($contact_name) && !empty($contact_phone)) {
                        $stmt->bind_param("isss", $user_id, $contact_name, $contact_phone, $relationship);
                        $stmt->execute();
                    }
                }
                $stmt->close();
            }

            $success = true;
        }
        $check->close();
    }

    $conn->close();
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
    <link rel="stylesheet" href="css/register_style.css">
</head>
<body>
    <div id="spotlight-background"></div>

    <form method="POST">
        <h2>Register</h2>

        <?php if ($error): ?>
            <p class="error"><?php echo $error; ?></p>
        <?php elseif ($success): ?>
            <p class="success">Registration successful!</p>
            <a href="login.php" class="success-btn">Go to Login</a>
        <?php endif; ?>

        <div class="flex-column">
            <label>First Name</label>
            <div class="inputForm"><input type="text" name="name" required></div>
        </div>

        <div class="flex-column">
            <label>Last Name</label>
            <div class="inputForm"><input type="text" name="surname" required></div>
        </div>

        <div class="flex-column">
            <label>Username</label>
            <div class="inputForm"><input type="text" name="username" required></div>
        </div>

        <div class="flex-column">
            <label>Email</label>
            <div class="inputForm"><input type="email" name="email" required></div>
        </div>

        <div class="flex-column">
            <label>Phone</label>
            <div class="inputForm"><input type="tel" name="phone" required></div>
        </div>

        <div class="flex-column">
            <label>Address</label>
            <div class="inputForm"><input type="text" name="address" required></div>
        </div>

        <div class="flex-column">
            <label>Password</label>
            <div class="inputForm password-wrapper">
                <input type="password" name="password" id="password" required>
                <label class="container">
                    <input type="checkbox" onclick="togglePassword('password')">
                    <div class="checkmark"></div>
                </label>
            </div>
        </div>

        <div class="flex-column">
            <label>Confirm Password</label>
            <div class="inputForm password-wrapper">
                <input type="password" name="confirm_password" id="confirm_password" required>
                <label class="container">
                    <input type="checkbox" onclick="togglePassword('confirm_password')">
                    <div class="checkmark"></div>
                </label>
            </div>
        </div>

        <h3>Emergency Contacts (Up to 3)</h3>
        <div id="emergencyContacts">
            <div class="emergency-contact">
                <div class="flex-column">
                    <label>Contact Name</label>
                    <div class="inputForm"><input type="text" name="contact_name[]"></div>
                </div>
                <div class="flex-column">
                    <label>Relationship</label>
                    <div class="inputForm"><input type="text" name="relationship[]"></div>
                </div>
                <div class="flex-column">
                    <label>Contact Phone</label>
                    <div class="inputForm"><input type="tel" name="contact_phone[]"></div>
                </div>
            </div>
        </div>

        <button type="button" onclick="addContact()">+ Add Another Contact</button><br><br>
        <button type="submit">Register</button>
    </form>

    <script>
    function addContact() {
        const container = document.getElementById('emergencyContacts');
        const count = container.querySelectorAll('.emergency-contact').length;
        if (count >= 3) return;

        const contactHTML = `
            <div class="emergency-contact">
                <div class="flex-column">
                    <label>Contact Name</label>
                    <div class="inputForm"><input type="text" name="contact_name[]"></div>
                </div>
                <div class="flex-column">
                    <label>Relationship</label>
                    <div class="inputForm"><input type="text" name="relationship[]"></div>
                </div>
                <div class="flex-column">
                    <label>Contact Phone</label>
                    <div class="inputForm"><input type="tel" name="contact_phone[]"></div>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', contactHTML);
    }

    function togglePassword(fieldId) {
        const field = document.getElementById(fieldId);
        field.type = field.type === "password" ? "text" : "password";
    }

    </script>
</body>
</html>
