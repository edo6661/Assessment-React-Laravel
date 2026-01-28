<?php

namespace App\Services\Contracts;

use App\Models\Todo;
use Illuminate\Contracts\Pagination\CursorPaginator;

interface TodoServiceInterface
{
    public function getUserTodos(int $userId, int $perPage = 15): CursorPaginator;
    public function createTodo(array $data, int $userId): Todo;

    public function updateTodo(int $id, array $data, int $userId): ?Todo;
    public function deleteTodo(int $id, int $userId): bool;
    public function getTodoDetail(int $id, int $userId): ?Todo;
}
