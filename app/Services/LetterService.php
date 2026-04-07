<?php

namespace App\Services;

use App\Models\LetterRequest;
use App\Models\LetterRequestLog;
use App\Models\VillageSetting;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LetterService
{
    /**
     * Handle the full letter request creation.
     */
    public function createRequest(array $data, int $userId): LetterRequest
    {
        return DB::transaction(function () use ($data, $userId) {
            $request = LetterRequest::create([
                'letter_type_id' => $data['letter_type_id'],
                'pemohon_user_id' => $userId,
                'subject_resident_id' => $data['subject_resident_id'],
                'wilayah_id' => $data['wilayah_id'],
                'keperluan' => $data['keperluan'],
                'data_tambahan' => $data['data_tambahan'] ?? null,
                'status' => 'diajukan',
            ]);

            $this->logStatusChange($request, null, 'diajukan', 'Permohonan berhasil dibuat oleh sistem.');
            
            return $request;
        });
    }

    /**
     * Validate/Approve a letter request (by RT/RW).
     */
    public function approveByRt(LetterRequest $request, int $approverId, ?string $notes = null): LetterRequest
    {
        return DB::transaction(function () use ($request, $approverId, $notes) {
            $oldStatus = $request->status;
            
            $request->update([
                'status' => 'disetujui_rt',
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            $this->logStatusChange($request, $oldStatus, 'disetujui_rt', $notes ?? 'Disetujui oleh RT/RW.');

            // Call QR Service to generate validation QR if needed here or later
            // QrCodeService::generateValidation($request, $approverId);
            
            return $request;
        });
    }

    /**
     * Reject a letter request (by RT/RW).
     */
    public function rejectByRt(LetterRequest $request, int $approverId, string $reason): LetterRequest
    {
        return DB::transaction(function () use ($request, $approverId, $reason) {
            $oldStatus = $request->status;
            
            $request->update([
                'status' => 'ditolak_rt',
                'catatan_penolakan' => $reason,
                'approved_by' => $approverId,
                'approved_at' => now(),
            ]);

            $this->logStatusChange($request, $oldStatus, 'ditolak_rt', $reason);
            
            return $request;
        });
    }

    /**
     * Process letter at Desa.
     */
    public function processAtDesa(LetterRequest $request, int $operatorId): LetterRequest
    {
        return DB::transaction(function () use ($request, $operatorId) {
            $oldStatus = $request->status;
            
            $request->update([
                'status' => 'diproses_desa',
                'processed_by' => $operatorId,
                'processed_at' => now(),
            ]);

            $this->logStatusChange($request, $oldStatus, 'diproses_desa', 'Permohonan sedang diproses oleh petugas desa.');
            
            return $request;
        });
    }

    /**
     * Complete and generate nomor surat.
     */
    public function completeRequest(LetterRequest $request, int $operatorId): LetterRequest
    {
        return DB::transaction(function () use ($request, $operatorId) {
            $oldStatus = $request->status;
            
            $nomorSurat = $this->generateNomorSurat($request);
            
            $request->update([
                'status' => 'selesai',
                'nomor_surat' => $nomorSurat,
                'completed_at' => now(),
            ]);

            $this->logStatusChange($request, $oldStatus, 'selesai', 'Surat selesai dibuat dan siap diambil.');
            
            return $request;
        });
    }

    /**
     * Update the status of a letter request.
     */
    public function updateStatus(LetterRequest $request, string $status, int $userId, string $notes): LetterRequest
    {
        return DB::transaction(function () use ($request, $status, $userId, $notes) {
            $oldStatus = $request->status;
            
            $updateData = [
                'status' => $status,
            ];

            // If entering completed status, generate nomor surat if it doesn't have one
            if ($status === 'selesai' && empty($request->nomor_surat)) {
                $updateData['nomor_surat'] = $this->generateNomorSurat($request);
            }

            $request->update($updateData);

            $this->logStatusChange($request, $oldStatus, $status, $notes, $userId);
            
            return $request;
        });
    }

    /**
     * Generate PDF for the letter request
     */
    public function generatePdf(LetterRequest $request): string
    {
        // Require it to be completed or at least signed by Kades
        if (!in_array($request->status, ['menunggu_ttd_kades', 'selesai'])) {
            throw new \Exception('Surat belum siap untuk dicetak.');
        }

        $printService = app(\App\Services\LetterPrintService::class);
        return $printService->generate($request);
    }

    /**
     * Create log for status change.
     */
    private function logStatusChange(LetterRequest $request, ?string $from, string $to, ?string $notes, ?int $userId = null): void
    {
        LetterRequestLog::create([
            'letter_request_id' => $request->id,
            'status_from' => $from,
            'status_to' => $to,
            'notes' => $notes,
            'changed_by' => $userId ?? auth()->id(),
        ]);
    }

    /**
     * Generate Nomor Surat using village settings.
     */
    private function generateNomorSurat(LetterRequest $request): string
    {
        $settingFormat = VillageSetting::where('key', 'format_nomor_surat')->value('value') ?? '{NOMOR}/DESA/{BULAN}/{TAHUN}';
        
        // Simulating counter for now
        $newCounter = 1;

        $nomorSurat = $settingFormat;
        $nomorSurat = str_replace('{NOMOR}', str_pad($newCounter, 3, '0', STR_PAD_LEFT), $nomorSurat);
        $nomorSurat = str_replace('{KODE_DESA}', 'KDS', $nomorSurat);
        $nomorSurat = str_replace('{BULAN}', date('m'), $nomorSurat);
        $nomorSurat = str_replace('{TAHUN}', date('Y'), $nomorSurat);

        return $nomorSurat;
    }
}
