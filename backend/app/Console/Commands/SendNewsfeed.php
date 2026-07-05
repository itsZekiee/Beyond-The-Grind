<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Cafe;
use App\Mail\NewsfeedEmail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendNewsfeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'emails:newsfeed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send weekly newsfeed to subscribed users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $featuredCafes = Cafe::where('is_published', true)
                             ->where('is_featured', true)
                             ->latest()
                             ->take(5)
                             ->get();

        if ($featuredCafes->isEmpty()) {
            $this->info('No featured cafes to send.');
            return;
        }

        $users = User::where('receives_newsfeed', true)->get();

        foreach ($users as $user) {
            Mail::to($user->email)->send(new NewsfeedEmail($featuredCafes));
            $this->info("Sent newsfeed to {$user->email}");
        }

        $this->info('Newsfeed emails sent successfully.');
    }
}
