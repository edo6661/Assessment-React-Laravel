<?php

namespace Database\Factories;

use App\Models\Todo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TodoFactory extends Factory
{
    protected $model = Todo::class;
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => rtrim(fake()->sentence(rand(3, 6)), '.'),
            'descriptions' => fake()->paragraph(2),
            'is_done' => fake()->boolean(30),
            'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'updated_at' => now(),
        ];
    }
}
