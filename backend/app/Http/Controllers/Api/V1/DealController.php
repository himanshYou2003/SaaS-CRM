<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\DealService;
use App\DTO\DealDTO;
use App\Models\Deal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealController extends Controller
{
    public function __construct(private readonly DealService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        // Return kanban board if requested
        if ($request->boolean('kanban')) {
            return response()->json(['data' => $this->service->getKanbanBoard()]);
        }
        return response()->json(['data' => $this->service->getAll((int) $request->get('per_page', 15))]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'stage' => 'sometimes|in:' . implode(',', Deal::STAGES),
            'amount' => 'sometimes|numeric|min:0',
        ]);

        $deal = $this->service->create(DealDTO::fromRequest($request));
        return response()->json(['message' => 'Deal created.', 'data' => $deal], 201);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['data' => $this->service->find($id)]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'title' => 'sometimes|string|max:255',
            'stage' => 'sometimes|in:' . implode(',', Deal::STAGES),
            'amount' => 'sometimes|numeric|min:0',
        ]);

        $deal = $this->service->update($id, DealDTO::fromRequest($request));
        return response()->json(['message' => 'Deal updated.', 'data' => $deal]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Deal deleted.'], 204);
    }

    public function updateStage(Request $request, string $id): JsonResponse
    {
        $request->validate(['stage' => 'required|in:' . implode(',', Deal::STAGES)]);
        $deal = $this->service->updateStage($id, $request->stage);
        return response()->json(['message' => 'Stage updated.', 'data' => $deal]);
    }
}
