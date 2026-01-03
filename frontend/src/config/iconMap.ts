/**
 * Icon Mapping Configuration
 *
 * Centralized mapping of icon names to Heroicon components.
 * This provides a consistent way to reference icons throughout the application.
 */

import {
  BellIcon,
  FolderIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  LockClosedIcon,
  KeyIcon,
  UserIcon,
  RocketLaunchIcon,
  TrashIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  LightBulbIcon,
  MegaphoneIcon,
  BeakerIcon,
  HashtagIcon,
  ClockIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckIcon,
  XCircleIcon,
  BoltIcon,
  SparklesIcon,
  CpuChipIcon,
  CommandLineIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  HomeIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  BugAntIcon,
  ShieldExclamationIcon,
  FlagIcon,
  TagIcon,
  ArchiveBoxIcon,
  PlusIcon,
  MinusIcon,
  PencilIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";

/**
 * Icon map object
 * Maps semantic icon names to Heroicon components
 */
export const iconMap = {
  // Notifications & Alerts
  bell: BellIcon,
  inbox: InboxIcon,
  exclamationTriangle: ExclamationTriangleIcon,
  exclamationCircle: ExclamationCircleIcon,
  informationCircle: InformationCircleIcon,
  checkCircle: CheckCircleIcon,
  xCircle: XCircleIcon,

  // Actions
  send: PaperAirplaneIcon,
  trash: TrashIcon,
  close: XMarkIcon,
  check: CheckIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  pencil: PencilIcon,

  // Navigation
  folder: FolderIcon,
  folderOpen: FolderOpenIcon,
  home: HomeIcon,
  arrowRight: ArrowRightIcon,
  arrowLeft: ArrowLeftIcon,
  chevronDown: ChevronDownIcon,
  chevronUp: ChevronUpIcon,
  chevronRight: ChevronRightIcon,
  chevronLeft: ChevronLeftIcon,

  // User & Auth
  user: UserIcon,
  userGroup: UserGroupIcon,
  lock: LockClosedIcon,
  key: KeyIcon,

  // Project & Tasks
  rocket: RocketLaunchIcon,
  clipboard: ClipboardDocumentListIcon,
  document: DocumentTextIcon,
  calendar: CalendarIcon,
  clock: ClockIcon,
  flag: FlagIcon,
  tag: TagIcon,
  archive: ArchiveBoxIcon,

  // Communication
  chat: ChatBubbleLeftRightIcon,
  megaphone: MegaphoneIcon,

  // Development & Tech
  beaker: BeakerIcon,
  bug: BugAntIcon,
  cpu: CpuChipIcon,
  commandLine: CommandLineIcon,
  cog: Cog6ToothIcon,

  // Status & Progress
  arrowPath: ArrowPathIcon,
  bolt: BoltIcon,
  sparkles: SparklesIcon,
  shieldExclamation: ShieldExclamationIcon,

  // Utility
  search: MagnifyingGlassIcon,
  lightBulb: LightBulbIcon,
  hashtag: HashtagIcon,
  questionMark: QuestionMarkCircleIcon,
  eye: EyeIcon,
  eyeSlash: EyeSlashIcon,
  chartBar: ChartBarIcon,
};

/**
 * Type for icon names
 */
export type IconName = keyof typeof iconMap;

/**
 * Get an icon component by name
 * @param name - The icon name
 * @returns The Heroicon component or a fallback
 */
export const getIcon = (name: IconName) => {
  return iconMap[name] || QuestionMarkCircleIcon;
};

export default iconMap;
