<?php

namespace App\Repositories\Contracts;

use App\Models\Todo;
use Illuminate\Contracts\Pagination\CursorPaginator;

interface TodoRepositoryInterface
{

    public function getAllByUser(int $userId, int $perPage = 15): CursorPaginator;

    public function findById(int $id): ?Todo;
    public function create(array $data): Todo;
    public function update(Todo $todo, array $data): bool;
    public function delete(Todo $todo): bool;
}
