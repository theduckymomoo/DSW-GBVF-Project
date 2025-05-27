        <?php
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header('Content-Type: application/json');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        $servername = "localhost";
        $username_db = "root";
        $password_db = "Qwerty123";      
        $dbname = "safehaven_chat_db";

        $conn = new mysqli($servername, $username_db, $password_db, $dbname);

        if ($conn->connect_error) {
            echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
            exit();
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);

            $session_id = isset($data['chatSessionId']) ? $data['chatSessionId'] : null;
            $sender = isset($data['sender']) ? $data['sender'] : null;
            $message_content = isset($data['messageContent']) ? $data['messageContent'] : null;
            $counselor_name = isset($data['counselorName']) ? $data['counselorName'] : null;
            $user_username = isset($data['username']) ? $data['username'] : null;

            if (!$session_id || !$sender || !$message_content || !$user_username) {
                echo json_encode(['status' => 'error', 'message' => 'Missing required fields (chatSessionId, sender, messageContent, username).']);
                exit();
            }

            $stmt = $conn->prepare("INSERT INTO chat_messages (session_id, username, sender, message_content, counselor_name) VALUES (?, ?, ?, ?, ?)");
            if ($stmt === false) {
                echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->error]);
                exit();
            }

            $stmt->bind_param("sssss", $session_id, $user_username, $sender, $message_content, $counselor_name);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Message saved successfully', 'id' => $stmt->insert_id]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Error saving message: ' . $stmt->error]);
            }

            $stmt->close();
        }

        elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $session_id = isset($_GET['session_id']) ? $_GET['session_id'] : null;
            $user_username = isset($_GET['username']) ? $_GET['username'] : null;

            if (!$session_id || !$user_username) {
                echo json_encode(['status' => 'error', 'message' => 'Session ID and Username are required for GET requests.']);
                exit();
            }

            $stmt = $conn->prepare("SELECT sender, message_content, timestamp, counselor_name FROM chat_messages WHERE session_id = ? AND username = ? ORDER BY timestamp ASC");
            if ($stmt === false) {
                echo json_encode(['status' => 'error', 'message' => 'Failed to prepare statement: ' . $conn->error]);
                exit();
            }

            $stmt->bind_param("ss", $session_id, $user_username);
            $stmt->execute();
            $result = $stmt->get_result();

            $messages = [];
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $messages[] = $row;
                }
            }
            echo json_encode(['status' => 'success', 'messages' => $messages]);

            $stmt->close();
        }

        else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Only GET and POST are supported.']);
        }

        $conn->close();
        ?>
        