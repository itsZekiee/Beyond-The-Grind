<?php
// Ensure Laravel uses the writable /tmp directory on Vercel for logs and compiled views
putenv('APP_STORAGE=/tmp');
$_ENV['APP_STORAGE'] = '/tmp';

// Create required storage directories in /tmp
$dirs = ['/tmp/logs', '/tmp/framework/views', '/tmp/framework/cache', '/tmp/framework/sessions', '/tmp/bootstrap/cache'];
foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
}

// Let PHP output ALL errors directly to the browser
ini_set('display_errors', '1');
error_reporting(E_ALL);

require __DIR__ . '/../public/index.php';
