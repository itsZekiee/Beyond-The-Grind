<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Console\Kernel;

$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

try {
    \Illuminate\Support\Facades\DB::connection()->getPdo();
    echo "Connected successfully to " . \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
} catch (\Exception $e) {
    echo "Connection failed: " . $e->getMessage();
}
