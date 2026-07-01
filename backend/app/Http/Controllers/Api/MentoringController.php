<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MentoringGroup;
use App\Models\MentoringMember;
use Illuminate\Http\Request;

class MentoringController extends Controller
{
    public function index()
    {
        $groups = MentoringGroup::with(['mentor', 'members'])->get();
        
        $groups->transform(function ($group) {
            $group->total_members = $group->members->count();
            return $group;
        });

        return response()->json($groups);
    }

    public function show(string $id)
    {
        $group = MentoringGroup::with(['mentor', 'members.kader'])->findOrFail($id);
        return response()->json($group);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kelompok' => 'required|string|max:255',
            'mentor_id' => 'required|exists:kaders,id',
            'tingkat' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $group = MentoringGroup::create($request->all());

        return response()->json([
            'message' => 'Kelompok mentoring berhasil dibuat.',
            'group' => $group
        ], 210);
    }

    public function update(Request $request, string $id)
    {
        $group = MentoringGroup::findOrFail($id);

        $request->validate([
            'nama_kelompok' => 'required|string|max:255',
            'mentor_id' => 'required|exists:kaders,id',
            'tingkat' => 'nullable|string',
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $group->update($request->all());

        return response()->json([
            'message' => 'Kelompok mentoring berhasil diperbarui.',
            'group' => $group
        ]);
    }

    public function destroy(string $id)
    {
        $group = MentoringGroup::findOrFail($id);
        $group->delete();

        return response()->json([
            'message' => 'Kelompok mentoring berhasil dihapus.'
        ]);
    }

    public function addMember(Request $request, string $groupId)
    {
        $group = MentoringGroup::findOrFail($groupId);

        $request->validate([
            'kader_id' => 'required|exists:kaders,id',
            'status' => 'required|in:aktif,alumni,keluar'
        ]);

        try {
            $member = MentoringMember::create([
                'mentoring_group_id' => $group->id,
                'kader_id' => $request->kader_id,
                'status' => $request->status,
            ]);

            return response()->json([
                'message' => 'Anggota berhasil ditambahkan ke kelompok.',
                'member' => $member->load('kader')
            ], 210);
        } catch (\Illuminate\Database\QueryException $e) {
            // Check for unique constraint violation
            return response()->json([
                'message' => 'Kader ini sudah terdaftar di kelompok tersebut.'
            ], 422);
        }
    }

    public function removeMember(string $id)
    {
        $member = MentoringMember::findOrFail($id);
        $member->delete();

        return response()->json([
            'message' => 'Anggota berhasil dihapus dari kelompok.'
        ]);
    }
}
