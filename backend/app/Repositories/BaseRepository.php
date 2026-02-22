<?php

namespace App\Repositories;

use MongoDB\Laravel\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * BaseRepository
 *
 * All repositories extend this. It automatically scopes every query
 * by the current tenant's company_id (injected by TenantMiddleware).
 */
abstract class BaseRepository
{
    protected Model $model;

    public function __construct()
    {
        $this->model = app($this->model());
    }

    /**
     * Return the FQCN of the Eloquent model this repository manages.
     */
    abstract protected function model(): string;

    // ── Tenant Scope ──────────────────────────────────────────────────────────

    /**
     * Returns a query builder always scoped to the current tenant.
     */
    protected function query()
    {
        $companyId = app('company_id');

        if (empty($companyId)) {
            throw new \RuntimeException('Tenant context not set. TenantMiddleware may not have run.');
        }

        return $this->model->newQuery()->where('company_id', $companyId);
    }

    // ── Generic CRUD ──────────────────────────────────────────────────────────

    public function all(array $columns = ['*']): Collection
    {
        return $this->query()->get($columns);
    }

    public function paginate(int $perPage = 15, array $columns = ['*']): LengthAwarePaginator
    {
        return $this->query()->orderBy('created_at', 'desc')->paginate($perPage, $columns);
    }

    public function findById(string $id): ?Model
    {
        return $this->query()->find($id);
    }

    public function findOrFail(string $id): Model
    {
        return $this->query()->findOrFail($id);
    }

    public function create(array $data): Model
    {
        $data['company_id'] = app('company_id');
        return $this->model->create($data);
    }

    public function update(string $id, array $data): Model
    {
        $record = $this->findOrFail($id);
        $record->update($data);
        return $record->fresh();
    }

    public function delete(string $id): bool
    {
        $record = $this->findOrFail($id);
        return (bool) $record->delete();
    }

    public function findWhere(array $conditions, array $columns = ['*']): Collection
    {
        $query = $this->query();
        foreach ($conditions as $field => $value) {
            if (is_array($value)) {
                $query->whereIn($field, $value);
            } else {
                $query->where($field, $value);
            }
        }
        return $query->get($columns);
    }

    public function count(): int
    {
        return $this->query()->count();
    }
}
