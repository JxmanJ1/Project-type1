<?php
session_start();
header('Content-Type: application/json');

$userDbFile = 'db/users.json';

if (!file_exists($userDbFile)) {
     http_response_code(500);
     echo json_encode(['error' => 'База даних користувачів не знайдена']);
     exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$password = $data['password'];

$users = json_decode(file_get_contents($userDbFile), true);

foreach ($users as $user) {
    if ($user['email'] === $email && $password === $user['password']) {
        unset($user['password']);
        $_SESSION['user'] = $user;

        echo json_encode([
            'message' => 'Вхід виповнено успішно.',
            'user' => $user
        ]);
        exit;
    }
}

http_response_code(401);
echo json_encode(['error' => 'Невірний email або пароль.']);
?>