<?php

namespace Database\Seeders;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;
    public function run(): void
    {
        $mainUser = User::factory()->create([
            'name' => 'Edo Developer',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ]);
        Todo::factory(50)->create([
            'user_id' => $mainUser->id,
        ]);
        User::factory(5)
            ->has(Todo::factory()->count(10))
            ->create();
        $this->command->info('Database seeded! Login with test@example.com / password');
    }
}
