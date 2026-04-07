<?php

namespace App\Services;

use App\Models\LetterRequest;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class LetterPrintService
{
    protected $qrCodeService;

    public function __construct(QrCodeService $qrCodeService)
    {
        $this->qrCodeService = $qrCodeService;
    }

    /**
     * Generate the PDF from a letter request
     */
    public function generate(LetterRequest $request): string
    {
        // Require eager loads
        $request->loadMissing(['resident', 'letterType', 'logs.actor']);
        
        // Ensure QR code exists, if not generate it
        if (!$request->qrValidation) {
            $this->qrCodeService->generateValidation($request, auth()->id() ?? 1);
            $request->load('qrValidation');
        }
        
        $qrCodeBase64 = null;
        if ($request->qrValidation) {
            $verifyUrl = route('qr.verify', ['token' => $request->qrValidation->qr_code]);
            // Generate SVG binary and encode to base64 data URI to bypass Imagick requirement
            $qrCodeBase64 = 'data:image/svg+xml;base64,' . base64_encode(\SimpleSoftwareIO\QrCode\Facades\QrCode::format('svg')->size(120)->margin(1)->generate($verifyUrl));
        }

        // Build Data for View
        $data = [
            'letter' => $request,
            'resident' => $request->resident,
            'qrCodeUrl' => $qrCodeBase64,
            'verificationUrl' => $request->qrValidation ? route('qr.verify', ['token' => $request->qrValidation->qr_code]) : '#',
        ];

        // Determine view based on letter type or use default
        // Usually, the system allows unique blade templates by letterType id or code
        $viewPath = 'letters.templates.default';
        if (view()->exists('letters.templates.' . Str::slug($request->letterType->kode_surat))) {
            $viewPath = 'letters.templates.' . Str::slug($request->letterType->kode_surat);
        }

        $pdf = Pdf::loadView($viewPath, $data);
        
        // Format A4 portrait
        $pdf->setPaper('a4', 'portrait');

        // File path definition
        $fileName = 'surat_' . Str::slug($request->letterType->nama_surat) . '_' . str_replace('/', '_', $request->nomor_surat) . '.pdf';
        $pdfPath = 'letters/' . $fileName;

        // Ensure directory exists
        if (!Storage::disk('public')->exists('letters')) {
            Storage::disk('public')->makeDirectory('letters');
        }

        // Save PDF to public storage
        Storage::disk('public')->put($pdfPath, $pdf->output());

        return '/storage/' . $pdfPath;
    }
}
