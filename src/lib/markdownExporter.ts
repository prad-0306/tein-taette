import { FinalReportData } from './types';

export function generateMarkdownReport(report: FinalReportData): string {
  const dateStr = report.dateGenerated || new Date().toLocaleDateString('en-US');

  return `# ProfessorX — Interrogation Weakness Report & Repair Plan
**Subject:** ${report.subject}  
**Date of Interrogation:** ${dateStr}  
**Final Grade:** **${report.grade}** (${report.overallScore}% Accuracy)  
**Status:** ${report.verdictTitle}  

---

## 1. Executive Summary & Diagnostic Verdict
${report.verdictSummary}

- **Total Questions Interrogated:** ${report.totalQuestions}
- **Accuracy Rate:** ${report.accuracyRate}%
- **Strongest Domains:** ${report.strongestTopics.join(', ') || 'N/A'}

---

## 2. Topic-by-Topic Mastery Breakdown

| Topic | Tested Mastery | Status | Primary Observation |
| :--- | :--- | :--- | :--- |
${report.topicMasteries
  .map(
    (t) =>
      `| **${t.topic}** | ${t.mastery}% | ${
        t.mastery >= 80 ? '✅ Solid' : t.mastery >= 60 ? '⚠️ Borderline' : '❌ Critical Gap'
      } | ${
        report.weakTopics.find((w) => w.topic === t.topic)?.primaryReason ||
        'Defended successfully under interrogation'
      } |`
  )
  .join('\n')}

---

## 3. Surface & Root Misconceptions Exposed
${
  report.misconceptionsSummary.length > 0
    ? report.misconceptionsSummary
        .map(
          (m, idx) => `### Misconception ${idx + 1}: ${m.topic}
- **What You Assumed:** *"${m.whatYouThought}"*
- **The Physical / Logical Reality:** ${m.reality}
`
        )
        .join('\n')
    : '_No catastrophic misconceptions were triggered during this gauntlet._'
}

---

## 4. Personalized Repair Plan & Remedial Practice Drills

${report.repairPlan
  .map(
    (item, idx) => `### [Action Item ${idx + 1}] — Focus: ${item.topic}
**Prescription:** ${item.actionItem}

#### Remedial Practice Challenge:
> **Question:** ${item.practiceQuestion.question}  
>  
> *Hint:* ${item.practiceQuestion.hint}  
>  
> <details>
> <summary>View Solution</summary>
> 
> **Solution:** ${item.practiceQuestion.solution}
> </details>
`
  )
  .join('\n\n')}

---

## 5. Strategic Next Steps
${report.nextSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

---
*Generated autonomously by ProfessorX — Adaptive AI Oral Exam Simulator (Track 1: Applied AI & Next-Gen Agents)*
`;
}

export function downloadMarkdownFile(filename: string, content: string) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.md') ? filename : `${filename}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
