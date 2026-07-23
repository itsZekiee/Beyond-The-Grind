<?php

return [
    App\Providers\AppServiceProvider::class,
    // Explicitly registered so the 'sanctum' auth driver is always available,
    // even on Vercel serverless where /tmp package-discovery cache may be absent.
    Laravel\Sanctum\SanctumServiceProvider::class,
];
