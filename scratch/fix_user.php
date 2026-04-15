<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'okta@mail.com')->first();
if ($user) {
    $user->wilayah_id = 9; // RW 30
    $user->save();
    echo "User Okta (Sie Pemberdayaan) updated with wilayah_id 9 (RW 30)\n";
} else {
    echo "User Okta not found\n";
}
