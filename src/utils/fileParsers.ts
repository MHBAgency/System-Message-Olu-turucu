import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Parse Excel files (.xlsx, .xls, .csv)
export const parseExcel = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                let result = '';

                // Process each sheet
                workbook.SheetNames.forEach((sheetName) => {
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    result += `\n=== ${sheetName} ===\n`;

                    // Convert to readable text format
                    jsonData.forEach((row: any) => {
                        const rowText = row.filter((cell: any) => cell !== undefined && cell !== null).join(' | ');
                        if (rowText.trim()) {
                            result += rowText + '\n';
                        }
                    });
                });

                resolve(result.trim());
            } catch (error) {
                reject(new Error(`Excel parsing failed: ${error}`));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read Excel file'));
        reader.readAsArrayBuffer(file);
    });
};

// Parse Word files (.docx)
export const parseWord = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const arrayBuffer = e.target?.result as ArrayBuffer;
                const result = await mammoth.extractRawText({ arrayBuffer });
                resolve(result.value);
            } catch (error) {
                reject(new Error(`Word parsing failed: ${error}`));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read Word file'));
        reader.readAsArrayBuffer(file);
    });
};

// Parse PDF files
export const parsePDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
                const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

                let fullText = '';

                // Extract text from each page
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items
                        .map((item: any) => item.str)
                        .join(' ');
                    fullText += pageText + '\n';
                }

                resolve(fullText.trim());
            } catch (error) {
                reject(new Error(`PDF parsing failed: ${error}`));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read PDF file'));
        reader.readAsArrayBuffer(file);
    });
};

// Parse text files
export const parseText = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                resolve(text);
            } catch (error) {
                reject(new Error(`Text parsing failed: ${error}`));
            }
        };

        reader.onerror = () => reject(new Error('Failed to read text file'));
        reader.readAsText(file, 'UTF-8');
    });
};

// Main parser function that routes to appropriate parser
export const parseFile = async (file: File): Promise<string> => {
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;

    switch (extension) {
        case '.xlsx':
        case '.xls':
        case '.csv':
            return parseExcel(file);

        case '.docx':
            return parseWord(file);

        case '.pdf':
            return parsePDF(file);

        case '.txt':
            return parseText(file);

        default:
            throw new Error(`Unsupported file format: ${extension}`);
    }
};
