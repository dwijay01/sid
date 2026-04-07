<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\QrValidation;
use Inertia\Inertia;

class QrVerificationController extends Controller
{
    /**
     * Verify the authenticity of a document using the QR token.
     */
    public function verify($token)
    {
        $qrValidation = QrValidation::with(['letterRequest.letterType', 'letterRequest.resident', 'validator'])
            ->where('qr_code', $token)
            ->first();

        // If not found, return an error view
        if (!$qrValidation) {
            return Inertia::render('Public/QrVerify', [
                'isValid' => false,
                'message' => 'Dokumen tidak ditemukan atau QR Code tidak valid.'
            ]);
        }

        // Return success view with document details
        return Inertia::render('Public/QrVerify', [
            'isValid' => true,
            'document' => [
                'nomor_surat' => $qrValidation->letterRequest->nomor_surat,
                'jenis_surat' => $qrValidation->letterRequest->letterType->nama_surat,
                'nama_pemohon' => $qrValidation->letterRequest->resident->nama_lengkap,
                'tanggal_disahkan' => $qrValidation->validated_at,
                'disahkan_oleh' => $qrValidation->validator->name ?? 'Sistem',
            ]
        ]);
    }
}
