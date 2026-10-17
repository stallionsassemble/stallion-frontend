export type ApplicationQuestionType =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'EMAIL'
  | 'URL'
  | 'NUMBER'
  | 'DROPDOWN'
  | 'SINGLE_CHOICE'
  | 'MULTI_CHOICE'
  | 'TEAM_MODE'
  | 'TEAM_NAME'
  | 'IMAGE_UPLOAD'

export interface ApplicationQuestion {
  id: string
  type: ApplicationQuestionType
  label: string
  helpText?: string
  required: boolean
  options?: string[]
  section?: string
  visibleWhen?: { questionId: string; equals: string }
}

export type ApplicationAnswers = Record<string, string | string[]>

export const QUESTION_TYPE_LABELS: Record<ApplicationQuestionType, string> = {
  SHORT_TEXT: 'Short answer',
  LONG_TEXT: 'Long answer',
  EMAIL: 'Email',
  URL: 'Link',
  NUMBER: 'Number',
  DROPDOWN: 'Dropdown',
  SINGLE_CHOICE: 'Single choice',
  MULTI_CHOICE: 'Multiple choice',
  TEAM_MODE: 'Team choice',
  TEAM_NAME: 'Team name',
  IMAGE_UPLOAD: 'Image upload',
}

export const CHOICE_TYPES: ApplicationQuestionType[] = [
  'DROPDOWN',
  'SINGLE_CHOICE',
  'MULTI_CHOICE',
  'TEAM_MODE',
]

export const hasOptions = (type: ApplicationQuestionType) => CHOICE_TYPES.includes(type)

export const newQuestionId = () => `q_${Math.random().toString(36).slice(2, 9)}`

export function createQuestion(type: ApplicationQuestionType): ApplicationQuestion {
  const base: ApplicationQuestion = {
    id: newQuestionId(),
    type,
    label: '',
    required: false,
  }
  if (type === 'TEAM_MODE') {
    return {
      ...base,
      label: 'How are you registering?',
      required: true,
      options: ["I'm registering individually and need a team.", "I'm registering as part of an existing team."],
    }
  }
  if (type === 'TEAM_NAME') return { ...base, label: 'Team name' }
  if (hasOptions(type)) return { ...base, options: ['Option 1', 'Option 2'] }
  return base
}

/** Whether a question should currently be shown, given the answers so far. */
export function isQuestionVisible(question: ApplicationQuestion, answers: ApplicationAnswers) {
  if (!question.visibleWhen) return true
  const answer = answers[question.visibleWhen.questionId]
  return Array.isArray(answer)
    ? answer.includes(question.visibleWhen.equals)
    : answer === question.visibleWhen.equals
}

/** Returns a map of questionId -> message for every visible question that fails validation. */
export function validateAnswers(questions: ApplicationQuestion[], answers: ApplicationAnswers) {
  const errors: Record<string, string> = {}
  for (const q of questions) {
    if (!isQuestionVisible(q, answers)) continue
    const value = answers[q.id]
    const empty = Array.isArray(value) ? value.length === 0 : !String(value ?? '').trim()
    if (empty) {
      if (q.required) errors[q.id] = 'This question is required.'
      continue
    }
    const text = Array.isArray(value) ? '' : String(value).trim()
    if (q.type === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      errors[q.id] = 'Enter a valid email address.'
    } else if (q.type === 'URL' && !/^https?:\/\/\S+\.\S+/i.test(text)) {
      errors[q.id] = 'Enter a full link starting with https://'
    } else if (q.type === 'NUMBER' && !Number.isFinite(Number(text))) {
      errors[q.id] = 'Enter a number.'
    }
  }
  return errors
}

/** Light client-side check of a form being built, mirrors the backend rules. */
export function validateFormDefinition(questions: ApplicationQuestion[]): string | null {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    if (!q.label.trim()) return `Question ${i + 1} needs a label.`
    if (hasOptions(q.type)) {
      const options = (q.options || []).map((o) => o.trim()).filter(Boolean)
      if (options.length < 2) return `"${q.label}" needs at least two options.`
      if (new Set(options).size !== options.length) return `"${q.label}" has duplicate options.`
      if (q.type === 'TEAM_MODE' && options.length !== 2) {
        return `"${q.label}" must have exactly two options.`
      }
    }
  }
  if (questions.filter((q) => q.type === 'TEAM_MODE').length > 1) {
    return 'Only one team choice question is allowed.'
  }
  if (questions.filter((q) => q.type === 'TEAM_NAME').length > 1) {
    return 'Only one team name question is allowed.'
  }
  return null
}

/** Removes empty options and tidies a form before it is sent to the API. */
export function cleanFormForSubmit(questions: ApplicationQuestion[]): ApplicationQuestion[] {
  return questions.map((q) => ({
    ...q,
    label: q.label.trim(),
    helpText: q.helpText?.trim() || undefined,
    section: q.section?.trim() || undefined,
    options: hasOptions(q.type) ? (q.options || []).map((o) => o.trim()).filter(Boolean) : undefined,
    visibleWhen: q.visibleWhen?.questionId && q.visibleWhen.equals ? q.visibleWhen : undefined,
  }))
}

const q = (
  id: string,
  type: ApplicationQuestionType,
  label: string,
  section: string,
  extra: Partial<ApplicationQuestion> = {}
): ApplicationQuestion => ({ id, type, label, section, required: true, ...extra })

const EXISTING_TEAM = "I'm registering as part of an existing team."

/** A short, general-purpose form. */
export const SIMPLE_APPLICATION_TEMPLATE: ApplicationQuestion[] = [
  q('full_name', 'SHORT_TEXT', 'Full name', 'About you'),
  q('email', 'EMAIL', 'Email address', 'About you'),
  q('location', 'SHORT_TEXT', 'Location (City and Country)', 'About you'),
  q('profile_link', 'URL', 'Social or portfolio link', 'About you', { required: false }),
  q('idea', 'LONG_TEXT', 'What do you intend to build?', 'Your project'),
]

/** The EmpowerHer form, as a starting point that admins can edit per hackathon. */
export const EMPOWERHER_TEMPLATE: ApplicationQuestion[] = [
  q('full_name', 'SHORT_TEXT', 'Full name', 'Personal information'),
  q('email', 'EMAIL', 'Email address', 'Personal information'),
  q('location', 'SHORT_TEXT', 'Location (City and Country)', 'Personal information'),
  q('social_link', 'URL', 'Social profile link (X or LinkedIn)', 'Personal information'),
  q('roles', 'MULTI_CHOICE', 'Which role(s) can you contribute in?', 'Skills and experience', {
    helpText: 'Select all that apply.',
    options: [
      'Product Designer / UI/UX Designer',
      'Frontend Developer',
      'Backend Developer',
      'Full-stack Developer',
      'Vibe Coder',
      'Product Manager',
      'Project Manager',
      'Blockchain / Smart Contract Developer',
      'Other',
    ],
  }),
  q('portfolio', 'URL', 'GitHub link / Portfolio link', 'Skills and experience', { required: false }),
  q('experience', 'SINGLE_CHOICE', 'How would you describe your experience?', 'Skills and experience', {
    options: [
      'Beginner / still learning',
      'Some experience / have worked on projects',
      'Experienced / have built or shipped products',
    ],
  }),
  q('build', 'LONG_TEXT', 'What do you intend to build during the hackathon?', 'Project idea'),
  q('problem', 'LONG_TEXT', 'What problem does your idea solve, and who is it for?', 'Project idea'),
  q('stage', 'SINGLE_CHOICE', 'What stage is your project currently at?', 'Project idea', {
    options: ['Idea stage', 'Already started building', 'Existing product that needs improvement'],
  }),
  q('team_mode', 'TEAM_MODE', 'How are you registering?', 'Team registration', {
    helpText:
      'Every participant must complete their own application, including members of existing teams. All members of an existing team must use the exact same team name. Participants registering individually will be matched with others based on skills, interests and project ideas.',
    options: ["I'm registering individually and need a team.", EXISTING_TEAM],
  }),
  q('team_name', 'TEAM_NAME', 'Team name', 'Team registration', {
    helpText: 'For existing teams only. Use the exact same name as your teammates.',
    visibleWhen: { questionId: 'team_mode', equals: EXISTING_TEAM },
  }),
  q('team_size', 'DROPDOWN', 'Number of members in your team, including you', 'Team registration', {
    helpText: 'For existing teams only.',
    options: ['2 members', '3 members', '4 members', '5 or more members'],
    visibleWhen: { questionId: 'team_mode', equals: EXISTING_TEAM },
  }),
]

/**
 * Ready-made submission fields. The creator picks the ones they want and decides whether each is
 * required. Title, track and description are always asked and are not part of this list.
 */
export const SUBMISSION_PRESETS: { key: string; label: string; question: ApplicationQuestion }[] = [
  {
    key: 'demo_link',
    label: 'Demo link',
    question: { id: 'demo_link', type: 'URL', label: 'Demo link', required: true, section: 'Project materials', helpText: 'Where can judges try your project?' },
  },
  {
    key: 'pitch_deck',
    label: 'Pitch deck',
    question: {
      id: 'pitch_deck',
      type: 'URL',
      label: 'Pitch deck link',
      required: true, section: 'Project materials',
      helpText: 'Link to your slides (Google Slides, Canva, Drive, Pitch). Make sure anyone with the link can view it.',
    },
  },
  {
    key: 'github',
    label: 'GitHub repository',
    question: {
      id: 'github',
      type: 'URL',
      label: 'GitHub repository link',
      required: false, section: 'Project materials',
      helpText: 'Link to your code. Make sure the repository is public or shared with the judges.',
    },
  },
  {
    key: 'demo_video',
    label: 'Demo video',
    question: { id: 'demo_video', type: 'URL', label: 'Demo video link', required: false, section: 'Project materials', helpText: 'YouTube, Loom or similar.' },
  },
  {
    key: 'screenshots',
    label: 'Screenshots',
    question: { id: 'screenshots', type: 'IMAGE_UPLOAD', label: 'Screenshots', required: false, section: 'Project materials', helpText: 'Up to 5 images, 5 MB each.' },
  },
]

/** What participants see when the creator has not set any submission fields. */
export const DEFAULT_SUBMISSION_QUESTIONS: ApplicationQuestion[] = ['demo_link', 'github', 'screenshots', 'demo_video'].map(
  (key) => ({ ...SUBMISSION_PRESETS.find((p) => p.key === key)!.question })
)

/** The old fixed fields that some answers are also copied into, so existing views keep working. */
export const LEGACY_SUBMISSION_FIELDS: Record<string, 'submissionLink' | 'repositoryUrl' | 'videoUrl'> = {
  demo_link: 'submissionLink',
  github: 'repositoryUrl',
  demo_video: 'videoUrl',
}

/** Image links stored in a submission, from the legacy list and from upload questions. */
export function submissionImages(
  submissionData: { images?: unknown; answers?: Record<string, unknown> } | null | undefined,
  questions: ApplicationQuestion[]
): string[] {
  const urls: string[] = []
  if (Array.isArray(submissionData?.images)) urls.push(...(submissionData!.images as string[]))
  for (const q of questions) {
    const value = submissionData?.answers?.[q.id]
    if (q.type === 'IMAGE_UPLOAD' && Array.isArray(value)) urls.push(...(value as string[]))
  }
  return urls.filter((u) => typeof u === 'string')
}
