<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Contracts\TodoServiceInterface;
use App\Http\Requests\Todo\StoreTodoRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function __construct(
        protected TodoServiceInterface $todoService
    ) {}
    public function index(Request $request)
    {
        $perPage = $request->input('limit', 15);
        $todos = $this->todoService->getUserTodos(auth()->id(), (int) $perPage);
        return TodoResource::collection($todos);
    }
    public function store(StoreTodoRequest $request): JsonResponse
    {
        $todo = $this->todoService->createTodo($request->validated(), auth()->id());
        return response()->json(new TodoResource($todo), 201);
    }
    public function show(string $id): JsonResponse
    {
        $todo = $this->todoService->getTodoDetail((int) $id, auth()->id());
        if (!$todo) {
            return response()->json(['message' => 'Todo not found'], 404);
        }
        return response()->json(new TodoResource($todo));
    }
    public function update(UpdateTodoRequest $request, string $id): JsonResponse
    {
        $todo = $this->todoService->updateTodo(
            (int) $id,
            $request->validated(),
            auth()->id()
        );
        if (!$todo) {
            return response()->json(['message' => 'Todo not found or access denied'], 404);
        }
        return response()->json([
            'message' => 'Todo updated successfully',
            'data' => new TodoResource($todo)
        ]);
    }
    public function destroy(string $id): JsonResponse
    {
        $deleted = $this->todoService->deleteTodo((int) $id, auth()->id());
        if (!$deleted) {
            return response()->json(['message' => 'Todo not found or access denied'], 404);
        }
        return response()->json(['message' => 'Todo deleted successfully']);
    }
}
