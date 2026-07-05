<?php
// Ensure Laravel uses the writable /tmp directory on Vercel for logs and compiled views
putenv('APP_STORAGE=/tmp');
$_ENV['APP_STORAGE'] = '/tmp';

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE, E_USER_ERROR])) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['message' => 'Fatal PHP Error', 'error' => $error]);
        exit;
    }
});

$app = require __DIR__ . '/../bootstrap/app.php';
$app->useStoragePath('/tmp');

require __DIR__ . '/../public/index.php';
