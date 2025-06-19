<?php

header('Content-Type: application/json');

$userDbFile = 'db/users.json';


if (!is_dir('db')) mkdir('db', 0755, true);
if (!file_exists($userDbFile)) file_put_contents($userDbFile, '[]');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не дозволений']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username'], $data['email'], $data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'будь ласка, надайте username, email та password']);
    exit;
}

$users = json_decode(file_get_contents($userDbFile), true);


foreach ($users as $user) {
    if ($user['username'] === $data['username']) {
        http_response_code(409);
        echo json_encode(['error' => 'Користувач з таким іменем вже існує.']);
        exit;
    }
    if ($user['email'] === $data['email']) {
        http_response_code(409);
        echo json_encode(['error' => 'Користувач з таким email вже існує.']);
        exit;
    }
}


$newUser = [
    'id' => count($users) + 1,
    'username' => $data['username'],
    'email' => $data['email'],
    'password' => $data['password'],
    'created_at' => date('c') 
];
$users[] = $newUser;

if (file_put_contents($userDbFile, json_encode($users, JSON_PRETTY_PRINT))) {
    echo json_encode(['message' => 'Користувач успішно зареєстрований.', 'user' => $newUser]);
    http_response_code(201);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Не вдалося зберегти користувача. Спробуйте пізніше.']);
}
?>