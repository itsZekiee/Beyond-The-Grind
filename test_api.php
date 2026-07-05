<?php
$ch = curl_init('http://127.0.0.1:8000/api/cafes');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['title'=>'Test', 'name'=>'Test', 'type'=>'Cafe', 'review'=>'Test']));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json', 'Accept: application/json']);
echo curl_exec($ch);
