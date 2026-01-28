<?php

namespace App\Repositories\Eloquent;

use App\Models\Todo;
use App\Repositories\Contracts\TodoRepositoryInterface;
use Illuminate\Contracts\Pagination\CursorPaginator;

class TodoRepository implements TodoRepositoryInterface
{
    public function getAllByUser(int $userId, int $perPage = 15): CursorPaginator
    {
        return Todo::where('user_id', $userId)
            ->latest()
            ->cursorPaginate($perPage);
    }

    public function findById(int $id): ?Todo
    {
        return Todo::find($id);
    }

    public function create(array $data): Todo
    {
        return Todo::create($data);
    }

    public function update(Todo $todo, array $data): bool
    {
        return $todo->update($data);
    }

    public function delete(Todo $todo): bool
    {
        return $todo->delete();
    }
}
