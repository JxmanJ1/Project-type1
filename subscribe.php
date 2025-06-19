<?php

header('Content-Type: application/json');

$subscribersDbFile = 'db/subscribers.json';

if (!is_dir('db')) mkdir('db', 0755, true);
if (!file_exists($subscribersDbFile)) file_put_contents($subscribersDbFile, '[]');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не дозволений.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Будь ласка, надайте коректний email.']);
    exit;
}

$subscribers = json_decode(file_get_contents($subscribersDbFile), true);

foreach ($subscribers as $subscriber) {
    if ($subscriber['email'] === $email) {
        http_response_code(409);
        echo json_encode(['message' => 'Цей email вже підписаний на новини.']);
        exit;
    }
}

$newSubscriber = [
    'id' => count($subscribers) + 1,
    'email' => $email,
    'subscribed_at' => date('c')
];
$subscribers[] = $newSubscriber;

if (file_put_contents($subscribersDbFile, json_encode($subscribers, JSON_PRETTY_PRINT))) {
    http_response_code(201);
    echo json_encode(['message' => 'Підписка на новини успішно оформлена.', 'subscriber' => $newSubscriber]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Не вдалося зберегти підписку. Спробуйте пізніше.']);
}
?>