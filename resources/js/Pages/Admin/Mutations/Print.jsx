import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function Print({ mutation, template }) {
    // Process template content with placeholders
    const processTemplate = (content, data) => {
        let processed = content;
        
        // Base Resident Info
        processed = processed.replace(/\{\{nama\}\}/g, data.resident?.nama_lengkap || '-');
        processed = processed.replace(/\{\{nik\}\}/g, data.resident?.nik || '-');
        processed = processed.replace(/\{\{tmp_lahir\}\}/g, data.resident?.tempat_lahir || '-');
        processed = processed.replace(/\{\{tgl_lahir\}\}/g, data.resident?.tanggal_lahir || '-');
        processed = processed.replace(/\{\{jk\}\}/g, data.resident?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan');
        processed = processed.replace(/\{\{pekerjaan\}\}/g, data.resident?.pekerjaan?.replace(/_/g, ' ') || '-');
        processed = processed.replace(/\{\{agama\}\}/g, data.resident?.agama || '-');
        
        // KK Info
        processed = processed.replace(/\{\{no_kk\}\}/g, data.resident?.family_card?.no_kk || '-');
        processed = processed.replace(/\{\{kepala_kk\}\}/g, data.resident?.family_card?.kepala_keluarga?.nama_lengkap || '-');
        processed = processed.replace(/\{\{alamat\}\}/g, data.resident?.family_card?.alamat || '-');

        // Mutation Metadata Info
        if (data.metadata) {
            Object.entries(data.metadata).forEach(([key, value]) => {
                const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
                processed = processed.replace(placeholder, value || '-');
            });
        }

        // Global Date
        const today = new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        processed = processed.replace(/\{\{tgl_sekarang\}\}/g, today);

        return processed;
    };

    useEffect(() => {
        // Trigger print after rendering
        window.print();
        // Optional: window.close() after print if needed
    }, []);

    return (
        <div className="bg-white min-h-screen p-8 text-black print:p-0">
            <Head title={`Cetak ${template.name}`} />
            
            {/* Simple Letter Header - Usually provided in template or hardcoded */}
            <div className="max-w-4xl mx-auto">
                <div dangerouslySetInnerHTML={{ __html: processTemplate(template.body_template, mutation) }} className="prose prose-slate max-w-none" />
                
                <div className="mt-12 flex justify-end">
                    <div className="text-center w-64 border-t-0">
                        <p>{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="mt-1">Kepala Desa</p>
                        <div className="h-24"></div>
                        <p className="font-bold underline">( ............................ )</p>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { size: portrait; margin: 2cm; }
                    body { background: white; }
                    .no-print { display: none; }
                }
                .prose p { margin-top: 0.5em; margin-bottom: 0.5em; line-height: 1.6; }
            `}} />
        </div>
    );
}
