<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
use Illuminate\Support\Facades\DB;

$tables = DB::select("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
foreach ($tables as $table) {
    $name = $table->tablename;
    if (!in_array($name, ['users', 'migrations', 'password_reset_tokens', 'sessions'])) {
        try {
            DB::statement("TRUNCATE TABLE \"$name\" RESTART IDENTITY CASCADE");
            echo "Truncated $name\n";
        } catch (\Exception $e) {
            echo "Error truncating $name: " . $e->getMessage() . "\n";
        }
    }
}
