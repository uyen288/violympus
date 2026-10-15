import { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  AlertCircle, CheckCircle2, Download, FileText, Loader2,
  Upload, X, AlertTriangle, ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import {
  parseCsvRows, generateErrorReport, createImportJob, importBatch,
  listImportJobs, getImportErrors,
  IMPORT_MAX_FILE_SIZE_BYTES, IMPORT_MAX_ROWS,
  type ParsedQuestionRow, type ImportJobRow,
} from '@/features/admin/services/adminImportService';

type Stage = 'idle' | 'preview' | 'importing' | 'done';

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600',
  processing: 'bg-blue-100 text-blue-600',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

function downloadBlob(content: string, filename: string, mime = 'text/csv') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export function AdminImportPage() {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>('idle');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [rows, setRows] = useState<ParsedQuestionRow[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [duplicatePolicy, setDuplicatePolicy] = useState<'skip' | 'overwrite' | 'error'>('skip');
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);
  const [expandJobId, setExpandJobId] = useState<string | null>(null);

  const jobsQuery = useQuery({
    queryKey: ['admin', 'import-jobs'],
    queryFn: listImportJobs,
  });

  const errorsQuery = useQuery({
    queryKey: ['admin', 'import-errors', expandJobId],
    queryFn: () => getImportErrors(expandJobId!),
    enabled: !!expandJobId,
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const jobId = await createImportJob({
        fileName, fileSize, totalRows: rows.length, duplicatePolicy,
      });
      return importBatch(jobId, rows);
    },
    onSuccess: (result) => {
      setImportResult(result);
      setStage('done');
      void qc.invalidateQueries({ queryKey: ['admin', 'import-jobs'] });
      void qc.invalidateQueries({ queryKey: ['admin', 'questions'] });
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError(null);

    if (!file.name.endsWith('.csv')) {
      setFileError('Chỉ hỗ trợ file .csv. Import XLSX sẽ được bổ sung sau.');
      return;
    }
    if (file.size > IMPORT_MAX_FILE_SIZE_BYTES) {
      setFileError(`File quá lớn. Tối đa ${IMPORT_MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`);
      return;
    }

    setFileName(file.name);
    setFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCsvRows(text);

      if (parsed.length === 0) {
        setFileError('File không có dữ liệu hợp lệ (kiểm tra header).');
        return;
      }
      if (parsed.length > IMPORT_MAX_ROWS) {
        setFileError(`Quá nhiều dòng. Tối đa ${IMPORT_MAX_ROWS} dòng mỗi lần.`);
        return;
      }

      setRows(parsed);
      setStage('preview');
    };
    reader.readAsText(file, 'utf-8');
  }

  function reset() {
    setStage('idle');
    setRows([]);
    setFileName('');
    setFileError(null);
    setImportResult(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  const validRows = rows.filter((r) => r._valid);
  const invalidRows = rows.filter((r) => !r._valid);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Import câu hỏi</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Tải lên file CSV theo template để nhập hàng loạt câu hỏi vào ngân hàng.
        </p>
      </div>

      {/* Template download */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 flex items-center gap-4">
        <FileText size={24} className="text-primary shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Template CSV mẫu</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tải template để xem đúng định dạng cột, ví dụ từng loại câu hỏi.
          </p>
        </div>
        <Button
          variant="outline" size="sm" className="gap-2 shrink-0"
          onClick={() => downloadBlob(CSV_TEMPLATE, 'violympus-questions-template.csv')}
        >
          <Download size={14} /> Tải template
        </Button>
      </div>

      {/* Upload area */}
      {stage === 'idle' && (
        <div>
          <div
            className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file && fileRef.current) {
                const dt = new DataTransfer();
                dt.items.add(file);
                fileRef.current.files = dt.files;
                handleFileChange({ target: fileRef.current } as React.ChangeEvent<HTMLInputElement>);
              }
            }}
          >
            <Upload size={28} className="text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm font-medium">Kéo thả file CSV vào đây</p>
              <p className="text-xs text-muted-foreground mt-1">hoặc nhấp để chọn file · Tối đa 5 MB · 2.000 dòng</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
          {fileError && (
            <div className="mt-3 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle size={15} /> {fileError}
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {stage === 'preview' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center gap-4 rounded-xl border border-border p-4">
            <FileText size={20} className="text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs text-muted-foreground">{rows.length} dòng · {validRows.length} hợp lệ · {invalidRows.length} lỗi</p>
            </div>
            <button onClick={reset} className="p-1.5 rounded hover:bg-muted">
              <X size={15} className="text-muted-foreground" />
            </button>
          </div>

          {/* Validation summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Tổng dòng', value: rows.length, color: 'text-foreground' },
              { label: 'Hợp lệ', value: validRows.length, color: 'text-green-600' },
              { label: 'Lỗi', value: invalidRows.length, color: 'text-red-500' },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border p-3 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Error rows preview (max 10) */}
          {invalidRows.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-destructive flex items-center gap-1.5">
                  <AlertTriangle size={14} /> {invalidRows.length} dòng có lỗi
                </p>
                <Button
                  variant="outline" size="sm" className="gap-1.5 text-xs"
                  onClick={() => downloadBlob(generateErrorReport(rows), 'import-errors.csv')}
                >
                  <Download size={12} /> Tải báo cáo lỗi
                </Button>
              </div>
              <div className="rounded-xl border border-destructive/20 overflow-hidden">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-destructive/5 text-muted-foreground">
                      <th className="px-3 py-2 text-left font-medium">Dòng</th>
                      <th className="px-3 py-2 text-left font-medium">Lỗi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {invalidRows.slice(0, 10).map((row) => (
                      <tr key={row._rowIndex}>
                        <td className="px-3 py-2 font-mono">{row._rowIndex}</td>
                        <td className="px-3 py-2 text-destructive">{row._errors.join('; ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {invalidRows.length > 10 && (
                  <p className="text-xs text-center py-2 text-muted-foreground">
                    ...và {invalidRows.length - 10} dòng lỗi khác (tải báo cáo để xem đầy đủ)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Duplicate policy */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">Chính sách trùng lặp</label>
            <select
              value={duplicatePolicy}
              onChange={(e) => setDuplicatePolicy(e.target.value as typeof duplicatePolicy)}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="skip">Bỏ qua dòng trùng (mặc định)</option>
              <option value="overwrite">Ghi đè (chỉ câu draft)</option>
              <option value="error">Báo lỗi nếu trùng</option>
            </select>
          </div>

          {validRows.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <Button
                onClick={() => { setStage('importing'); importMutation.mutate(); }}
                disabled={importMutation.isPending}
                className="gap-2"
              >
                {importMutation.isPending ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
                Nhập {validRows.length} câu hợp lệ
              </Button>
              <Button variant="ghost" onClick={reset}>Huỷ</Button>
              {importMutation.isError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle size={13} /> {String(importMutation.error)}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Done */}
      {stage === 'done' && importResult && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-3">
          <CheckCircle2 size={36} className="mx-auto text-green-600" />
          <div>
            <p className="text-lg font-bold text-green-800">Import hoàn tất</p>
            <p className="text-sm text-green-700 mt-1">
              {importResult.success} câu hỏi đã được nhập thành công.
              {importResult.failed > 0 && ` ${importResult.failed} câu thất bại.`}
            </p>
          </div>
          <Button size="sm" onClick={reset} className="gap-2">
            <Upload size={14} /> Import tiếp
          </Button>
        </div>
      )}

      {/* Job history */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Lịch sử import</h2>
        {jobsQuery.isPending ? (
          <LoadingSpinner />
        ) : jobsQuery.data && jobsQuery.data.length > 0 ? (
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {jobsQuery.data.map((job: ImportJobRow) => (
                <div key={job.id} className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{job.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.total_rows} dòng · {new Date(job.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[job.status] ?? ''}`}>
                      {job.status === 'completed' ? 'Hoàn thành' : job.status === 'failed' ? 'Thất bại' : job.status === 'processing' ? 'Đang xử lý' : 'Đang chờ'}
                    </span>
                    <div className="text-xs text-right shrink-0">
                      <span className="text-green-600">{job.imported_rows} ✓</span>
                      {job.failed_rows > 0 && <span className="text-red-500 ml-1">{job.failed_rows} ✗</span>}
                    </div>
                    {job.failed_rows > 0 && (
                      <button
                        onClick={() => setExpandJobId(expandJobId === job.id ? null : job.id)}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Lỗi <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                  {expandJobId === job.id && errorsQuery.data && (
                    <div className="mt-2 space-y-1">
                      {errorsQuery.data.map((err) => (
                        <p key={err.id} className="text-xs text-destructive">
                          Dòng {err.row_number}: {err.error_message}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Chưa có lịch sử import nào.</p>
        )}
      </div>
    </div>
  );
}

const CSV_TEMPLATE = `subject_slug,topic_slug,question_type,prompt_vi,prompt_en,option_a_vi,option_b_vi,option_c_vi,option_d_vi,correct_option_keys,accepted_answers,explanation_vi,explanation_en,difficulty,points,status
toan-hoc,dai-so,single_choice,2 + 2 bằng mấy?,What is 2 + 2?,3,4,5,6,B,,Vì 2 + 2 = 4,Because 2 + 2 = 4,easy,10,draft
toan-hoc,dai-so,true_false,Số Pi bằng đúng 3.14 không?,Is Pi exactly 3.14?,,,,,false,,Pi là số vô tỷ gần bằng 3.14159...,Pi is irrational approximately 3.14159...,medium,10,draft
toan-hoc,giai-tich,fill_blank,Căn bậc hai của 144 là?,Square root of 144 is?,,,,,,12|mười hai,Vì 12 x 12 = 144,Because 12 x 12 = 144,easy,15,draft
`;
