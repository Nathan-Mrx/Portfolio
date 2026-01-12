<?php
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'message' => 'PHP is working',
    'sapi' => php_sapi_name(),
    'REQUEST_URI' => $_SERVER['REQUEST_URI'] ?? 'null',
    'SCRIPT_FILENAME' => $_SERVER['SCRIPT_FILENAME'] ?? 'null',
    'SCRIPT_NAME' => $_SERVER['SCRIPT_NAME'] ?? 'null',
    'PHP_SELF' => $_SERVER['PHP_SELF'] ?? 'null',
]);
