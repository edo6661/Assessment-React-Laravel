<?php

namespace App\Services;

use App\Repositories\Contracts\TodoRepositoryInterface;
use App\Services\Contracts\TodoServiceInterface;
use App\Models\Todo;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class TodoService implements TodoServiceInterface
{
    public function __construct(
        protected TodoRepositoryInterface $todoRepository
    ) {}

    public function getUserTodos(int $userId, int $perPage = 15): CursorPaginator
    {
        return $this->todoRepository->getAllByUser($userId, $perPage);
    }

    public function getTodoDetail(int $id, int $userId): ?Todo
    {
        $todo = $this->todoRepository->findById($id);

        if (!$todo) {
            return null;
        }


        if ($todo->user_id !== $userId) {


            return null;
        }

        return $todo;
    }

    public function createTodo(array $data, int $userId): Todo
    {
        $data['user_id'] = $userId;
        return $this->todoRepository->create($data);
    }

    public function updateTodo(int $id, array $data, int $userId): ?Todo
    {
        $todo = $this->todoRepository->findById($id);


        if (!$todo || $todo->user_id !== $userId) {
            return null;
        }

        $this->todoRepository->update($todo, $data);
        return $todo->refresh();
    }

    public function deleteTodo(int $id, int $userId): bool
    {
        $todo = $this->todoRepository->findById($id);

        if (!$todo || $todo->user_id !== $userId) {
            return false;
        }

        return $this->todoRepository->delete($todo);
    }
}
