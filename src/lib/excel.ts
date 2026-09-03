import * as XLSX from 'xlsx';
import { Student } from '../types';

export interface ExcelPreviewResult {
  headers: string[];
  rows: Record<string, string | number>[];
  detectedNameCol: string;
  detectedCodeCol: string;
  totalRows: number;
}

export function parseExcelFile(file: File): Promise<ExcelPreviewResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Parse as raw json matrix
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number>>(worksheet, {
          defval: '',
          raw: false,
        });

        if (!jsonData || jsonData.length === 0) {
          throw new Error('File không có dữ liệu hoặc trang tính rỗng.');
        }

        const headers = Object.keys(jsonData[0] || {});

        // Auto-detect columns
        let detectedNameCol = '';
        let detectedCodeCol = '';

        for (const h of headers) {
          const lower = h.toLowerCase().trim();
          if (!detectedNameCol && (
            lower.includes('họ và tên') ||
            lower.includes('họ tên') ||
            lower.includes('ho va ten') ||
            lower.includes('hoten') ||
            lower.includes('tên') ||
            lower.includes('name') ||
            lower.includes('fullname')
          )) {
            detectedNameCol = h;
          }
          if (!detectedCodeCol && (
            lower.includes('mã') ||
            lower.includes('ma') ||
            lower.includes('code') ||
            lower.includes('id') ||
            lower.includes('ms') ||
            lower.includes('mshs')
          )) {
            detectedCodeCol = h;
          }
        }

        if (!detectedNameCol && headers.length > 0) {
          // fallback to second col or first col
          detectedNameCol = headers.length > 1 ? headers[1] : headers[0];
        }

        resolve({
          headers,
          rows: jsonData,
          detectedNameCol,
          detectedCodeCol,
          totalRows: jsonData.length,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Không thể đọc tệp tin.'));
    reader.readAsArrayBuffer(file);
  });
}

export function convertRowsToStudents(
  rows: Record<string, string | number>[],
  nameCol: string,
  codeCol: string
): { students: Student[]; duplicatesCount: number } {
  const students: Student[] = [];
  const seenNames = new Set<string>();
  let duplicatesCount = 0;

  rows.forEach((row, idx) => {
    const rawName = String(row[nameCol] || '').trim();
    if (!rawName) return; // skip empty lines

    const rawCode = codeCol ? String(row[codeCol] || '').trim() : '';

    if (seenNames.has(rawName.toLowerCase())) {
      duplicatesCount++;
    }
    seenNames.add(rawName.toLowerCase());

    students.push({
      id: `hs-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`,
      name: rawName,
      code: rawCode || `HS${String(students.length + 1).padStart(3, '0')}`,
    });
  });

  return { students, duplicatesCount };
}

export function downloadSampleExcel() {
  const sampleData = [
    { 'STT': 1, 'Mã học sinh': 'HS001', 'Họ và tên': 'Nguyễn Văn An', 'Ghi chú': '' },
    { 'STT': 2, 'Mã học sinh': 'HS002', 'Họ và tên': 'Trần Thị Bích', 'Ghi chú': '' },
    { 'STT': 3, 'Mã học sinh': 'HS003', 'Họ và tên': 'Lê Hoàng Cường', 'Ghi chú': '' },
    { 'STT': 4, 'Mã học sinh': 'HS004', 'Họ và tên': 'Phạm Minh Đức', 'Ghi chú': '' },
    { 'STT': 5, 'Mã học sinh': 'HS005', 'Họ và tên': 'Đỗ Quỳnh Giang', 'Ghi chú': '' },
    { 'STT': 6, 'Mã học sinh': 'HS006', 'Họ và tên': 'Vũ Quốc Huy', 'Ghi chú': '' },
    { 'STT': 7, 'Mã học sinh': 'HS007', 'Họ và tên': 'Hoàng Mai Hương', 'Ghi chú': '' },
    { 'STT': 8, 'Mã học sinh': 'HS008', 'Họ và tên': 'Bùi Gia Khang', 'Ghi chú': '' },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'DanhSachHocSinh');
  XLSX.writeFile(wb, 'Mau_Danh_Sach_Hoc_Sinh.xlsx');
}
