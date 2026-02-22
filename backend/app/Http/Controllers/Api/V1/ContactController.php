<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ContactService;
use App\DTO\ContactDTO;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function __construct(private readonly ContactService $service)
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
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'sometimes|email',
            'phone' => 'sometimes|string|max:30',
        ]);

        $contact = $this->service->create(ContactDTO::fromRequest($request));
        return response()->json(['message' => 'Contact created.', 'data' => $contact], 201);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(['data' => $this->service->find($id)]);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $request->validate([
            'name' => 'sometimes|string|max:100',
            'email' => 'sometimes|email',
        ]);

        $contact = $this->service->update($id, ContactDTO::fromRequest($request));
        return response()->json(['message' => 'Contact updated.', 'data' => $contact]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Contact deleted.'], 204);
    }
}
