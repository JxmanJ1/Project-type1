<?php
header('Content-Type: application/json');

$apiUrl = 'https://api.steampowered.com/ICSGOServers_730/GetGameServersStatus/v1/?access_token=eyAidHlwIjogIkpXVCIsICJhbGciOiAiRWREU0EiIH0.eyAiaXNzIjogInI6MDAwN18yNjU2QTU4OF82MDJDMyIsICJzdWIiOiAiNzY1NjExOTg4NDQxNjgyMTciLCAiYXVkIjogWyAid2ViOnN0b3JlIiBdLCAiZXhwIjogMTc1MDM5MDQ0OSwgIm5iZiI6IDE3NDE2NjM2NTUsICJpYXQiOiAxNzUwMzAzNjU1LCAianRpIjogIjAwMEZfMjY3QjhGNDNfRTE0NkMiLCAib2F0IjogMTc0ODIwNTAwOCwgInJ0X2V4cCI6IDE3NjYzMDEwMzQsICJwZXIiOiAwLCAiaXBfc3ViamVjdCI6ICI5NS4xNTguNTMuMTY2IiwgImlwX2NvbmZpcm1lciI6ICI5NS4xNTguNTMuMTY2IiB9._M-xcsUMFTtPlPIIJ-pMb-FIpoB3eyv9_3mXbncHZUVQMz1-lFSZiOf77jPAdJoUwbl9pHMIE1_V1BZWXM0sBA';

if (!function_exists('curl_init')) {
    http_response_code(500);
    echo json_encode(['error' => 'Помилка сервера: cURL не установлен.']);
    exit;
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_FAILONERROR, true);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    http_response_code(502);
    echo json_encode(['error' => 'Помилка ' . curl_error($ch)]);
} else {
    echo $response;
}

curl_close($ch);
?>