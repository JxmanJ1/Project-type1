<?php
header('Content-Type: application/json');
$matchesFile = 'db/matches.json';

if (file_exists($matchesFile)) {
    echo file_get_contents($matchesFile);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Файл матчів не знайдено']);
}
?>