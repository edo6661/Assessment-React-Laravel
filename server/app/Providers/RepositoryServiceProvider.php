<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Repositories\Contracts\TodoRepositoryInterface;
use App\Services\Contracts\TodoServiceInterface;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\UserRepository;

use App\Repositories\Eloquent\TodoRepository;
use App\Services\Contracts\AuthServiceInterface;
use App\Services\AuthService;
use App\Services\TodoService;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TodoRepositoryInterface::class, TodoRepository::class);
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);

        $this->app->bind(TodoServiceInterface::class, TodoService::class);
        $this->app->bind(AuthServiceInterface::class, AuthService::class);
    }

    public function boot(): void {}
}
