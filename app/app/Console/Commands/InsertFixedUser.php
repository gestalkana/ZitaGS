<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;

class InsertFixedUser extends Command
{
    protected $signature = 'app:create-user';
    protected $description = 'Insère un utilisateur avec des informations prédéfinies';

    public function handle()
    {
        $email = 'gestalkana@gmail.com';

        if (User::where('email', $email)->exists()) {
            $this->error("Un utilisateur avec l'email {$email} existe déjà.");
            return 1;
        }

        User::create([
            'name'              => 'Gabriel',
            'email'             => $email,
            'email_verified_at' => Carbon::now(),
            'password'          => '$2y$12$VHp91KWoKBVm8WxbTACise2SL4bff5t.hLv7JtouW2y7FF5EjDzO6',
            'remember_token'    => null,
            'created_at'        => Carbon::now(),
            'updated_at'        => Carbon::now(),
        ]);

        $this->info("Utilisateur Gabriel inséré avec succès !");
        return 0;
    }
}
