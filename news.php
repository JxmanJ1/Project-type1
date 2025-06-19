<?php
header('Content-Type: application/json');
$newsFile = 'db/news.json';

if (file_exists($newsFile)) {
    echo file_get_contents($newsFile);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Файл новин не знайдено']);
}
?>