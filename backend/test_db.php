<?php
$regions = [
    'ap-southeast-1',
    'us-east-1',
    'us-west-1',
    'eu-central-1',
    'eu-west-1'
];
$port = 5432;
$db = 'postgres';
$user = 'postgres.kaflvuktgajmdfuwvocp';
$pass = 'beyond-the-grind-002';

foreach ($regions as $region) {
    $host = "aws-0-$region.pooler.supabase.com";
    try {
        echo "Trying $host...\n";
        $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$db", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_TIMEOUT => 2]);
        echo "SUCCESS! Connected to Supabase pooler on $region!\n";
        break;
    } catch (PDOException $e) {
        echo "FAILED: " . $e->getMessage() . "\n";
    }
}
