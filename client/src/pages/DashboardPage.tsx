import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/axios';
import type { Todo, TodoFormValues, TodoListResponse, TodoUpdateResponse } from '../types';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useCallback, useEffect } from 'react';
import TodoModal from '../components/TodoModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { Loader2, Plus, Pencil, Trash2, CheckCircle2, Circle, LogOut, Calendar } from 'lucide-react';

const LoadingSpinner = () => (
  <Loader2 className="animate-spin h-6 w-6 text-primary" />
);

const fetchTodos = async ({ pageParam }: { pageParam?: string }) => {
  const url = pageParam ? `/api/todos?cursor=${pageParam}` : '/api/todos';
  const res = await apiClient.get<TodoListResponse>(url);
  return res.data;
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { name: 'User' };

  useEffect(() => {
    document.title = 'Dashboard';
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error
  } = useInfiniteQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    initialPageParam: '',
    getNextPageParam: (lastPage) => lastPage.meta.next_cursor ?? undefined,
  });

  const observer = useRef<IntersectionObserver>(null);
  const lastTodoElementRef = useCallback((node: HTMLDivElement) => {
    if (isFetchingNextPage) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const createMutation = useMutation({
    mutationFn: (newTodo: TodoFormValues) => apiClient.post('/api/todos', newTodo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      closeModal();
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Failed to create todo')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TodoFormValues }) =>
      apiClient.put<TodoUpdateResponse>(`/api/todos/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      closeModal();
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Failed to update todo')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/todos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      closeDeleteModal();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to delete todo');
      closeDeleteModal();
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openCreateModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const openDeleteModal = (todo: Todo) => {
    setTodoToDelete(todo);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTodoToDelete(null);
  };

  const handleSubmitForm = (values: TodoFormValues) => {
    if (editingTodo) {
      updateMutation.mutate({ id: editingTodo.id, data: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      deleteMutation.mutate(todoToDelete.id);
    }
  };

  if (status === 'pending') return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5">
        <LoadingSpinner />
      </div>
      <p className="text-sm font-semibold text-gray-500 animate-pulse">Loading your workspace...</p>
    </div>
  );

  if (status === 'error') return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8 text-center">
      <div className="max-w-md w-full rounded-3xl bg-white p-8 shadow-xl border border-red-100">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
          <Trash2 className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Unable to load tasks</h3>
        <p className="text-sm text-gray-500 mt-2">{(error as Error).message}</p>
        <button onClick={() => window.location.reload()} className="mt-6 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-bold text-white hover:bg-black transition-colors">
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">

      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/80">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none text-gray-900">Dashboard</h1>
              <p className="text-xs font-medium text-gray-500 mt-1">Welcome back, {user.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="group flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">My Tasks</h2>
            <p className="mt-2 text-gray-500 font-medium">Manage your daily goals effectively.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-primary/40 active:translate-y-0 active:scale-[0.98] sm:w-auto"
          >
            <Plus className="h-5 w-5" /> New Task
          </button>
        </div>

        <div className="space-y-4">
          {data?.pages.map((group, pageIndex) => (
            <div key={pageIndex} className="space-y-4">
              {group.data.map((todo, index) => {
                const isLastElement = pageIndex === data.pages.length - 1 && index === group.data.length - 1;
                const isUpdatingThis = updateMutation.isPending && updateMutation.variables?.id === todo.id;
                const isDeletingThis = deleteMutation.isPending && deleteMutation.variables === todo.id;
                const isBusy = isUpdatingThis || isDeletingThis;

                return (
                  <div
                    ref={isLastElement ? lastTodoElementRef : null}
                    key={todo.id}
                    className={`group relative flex flex-col sm:flex-row items-start justify-between rounded-2xl p-6 transition-all duration-300 border
                      ${todo.is_done
                        ? 'bg-gray-50 border-gray-100 opacity-80'
                        : 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5'} 
                      ${isBusy ? 'opacity-50 pointer-events-none scale-[0.99]' : ''}
                    `}
                  >
                    <div className="flex w-full flex-1 gap-5 pr-4">
                      <button
                        disabled={isBusy}
                        onClick={() => updateMutation.mutate({
                          id: todo.id,
                          data: { title: todo.title, descriptions: todo.descriptions, is_done: !todo.is_done }
                        })}
                        className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all focus:outline-none focus:ring-4 focus:ring-primary/10
                          ${todo.is_done ? 'text-green-500 bg-green-50' : 'text-gray-300 hover:text-primary hover:bg-primary/5'}
                        `}
                      >
                        {isUpdatingThis ? (
                          <Loader2 className="animate-spin h-5 w-5 text-primary" />
                        ) : todo.is_done ? (
                          <CheckCircle2 className="h-7 w-7 fill-current" />
                        ) : (
                          <Circle className="h-7 w-7" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className={`text-lg font-bold leading-tight break-words transition-colors ${todo.is_done ? 'text-gray-400 line-through decoration-2 decoration-gray-300' : 'text-gray-900'}`}>
                          {todo.title}
                        </h3>
                        {todo.descriptions && (
                          <p className={`mt-2 text-sm leading-relaxed break-words ${todo.is_done ? 'text-gray-300 line-through' : 'text-gray-500'}`}>
                            {todo.descriptions}
                          </p>
                        )}
                        <div className="mt-4 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(todo.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex w-full justify-end gap-2 border-t border-gray-100 pt-4 sm:mt-0 sm:w-auto sm:border-0 sm:pt-0 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                      <button
                        onClick={() => openEditModal(todo)}
                        className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition-all hover:border-primary hover:bg-primary/5 hover:text-primary active:scale-95"
                        title="Edit Task"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(todo)}
                        className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2.5 text-gray-500 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-10">
          {isFetchingNextPage && (
            <div className="flex justify-center items-center gap-2 py-4 text-primary font-bold text-sm">
              <LoadingSpinner /> Loading more tasks...
            </div>
          )}

          {!hasNextPage && data && data.pages[0].data.length > 0 && (
            <div className="flex items-center justify-center py-8">
              <span className="px-4 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-500">End of list</span>
            </div>
          )}

          {data?.pages[0].data.length === 0 && status === 'success' && (
            <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl border-2 border-dashed border-gray-200 bg-white">
              <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300 ring-8 ring-gray-50/50">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
              <p className="text-gray-500 mt-2 max-w-sm">Your task list is empty. Take a break or create a new goal to get started.</p>
              <button onClick={openCreateModal} className="mt-8 px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors">
                Create First Task
              </button>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <TodoModal
          isOpen={true}
          onClose={closeModal}
          onSubmit={handleSubmitForm}
          initialData={editingTodo}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
        title={todoToDelete?.title || ''}
      />
    </div>
  );
}