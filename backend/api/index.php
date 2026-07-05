<?php
// Ensure Laravel uses the writable /tmp directory on Vercel for logs and compiled views
putenv('APP_STORAGE=/tmp');
$_ENV['APP_STORAGE'] = '/tmp';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->useStoragePath('/tmp');

require __DIR__ . '/../public/index.php';
