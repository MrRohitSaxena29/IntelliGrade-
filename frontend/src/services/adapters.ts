/**
 * Data Adapters
 * Bridges Spring Boot camelCase DTOs with the frontend UI snake_case model interfaces.
 */

import {
  Exam,
  BatchUpload,
  AnswerSheet,
  Result,
  EvaluationItem,
  AuditLog,
  OCRPage,
  OCRBoundingBox,
  BatchStatus,
} from '../types';

import {
  ApiExamDetail,
  ApiBatchSummary,
  ApiSheetEvaluationResponse,
  ApiResultDetail,
  ApiEvaluationItem,
  ApiAuditLog,
  ApiOCRPage,
  ApiBoundingBox,
} from './api';

export function mapApiExamToExam(apiExam: ApiExamDetail): Exam {
  return {
    exam_id: apiExam.examId,
    exam_title: apiExam.examTitle,
    subject: apiExam.subject,
    total_marks: apiExam.totalMarks,
    institute_id: apiExam.instituteId,
    date: apiExam.date || new Date().toISOString().substring(0, 10),
    academic_year: apiExam.academicYear || '2025-26',
  };
}

export function mapApiBatchToBatchUpload(apiBatch: ApiBatchSummary): BatchUpload {
  return {
    upload_id: apiBatch.uploadId,
    exam_id: apiBatch.examId,
    user_id: apiBatch.userId,
    batch_name: apiBatch.batchName,
    batch_status: (apiBatch.batchStatus as BatchStatus) || 'PROCESSING',
    s3_archive_url: apiBatch.s3ArchiveUrl,
    total_sheets: apiBatch.totalSheets,
    processed_sheets: apiBatch.processedSheets,
    uploaded_at: apiBatch.uploadedAt ? apiBatch.uploadedAt.replace('T', ' ').substring(0, 16) : '',
    processing_step: apiBatch.processingStep || 'Processing...',
  };
}

export function mapApiEvaluationItemToEvaluationItem(
  apiItem: ApiEvaluationItem,
  resultId: string
): EvaluationItem {
  return {
    eval_item_id: apiItem.evalItemId,
    result_id: resultId,
    question_id: apiItem.questionId,
    rubric_id: apiItem.rubricId,
    marks_awarded: apiItem.marksAwarded,
    max_marks: apiItem.maxMarks,
    ai_justification: apiItem.aiJustification,
    key_positives: apiItem.keyPositives || [],
    key_gaps: apiItem.keyGaps || [],
    teacher_marks: apiItem.teacherMarks,
    teacher_notes: apiItem.teacherNotes,
    is_overridden: apiItem.isOverridden,
  };
}

export function mapApiResultToResult(apiResult: ApiResultDetail): Result {
  return {
    result_id: apiResult.resultId,
    sheet_id: apiResult.sheetId,
    exam_id: apiResult.examId,
    student_id: apiResult.studentId,
    final_score: apiResult.finalScore,
    total_marks: apiResult.totalMarks,
    percentage: Math.round(apiResult.percentage),
    grade_letter: apiResult.gradeLetter,
    overall_feedback: apiResult.overallFeedback,
    status: (apiResult.status as BatchStatus) || 'AI_GRADED',
    s3_report_url: apiResult.s3ReportUrl,
    approved_by_user_id: apiResult.approvedByUserId,
    approved_at: apiResult.approvedAt,
    evaluation_items: (apiResult.items || []).map((it) =>
      mapApiEvaluationItemToEvaluationItem(it, apiResult.resultId)
    ),
  };
}

export function mapApiBoundingBox(apiBox: ApiBoundingBox, pageId: string): OCRBoundingBox {
  return {
    box_id: apiBox.boxId,
    page_id: pageId,
    question_id: apiBox.questionId,
    coordinates: {
      x: apiBox.coordX,
      y: apiBox.coordY,
      width: apiBox.coordWidth,
      height: apiBox.coordHeight,
    },
    detected_text: apiBox.detectedText,
    confidence_score: apiBox.confidenceScore,
    line_index: apiBox.lineIndex,
  };
}

export function mapApiOCRPage(apiPage: ApiOCRPage, sheetId: string): OCRPage {
  return {
    page_id: apiPage.pageId,
    sheet_id: sheetId,
    page_number: apiPage.pageNumber,
    full_text_content: apiPage.fullTextContent,
    image_preview_url: apiPage.imagePreviewUrl,
    bounding_boxes: (apiPage.boundingBoxes || []).map((b) =>
      mapApiBoundingBox(b, apiPage.pageId)
    ),
  };
}

export function mapApiSheetEvaluationToEntities(res: ApiSheetEvaluationResponse): {
  sheet: AnswerSheet;
  result: Result;
  pages: OCRPage[];
} {
  const sheet: AnswerSheet = {
    sheet_id: res.sheetId,
    batch_upload_id: 'batch-001',
    student_id: res.student?.studentId || 'stu-101',
    extracted_student_roll: res.student?.rollNumber || '12044',
    s3_pdf_url: res.s3PdfUrl,
    page_count: res.pageCount,
    status: (res.status as BatchStatus) || 'AI_GRADED',
    uploaded_at: res.uploadedAt ? res.uploadedAt.replace('T', ' ').substring(0, 16) : '',
  };

  const result: Result = mapApiResultToResult(res.result);
  const pages: OCRPage[] = (res.pages || []).map((p) => mapApiOCRPage(p, res.sheetId));

  return { sheet, result, pages };
}

export function mapApiAuditLogToAuditLog(apiLog: ApiAuditLog): AuditLog {
  let changeType: 'MARKS_OVERRIDE' | 'STATUS_APPROVE' | 'FEEDBACK_EDIT' = 'MARKS_OVERRIDE';
  if (apiLog.action && apiLog.action.includes('APPROVE')) {
    changeType = 'STATUS_APPROVE';
  } else if (apiLog.action && apiLog.action.includes('FEEDBACK')) {
    changeType = 'FEEDBACK_EDIT';
  }

  return {
    log_id: apiLog.logId,
    result_id: apiLog.resultId,
    question_id: apiLog.questionId || 'Q',
    user_id: apiLog.userId,
    user_name: apiLog.userName,
    change_type: changeType,
    old_marks: apiLog.priorValue ?? 0,
    new_marks: apiLog.newValue ?? 0,
    reason: apiLog.justification || '',
    timestamp: apiLog.createdAt ? apiLog.createdAt.replace('T', ' ').substring(0, 16) : '',
  };
}
