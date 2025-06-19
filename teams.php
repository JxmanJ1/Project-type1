<?php
header('Content-Type: application/json');
$teamsFile = 'db/teams.json';

if (file_exists($teamsFile)) {
    echo file_get_contents($teamsFile);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Файл команд не знайдено']);
}
?>