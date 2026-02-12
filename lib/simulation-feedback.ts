import { SimulationCategory } from "@/types/simulation";

export interface FeedbackResult {
  title: string;
  message: string;
  practicalInsights: string[];
  jobReadiness: {
    role: string;
    status: 'excellent' | 'good' | 'needs-improvement';
  }[];
}

export function generateSimulationFeedback(
  category: SimulationCategory,
  wpm: number,
  accuracy: number
): FeedbackResult {
  switch (category) {
    case 'email':
      return generateEmailFeedback(wpm, accuracy);
    case 'support':
      return generateSupportFeedback(wpm, accuracy);
    case 'legal':
      return generateLegalFeedback(wpm, accuracy);
    case 'data-entry':
      return generateDataEntryFeedback(wpm, accuracy);
    default:
      return generateDefaultFeedback(wpm, accuracy);
  }
}

function generateEmailFeedback(wpm: number, accuracy: number): FeedbackResult {
  const emailsPerHour = Math.round(wpm * 0.6);
  const emailsPerDay = Math.round(emailsPerHour * 8);

  let title = '';
  if (wpm >= 60) title = 'Executive-Level Typing Speed';
  else if (wpm >= 45) title = 'Professional Office Standard';
  else if (wpm >= 30) title = 'Entry-Level Acceptable';
  else title = 'Keep Practicing for Job Readiness';

  const jobReadiness = [
    {
      role: 'Administrative Assistant',
      status: (wpm >= 40 ? 'excellent' : wpm >= 30 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    },
    {
      role: 'Office Manager',
      status: (wpm >= 50 ? 'excellent' : wpm >= 40 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    },
    {
      role: 'Executive Assistant',
      status: (wpm >= 65 ? 'excellent' : wpm >= 55 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    }
  ];

  return {
    title,
    message: `At ${wpm} WPM with ${accuracy.toFixed(1)}% accuracy, you can handle professional email communication efficiently.`,
    practicalInsights: [
      `You could compose approximately ${emailsPerHour} emails per hour`,
      `That's about ${emailsPerDay} emails per 8-hour workday`,
      accuracy >= 95
        ? 'Your accuracy is excellent for professional communication'
        : 'Consider improving accuracy for error-free professional emails'
    ],
    jobReadiness
  };
}

function generateSupportFeedback(wpm: number, accuracy: number): FeedbackResult {
  const responsesPerHour = Math.round(wpm * 0.8);
  const avgResponseTime = wpm > 0 ? Math.round(60 / (wpm / 50)) : 0;

  let title = '';
  if (wpm >= 55) title = 'Exceptional Customer Support Speed';
  else if (wpm >= 40) title = 'Strong Customer Support Performance';
  else if (wpm >= 30) title = 'Acceptable Support Response Speed';
  else title = 'Practice More for Support Role Readiness';

  const jobReadiness = [
    {
      role: 'Chat Support Agent',
      status: (wpm >= 45 ? 'excellent' : wpm >= 35 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    },
    {
      role: 'Help Desk Specialist',
      status: (wpm >= 40 ? 'excellent' : wpm >= 30 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    },
    {
      role: 'Technical Support Representative',
      status: (wpm >= 50 ? 'excellent' : wpm >= 40 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    }
  ];

  return {
    title,
    message: `Your typing speed enables you to provide ${responsesPerHour} customer responses per hour.`,
    practicalInsights: [
      `Average response time: approximately ${avgResponseTime} seconds per typical message`,
      `You could handle ${responsesPerHour} chat conversations per hour`,
      accuracy >= 98
        ? 'Excellent accuracy - crucial for customer satisfaction'
        : accuracy >= 95
        ? 'Good accuracy - continue maintaining high standards'
        : 'Improve accuracy to avoid miscommunication with customers'
    ],
    jobReadiness
  };
}

function generateLegalFeedback(wpm: number, accuracy: number): FeedbackResult {
  const pagesPerHour = Math.round((wpm * 60) / 250);

  let title = '';
  if (accuracy >= 99 && wpm >= 50) title = 'Excellent Legal Document Proficiency';
  else if (accuracy >= 98 && wpm >= 40) title = 'Strong Legal Typing Skills';
  else if (accuracy >= 95 && wpm >= 30) title = 'Developing Legal Document Skills';
  else title = 'Legal Work Requires Higher Precision';

  const jobReadiness = [
    {
      role: 'Legal Secretary',
      status: (accuracy >= 98 && wpm >= 45 ? 'excellent' : accuracy >= 96 && wpm >= 35 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    },
    {
      role: 'Paralegal',
      status: (accuracy >= 99 && wpm >= 50 ? 'excellent' : accuracy >= 97 && wpm >= 40 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    },
    {
      role: 'Court Reporter',
      status: (accuracy >= 99.5 && wpm >= 60 ? 'excellent' : accuracy >= 99 && wpm >= 50 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    }
  ];

  return {
    title,
    message: `Legal document typing demands precision. Your ${accuracy.toFixed(1)}% accuracy ${accuracy >= 98 ? 'meets' : 'is developing toward'} professional standards.`,
    practicalInsights: [
      `You could type approximately ${pagesPerHour} pages per hour (250 words/page)`,
      accuracy >= 99
        ? 'Outstanding accuracy - essential for legal documents'
        : accuracy >= 98
        ? 'Very good accuracy - aim for 99%+ for sensitive legal work'
        : accuracy >= 95
        ? 'Acceptable accuracy - legal work typically requires 98%+ accuracy'
        : 'Legal documents require exceptional accuracy - focus on precision over speed',
      'In legal work, accuracy is more critical than speed'
    ],
    jobReadiness
  };
}

function generateDataEntryFeedback(wpm: number, accuracy: number): FeedbackResult {
  const recordsPerHour = Math.round(wpm * 2);
  const effectiveSpeed = Math.round(wpm * (accuracy / 100));

  let title = '';
  if (wpm >= 60 && accuracy >= 98) title = 'Expert Data Entry Speed';
  else if (wpm >= 50 && accuracy >= 96) title = 'Professional Data Entry Level';
  else if (wpm >= 40 && accuracy >= 94) title = 'Competent Data Entry Skills';
  else title = 'Developing Data Entry Abilities';

  const jobReadiness = [
    {
      role: 'Data Entry Clerk',
      status: (wpm >= 45 && accuracy >= 96 ? 'excellent' : wpm >= 35 && accuracy >= 94 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    },
    {
      role: 'Medical Records Specialist',
      status: (wpm >= 50 && accuracy >= 98 ? 'excellent' : wpm >= 40 && accuracy >= 96 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    },
    {
      role: 'Financial Data Analyst',
      status: (wpm >= 60 && accuracy >= 99 ? 'excellent' : wpm >= 50 && accuracy >= 97 ? 'good' : 'needs-improvement') as 'excellent' | 'good' | 'needs-improvement'
    }
  ];

  return {
    title,
    message: `At ${wpm} WPM with ${accuracy.toFixed(1)}% accuracy, your effective data entry speed is ${effectiveSpeed} WPM.`,
    practicalInsights: [
      `You could process approximately ${recordsPerHour} data records per hour`,
      `Effective speed (accounting for errors): ${effectiveSpeed} WPM`,
      accuracy >= 98
        ? 'Excellent accuracy for data entry work'
        : accuracy >= 96
        ? 'Good accuracy - aim for 98%+ for financial/medical data'
        : 'Data entry typically requires 96%+ accuracy to minimize corrections'
    ],
    jobReadiness
  };
}

function generateDefaultFeedback(wpm: number, accuracy: number): FeedbackResult {
  return {
    title: 'Typing Performance',
    message: `You typed at ${wpm} WPM with ${accuracy.toFixed(1)}% accuracy.`,
    practicalInsights: [
      'Keep practicing to improve your typing speed',
      'Focus on maintaining high accuracy while increasing speed'
    ],
    jobReadiness: []
  };
}
