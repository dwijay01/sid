<?php

namespace App\Services;

use App\Models\LetterRequest;
use App\Models\QrValidation;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class QrCodeService
{
    /**
     * Generate QR Code Validation for an approved LetterRequest.
     */
    public function generateValidation(LetterRequest $request, int $approverId): QrValidation
    {
        $qrUuid = (string) Str::uuid();
        
        // The URL that the QR Code points to
        // Example: https://sistem-desa.com/verify/{uuid}
        $verifyUrl = route('qr.verify', ['token' => $qrUuid]);
        
        // Generate SVG string
        $qrContent = QrCode::format('svg')->size(200)->generate($verifyUrl);
        
        $fileName = "qrcodes/{$qrUuid}.svg";
        
        Storage::disk('public')->put($fileName, $qrContent);
        
        $validation = QrValidation::create([
            'letter_request_id' => $request->id,
            'qr_code' => $qrUuid,
            'qr_image_path' => $fileName,
            'validated_by' => $approverId,
            'validated_at' => now(),
            'metadata' => [
                'generated_on' => now()->toIso8601String(),
                'version' => '1.0'
            ]
        ]);

        return $validation;
    }
}
