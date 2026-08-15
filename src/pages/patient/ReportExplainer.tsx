import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FileText,
  Sparkles,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";
import { explainMedicalReport } from "../../services/geminiService";
import { AIReportExplanation } from "../../types";
import { AIReportExplanationCard } from "../../components/cards/AIResponseCard";
import { LoadingState } from "../../components/common/LoadingState";
import { DisclaimerBanner } from "../../components/common/DisclaimerBanner";
import { ErrorMessage } from "../../components/common/ErrorMessage";

export const ReportExplainer: React.FC = () => {
  const { medicalReports } = useHospital();
  const [searchParams] = useSearchParams();
  const reportIdParam = searchParams.get("id");

  const [selectedReportId, setSelectedReportId] = useState<string>(
    reportIdParam || medicalReports[0]?.id || ""
  );
  const [customReportText, setCustomReportText] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [reportTitle, setReportTitle] = useState<string>("Complete Blood Count (CBC) Panel");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<AIReportExplanation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedReport = medicalReports.find((r) => r.id === selectedReportId);

  useEffect(() => {
    if (selectedReport) {
      setCustomReportText(selectedReport.rawText);
      setReportTitle(selectedReport.title);
      setUploadedFileName(null);
    }
  }, [selectedReportId]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setReportTitle(file.name.replace(/\.[^/.]+$/, ""));
      // Simulate extracted text from OCR / PDF parser
      setCustomReportText(
        `[Extracted Text from ${file.name}]\nPATIENT DIAGNOSTIC LAB REPORT\n` +
          `Test Name: Comprehensive Blood Panel\n` +
          `Hemoglobin (Hb): 13.8 g/dL (Reference: 12.0 - 15.5)\n` +
          `WBC Count: 6,800 /mcL (Reference: 4,500 - 11,000)\n` +
          `Platelet Count: 240,000 /mcL (Reference: 150,000 - 450,000)\n` +
          `Fasting Serum Glucose: 98 mg/dL (Reference: 70 - 99)\n` +
          `Total Cholesterol: 192 mg/dL (Desirable: <200)\n` +
          `Impression: Normal biochemical values. Routine monitoring advised.`
      );
    }
  };

  const handleExplain = async () => {
    if (!customReportText.trim()) return;

    setIsAiLoading(true);
    setError(null);

    try {
      const res = await explainMedicalReport({
        reportType: reportTitle,
        reportText: customReportText,
      });
      setExplanation(res);
    } catch (err: any) {
      setError(err.message || "Failed to generate report explanation.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-600/15">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-indigo-100 w-fit mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Patient Health Literacy & Document Translation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Medical Report Explainer
        </h1>
        <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-2xl leading-relaxed">
          Demystify lab values, blood tests, and radiology reports. MediFlow AI translates complex terminology into simple, clear explanations and helps you formulate questions for your clinician.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-900">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-snug">
          <strong>Educational Support Only:</strong> This AI explanation helps you understand terms and does <strong>NOT</strong> provide diagnosis or treatment. Always discuss clinical findings with your doctor.
        </div>
      </div>

      {/* Input Section: Pre-loaded Select + File Drag & Drop + Raw Text */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Sample Reports Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select a Recent Lab Report on File:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {medicalReports.map((rep) => (
              <button
                key={rep.id}
                type="button"
                onClick={() => setSelectedReportId(rep.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  selectedReportId === rep.id && !uploadedFileName
                    ? "bg-indigo-50 border-indigo-500 text-indigo-950 shadow-xs ring-1 ring-indigo-500"
                    : "bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-mono text-slate-500">{rep.date}</span>
                </div>
                <div className="font-bold text-xs mt-2 truncate">{rep.title}</div>
                <div className="text-[11px] text-slate-500 truncate">{rep.doctorName}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Custom File Option */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Or Upload PDF / Image of Report:
          </label>
          <label className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/30">
            <UploadCloud className="w-8 h-8 text-indigo-600 mb-2" />
            <div className="text-xs font-bold text-slate-800">
              {uploadedFileName ? (
                <span className="text-indigo-700 font-semibold">Loaded: {uploadedFileName}</span>
              ) : (
                "Click or drag file to upload lab report (PDF, JPG, PNG)"
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports standard diagnostic panels, pathology & biochemistry slips
            </p>
            <input
              type="file"
              accept=".pdf,image/*,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Report Content Preview & Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-800">
              Diagnostic Content to Translate:
            </label>
            <span className="text-[11px] text-slate-400">
              Plain text or OCR values
            </span>
          </div>
          <textarea
            rows={6}
            value={customReportText}
            onChange={(e) => setCustomReportText(e.target.value)}
            className="w-full p-4 font-mono text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed"
          />
        </div>

        {/* Explain Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            Ready to translate {reportTitle}
          </div>
          <button
            type="button"
            onClick={handleExplain}
            disabled={isAiLoading || !customReportText.trim()}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            {isAiLoading ? (
              <span>Translating Lab Terms...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Explain Report with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isAiLoading && (
        <LoadingState
          isAi
          message="Translating medical terminology..."
          subMessage="Converting clinical lab indices, reference ranges, and parameters into patient-friendly explanations."
        />
      )}

      {/* Error Message */}
      {error && <ErrorMessage message={error} onRetry={handleExplain} />}

      {/* Structured Result Explanation */}
      {explanation && !isAiLoading && (
        <AIReportExplanationCard data={explanation} />
      )}

      {/* Mandatory Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
