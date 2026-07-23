<?php
// Ensure Laravel uses the writable /tmp directory on Vercel for logs and compiled views
putenv('APP_STORAGE=/tmp');
$_ENV['APP_STORAGE'] = '/tmp';

// Tell Laravel to cache packages, services, and configs in the writable /tmp directory!
putenv('APP_SERVICES_CACHE=/tmp/bootstrap/cache/services.php');
$_ENV['APP_SERVICES_CACHE'] = '/tmp/bootstrap/cache/services.php';
putenv('APP_PACKAGES_CACHE=/tmp/bootstrap/cache/packages.php');
$_ENV['APP_PACKAGES_CACHE'] = '/tmp/bootstrap/cache/packages.php';
putenv('APP_CONFIG_CACHE=/tmp/bootstrap/cache/config.php');
$_ENV['APP_CONFIG_CACHE'] = '/tmp/bootstrap/cache/config.php';
putenv('APP_ROUTES_CACHE=/tmp/bootstrap/cache/routes-v7.php');
$_ENV['APP_ROUTES_CACHE'] = '/tmp/bootstrap/cache/routes-v7.php';
putenv('APP_EVENTS_CACHE=/tmp/bootstrap/cache/events.php');
$_ENV['APP_EVENTS_CACHE'] = '/tmp/bootstrap/cache/events.php';

// Create required storage directories in /tmp
$dirs = ['/tmp/logs', '/tmp/framework/views', '/tmp/framework/cache', '/tmp/framework/sessions', '/tmp/bootstrap/cache'];
foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0777, true);
    }
}

// Remove stale package/service discovery caches from /tmp so that
// SanctumServiceProvider is always discovered fresh on each cold start.
// This prevents "Auth driver [sanctum] not defined" on Vercel serverless.
$staleCaches = [
    '/tmp/bootstrap/cache/packages.php',
    '/tmp/bootstrap/cache/services.php',
];
foreach ($staleCaches as $cache) {
    if (file_exists($cache)) {
        @unlink($cache);
    }
}

require __DIR__ . '/../public/index.php';
