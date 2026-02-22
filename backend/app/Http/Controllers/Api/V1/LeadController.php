<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\LeadService;
use App\DTO\LeadDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Leads", description="Lead management")
 */
class LeadController extends Controller
{
    public function __construct(private readonly LeadService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        if ($request->filled('q')) {
            return response()->json(['data' => $this->service->search($request->q)]);
        }
        return response()->json(['data' => $this->service->getAll((int) $request->get('per_page', 15))]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', \App\Models\Lead::class);

        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'sometimes|in:' . implode(',', \App\Models\Lead::STATUSES),
            'value' => 'sometimes|numeric|min:0',
            'tags' => 'sometimes|array',
        ]);

        $lead = $this->service->create(LeadDTO::fromRequest($request));

        return response()->json(['message' => 'Lead created.', 'data' => $lead], 201);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['data' => $this->service->find($id)]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $this->authorize('update', $this->service->find($id));

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:' . implode(',', \App\Models\Lead::STATUSES),
            'value' => 'sometimes|numeric|min:0',
            'tags' => 'sometimes|array',
        ]);

        $lead = $this->service->update($id, LeadDTO::fromRequest($request));

        return response()->json(['message' => 'Lead updated.', 'data' => $lead]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->authorize('delete', $this->service->find($id));
        $this->service->delete($id);
        return response()->json(['message' => 'Lead deleted.'], 204);
    }

    public function assign(Request $request, string $id): JsonResponse
    {
        $request->validate(['user_id' => 'required|string']);
        $lead = $this->service->assign($id, $request->user_id);
        return response()->json(['message' => 'Lead assigned.', 'data' => $lead]);
    }

    public function updateStatus(Request $request, string $id): JsonResponse
    {
        $request->validate(['status' => 'required|in:' . implode(',', \App\Models\Lead::STATUSES)]);
        $lead = $this->service->updateStatus($id, $request->status);
        return response()->json(['message' => 'Status updated.', 'data' => $lead]);
    }
}
