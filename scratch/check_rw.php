<?php

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

$file = 'Data Warga RW. 30 new.xlsx';

try {
    $spreadsheet = IOFactory::load($file);
    foreach (['RT. 01', 'RT. 02', 'RT. 22'] as $sheetName) {
        $sheet = $spreadsheet->getSheetByName($sheetName);
        if ($sheet) {
            $rows = $sheet->toArray();
            echo "SHEET $sheetName - ROW 3: " . (string)$rows[3][1] . "\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
