const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PHASE1_SECTION_HASH = 'd30e26b8ac54999be7275293b46c0c1c1321168b9a544559593702d067f91eb9';
const PHASE1_ASSET_REFS_HASH = '2b428f03147e12ccb234a7f4ddcd5257bac1493d22abeb5922abef04c9ffee60';
const PHASE2_IDS = [
  'training-phase2-overview', 'training-department-switch', 'training-operating-scope',
  'training-role-dashboards', 'training-dashboard-tnd-manager',
  'training-dashboard-taskforce', 'training-dashboard-am', 'training-dashboard-sm',
  'training-criteria-checklist',
  'training-criteria', 'training-checklist-template', 'training-checklist-lifecycle',
  'training-plans-assignment', 'training-create-plan', 'training-assign-performer',
  'training-plan-lifecycle', 'training-execution', 'training-assigned-schedule',
  'training-store-visit-execution', 'training-camera-check-execution',
  'training-answer-draft-evidence', 'training-submit-lock', 'training-results-confirmation',
  'training-result-list', 'training-result-detail', 'training-result-edit',
  'training-score-confirm-48h', 'training-action-plan', 'training-action-plan-create',
  'training-action-plan-list-detail', 'training-action-plan-update',
  'training-report-export-notification', 'training-filter-export',
  'training-notification-limitations', 'training-faq', 'training-faq-common',
  'training-troubleshooting-report',
];
const UNAVAILABLE_IDS = [];
const REMOVED_SECTION_IDS = [
  'training-dashboard-coo',
  'training-dashboard-om',
  'training-scope-boundaries',
];
const REMOVED_EVIDENCE_IDS = [
  'P2-DB-02', 'P2-DB-03', 'P2-DB-04', 'P2-DB-05',
  'P2-DEP-01', 'P2-DEP-02', 'P2-DEP-04', 'P2-DEP-05', 'P2-DEP-06',
];
const REMOVED_EVIDENCE_PATHS = [
  '/assets/user-guide/2026-07-training-phase-2-full/p2-db-02-tnd-dashboard-tables.png',
  '/assets/user-guide/2026-07-training-phase-2-full/p2-db-03-coo-company-dashboard.png',
  '/assets/user-guide/2026-07-training-phase-2-full/p2-db-04-om-dashboard-loaded.png',
  '/assets/user-guide/2026-07-training-phase-2-full/p2-db-05-om-dashboard-status.png',
  '/assets/user-guide/2026-07-training-phase-2-full/p2-dep-01-tnd-training-shell.png',
  '/assets/user-guide/2026-07-training-phase-2-full/p2-dep-02-taskforce-training-shell.png',
  '/assets/user-guide/2026-07-training-phase-2-full/p2-dep-04-om-training-shell.png',
  '/assets/user-guide/2026-07-training-phase-2-full/p2-dep-05-am-training-shell.png',
  '/assets/user-guide/2026-07-training-phase-2-full/p2-dep-06-sm-training-shell.png',
];
const EXPECTED_LEDGER_COUNTS = {
  planned: 36,
  acceptedCore: 18,
  acceptedConditionalReadOnly: 18,
  acceptedTotal: 36,
  conditionalUnavailable: 0,
  includeInGuide: 36,
  uniqueAcceptedPaths: 36,
  uniqueAcceptedHashes: 35,
  fullViewport: 36,
};
const ALLOWED_STATUSES = new Set(['accepted', 'unavailable']);
const CREDENTIAL_PATTERNS = [
  { label: 'known password', pattern: /123123123/ },
  { label: 'Maycha email address', pattern: /\b[A-Z0-9._%+-]+@maycha\.com\.vn\b/i },
  { label: 'bearer token', pattern: /\bbearer\s+[A-Z0-9._~+/-]+=*/i },
  { label: 'access or refresh token field', pattern: /\b(?:access_token|refresh_token|id_token)\b/i },
  { label: 'JWT token', pattern: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/ },
  { label: 'environment URL', pattern: /https?:\/\/(?:uat\.|localhost(?::\d+)?|127\.0\.0\.1(?::\d+)?)/i },
];
const INTERNAL_COPY_PATTERNS = [
  { label: 'UAT', pattern: /\bUAT\b/i },
  { label: 'developer terminology', pattern: /\b(?:dev|developer)\b/i },
  { label: 'private', pattern: /\bprivate\b/i },
  { label: 'evidence ledger', pattern: /\bevidence\s+ledger\b/i },
  { label: 'implementation status', pattern: /\b(?:chưa\s+implement|not\s+implemented)\b/i },
  { label: 'RBAC', pattern: /\bRBAC\b/i },
  { label: 'API', pattern: /\bAPI\b/ },
  { label: 'database shorthand', pattern: /\bDB\b/ },
  { label: 'cron', pattern: /\bcron\b/i },
  { label: 'fixture', pattern: /\bfixture\b/i },
  { label: 'route', pattern: /\broute\b/i },
];
const NOTIFICATION_COPY_PATTERNS = [
  { label: 'Vietnamese notification guidance', pattern: /thông\s+báo/i },
  { label: 'English notification guidance', pattern: /\bnotifications?\b/i },
];

const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
const sortedUnique = (values) => [...new Set(values)].sort();
const sameStringArray = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function getVisibleBlockText(block) {
  switch (block.type) {
    case 'paragraph':
    case 'label':
      return block.text ?? '';
    case 'steps':
    case 'bullets':
      return Array.isArray(block.items) ? block.items.join(' ') : '';
    case 'table':
      return [
        ...(Array.isArray(block.headers) ? block.headers : []),
        ...(Array.isArray(block.rows) ? block.rows.flat() : []),
      ].join(' ');
    case 'image':
      return [block.alt, block.caption].filter(Boolean).join(' ');
    default:
      return '';
  }
}

function getVisiblePhase2Text(sections) {
  return sections.flatMap((section) => [
    section.title ?? '',
    ...section.blocks.map(getVisibleBlockText),
  ]).join('\n');
}

function validateChildContentOrder(section, fail) {
  const blockLabel = (block) => block.type === 'label' ? block.text : '';
  const requiredContextLabels = ['Dành cho', 'Mục đích', 'Điều kiện thực hiện'];
  const contextIndexes = requiredContextLabels.map((label) =>
    section.blocks.findIndex((block) => blockLabel(block) === label));
  requiredContextLabels.forEach((label, index) => {
    if (contextIndexes[index] < 0) fail(section.id + ' is missing required context label.');
  });
  const actionIndex = section.blocks.findIndex((block) => blockLabel(block).startsWith('Cách thao tác'));
  const resultIndex = section.blocks.findIndex((block) => blockLabel(block) === 'Kết quả');
  const cautionIndex = section.blocks.findIndex((block) => blockLabel(block) === 'Lưu ý nghiệp vụ');
  if (actionIndex < 0) fail(section.id + ' is missing Cách thao tác.');
  if (resultIndex < 0) fail(section.id + ' is missing Kết quả.');
  if (cautionIndex < 0) fail(section.id + ' is missing Lưu ý nghiệp vụ.');
  if (!(actionIndex >= 0 && actionIndex < resultIndex && resultIndex < cautionIndex)) {
    fail(section.id + ' must order Cách thao tác -> Kết quả -> Lưu ý nghiệp vụ.');
  }
  if (contextIndexes.some((index) => index >= actionIndex)) {
    fail(section.id + ' context labels must appear before Cách thao tác.');
  }
  const flowSteps = section.blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block, index }) => block.type === 'steps' && index > actionIndex && index < resultIndex);
  if (flowSteps.length === 0) {
    fail(section.id + ' must contain numbered steps between Cách thao tác and Kết quả.');
  } else if (section.id === 'training-create-plan') {
    const invalidGroup = flowSteps.find(({ block }) => block.items.length < 2 || block.items.length > 7);
    const totalSteps = flowSteps.reduce((total, { block }) => total + block.items.length, 0);
    if (invalidGroup || totalSteps < 4) fail(section.id + ' has invalid internal flow step groups.');
  } else {
    const primarySteps = flowSteps[0]?.block;
    if (!primarySteps || primarySteps.items.length < 4 || primarySteps.items.length > 7) {
      fail(section.id + ' must contain 4-7 primary steps.');
    }
  }
  const imageIndexes = section.blocks
    .map((block, index) => block.type === 'image' ? index : -1)
    .filter((index) => index >= 0);
  if (imageIndexes.some((index) => index <= actionIndex || index >= resultIndex)) {
    fail(section.id + ' images must appear after Cách thao tác and before Kết quả.');
  }
  if (imageIndexes.length > 0 && flowSteps.length > 0 && imageIndexes[0] <= flowSteps[0].index) {
    fail(section.id + ' first image must appear after its numbered instructions.');
  }
  const resultContent = section.blocks.slice(resultIndex + 1, cautionIndex)
    .some((block) => ['paragraph', 'bullets'].includes(block.type));
  if (!resultContent) fail(section.id + ' must explain the expected result.');
  const guardrails = section.blocks.slice(cautionIndex + 1)
    .find((block) => block.type === 'bullets');
  if (!guardrails || guardrails.items.length < 2 || guardrails.items.length > 4) {
    fail(section.id + ' must contain 2-4 business guardrails after Lưu ý nghiệp vụ.');
  }
}

function validatePhase2GuideContract({ guide, projectRoot, fail }) {
  const ledgerPath = path.join(projectRoot, 'src', 'content', 'phase2-evidence-ledger.json');
  if (!ledgerPath.startsWith(path.resolve(projectRoot) + path.sep)) {
    fail('Phase 2 ledger must resolve inside the standalone web package.');
    return { phase2Sections: 0, phase2AcceptedImages: 0 };
  }
  let ledger;
  try {
    ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  } catch (error) {
    fail(`Cannot parse Phase 2 evidence ledger: ${error.message}`);
    return { phase2Sections: 0, phase2AcceptedImages: 0 };
  }

  if (Object.prototype.hasOwnProperty.call(guide, 'sourceDocument')) {
    fail('sourceDocument is forbidden in the web-only guide schema.');
  }
  const publicDownloads = path.join(projectRoot, 'public', 'downloads');
  const currentWordName = 'huong-dan-qaqc.docx';
  const publicWordFiles = fs.existsSync(publicDownloads)
    ? fs.readdirSync(publicDownloads).filter((name) => name.toLowerCase().endsWith('.docx'))
    : [];
  if (!sameStringArray(publicWordFiles.sort(), [currentWordName])) {
    fail(`Public downloads must contain exactly ${currentWordName}; found: ${publicWordFiles.join(', ') || 'none'}.`);
  } else {
    const currentWord = path.join(publicDownloads, currentWordName);
    const bytes = fs.readFileSync(currentWord);
    if (bytes.length < 100_000) fail(`Current Word guide is unexpectedly small: ${bytes.length} bytes.`);
    if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) fail('Current Word guide is not a valid ZIP-based DOCX.');
  }

  const phase1 = guide.sections.slice(0, 50);
  const phase2 = guide.sections.slice(50);
  const guideImageRefs = guide.sections.flatMap((section) => section.blocks
    .filter((block) => block.type === 'image').map((block) => block.src));
  const phase1ImageRefs = phase1.flatMap((section) => section.blocks
    .filter((block) => block.type === 'image').map((block) => block.src));
  if (phase1.length !== 50) fail(`Phase 1 must contain 50 sections, found ${phase1.length}.`);
  if (phase1ImageRefs.length !== 54) fail(`Phase 1 must contain 54 images, found ${phase1ImageRefs.length}.`);
  if (digest(JSON.stringify(phase1)) !== PHASE1_SECTION_HASH) fail('Phase 1 canonical section hash changed.');
  if (digest(JSON.stringify(phase1ImageRefs)) !== PHASE1_ASSET_REFS_HASH) fail('Phase 1 image reference hash changed.');
  if (guide.sections.length !== 87) fail(`Guide must contain 87 sections, found ${guide.sections.length}.`);
  if (guideImageRefs.length !== 90) fail(`Guide must contain 90 image blocks, found ${guideImageRefs.length}.`);

  if (!sameStringArray(phase2.map((section) => section.id), PHASE2_IDS)) {
    fail('Phase 2 section IDs/order differ from the feature-first 37-section contract.');
  }
  REMOVED_SECTION_IDS.forEach((sectionId) => {
    if (phase2.some((section) => section.id === sectionId)) fail(`Removed Phase 2 section must stay absent: ${sectionId}.`);
  });
  REMOVED_EVIDENCE_PATHS.forEach((src) => {
    if (guideImageRefs.includes(src)) fail(`Removed evidence path must stay absent from guide image blocks: ${src}.`);
  });
  if (phase2.filter((section) => section.level === 1).length !== 9) fail('Phase 2 must contain 9 parent sections.');
  if (phase2.filter((section) => section.level === 2).length !== 28) fail('Phase 2 must contain 28 child sections.');
  phase2.filter((section) => section.level === 2).forEach((section) => {
    const labels = section.blocks.filter((block) => block.type === 'label').map((block) => block.text);
    ['Dành cho', 'Mục đích', 'Điều kiện thực hiện', 'Cách thao tác'].forEach((label) => {
      if (!labels.includes(label)) fail(`${section.id} is missing required label "${label}".`);
    });
    const steps = section.blocks.find((block) => block.type === 'steps');
    if (!steps) fail(`${section.id} must contain numbered steps.`);
    if (steps && section.id !== 'training-create-plan' && (steps.items.length < 4 || steps.items.length > 7)) {
      fail(`${section.id} must contain 4-7 steps.`);
    }
    const cautionIndex = section.blocks.findIndex((block) => block.type === 'label' && block.text.startsWith('Lưu ý'));
    const guardrails = section.blocks.slice(cautionIndex + 1).find((block) => block.type === 'bullets');
    if (!guardrails || guardrails.items.length < 2 || guardrails.items.length > 4) {
      fail(`${section.id} must contain 2-4 guardrails.`);
    }
  });

  phase2.filter((section) => section.level === 2)
    .forEach((section) => validateChildContentOrder(section, fail));

  const dashboardParent = phase2.find((section) => section.id === 'training-role-dashboards');
  const dashboardContentsLabelIndex = dashboardParent?.blocks.findIndex((block) =>
    block.type === 'label' && block.text === 'Nội dung trong chương') ?? -1;
  const dashboardContents = dashboardContentsLabelIndex >= 0
    ? dashboardParent.blocks.slice(dashboardContentsLabelIndex + 1).find((block) => block.type === 'bullets')
    : null;
  const expectedDashboardContents = [
    '13.1. Dashboard cấp quản lý — TnD Manager, COO và OM',
    '13.2. Dashboard Taskforce',
    '13.3. Dashboard AM',
    '13.4. Dashboard SM',
  ];
  if (!dashboardContents || !sameStringArray(dashboardContents.items, expectedDashboardContents)) {
    fail('Chapter 13 must list exactly the four approved grouped dashboard sections.');
  }

  const managementDashboard = phase2.find((section) => section.id === 'training-dashboard-tnd-manager');
  if (!managementDashboard || managementDashboard.title !== expectedDashboardContents[0]) {
    fail('training-dashboard-tnd-manager must use the exact grouped management dashboard title.');
  }
  const managementImages = managementDashboard?.blocks.filter((block) => block.type === 'image') ?? [];
  if (managementImages.length !== 1
    || managementImages[0].src !== '/assets/user-guide/2026-07-training-phase-2-full/p2-db-01-tnd-dashboard-loaded.png') {
    fail('Grouped management dashboard must use exactly the single approved TnD Manager dashboard image.');
  }
  const managementScopeTable = managementDashboard?.blocks.find((block) => block.type === 'table');
  const expectedManagementHeaders = ['Vai trò', 'Phạm vi dữ liệu', 'Quyền sử dụng'];
  const expectedManagementRows = [
    ['TnD Manager', 'Toàn bộ dữ liệu Training', 'Quản lý, theo dõi và xuất Excel RSV'],
    ['COO', 'Toàn công ty', 'Chỉ theo dõi, quan sát'],
    ['OM', 'Thương hiệu, đơn vị hoặc khu vực được phân công', 'Chỉ theo dõi, quan sát'],
  ];
  if (!managementScopeTable
    || !sameStringArray(managementScopeTable.headers, expectedManagementHeaders)
    || !sameStringArray(managementScopeTable.rows, expectedManagementRows)) {
    fail('Grouped management dashboard must contain the exact approved role scope and permission table.');
  }
  const managementText = managementDashboard
    ? [managementDashboard.title, ...managementDashboard.blocks.map(getVisibleBlockText)].join(' ')
    : '';
  ['cùng nhóm chỉ số', 'phạm vi'].forEach((term) => {
    if (!managementText.includes(term)) fail(`Grouped management dashboard note is missing ${term}.`);
  });

  const taskforceDashboard = phase2.find((section) => section.id === 'training-dashboard-taskforce');
  if (!taskforceDashboard || taskforceDashboard.title !== '13.2. Dashboard Taskforce') {
    fail('training-dashboard-taskforce must use the exact Dashboard Taskforce title.');
  }
  const amDashboard = phase2.find((section) => section.id === 'training-dashboard-am');
  if (!amDashboard || amDashboard.title !== '13.3. Dashboard AM') {
    fail('training-dashboard-am must use the exact Dashboard AM title.');
  }
  const smDashboard = phase2.find((section) => section.id === 'training-dashboard-sm');
  if (!smDashboard || smDashboard.title !== '13.4. Dashboard SM') {
    fail('training-dashboard-sm must use the exact Dashboard SM title.');
  }
  const overview = phase2.find((section) => section.id === 'training-phase2-overview');
  const roleTable = overview?.blocks.find((block) => block.type === 'table');
  const expectedRoleHeaders = ['Vai trò', 'Phạm vi dữ liệu và công việc', 'Màn hình thường dùng'];
  if (!roleTable || !sameStringArray(roleTable.headers, expectedRoleHeaders)) {
    fail('Phase 2 overview must contain the client-facing three-column role table.');
  }
  const expectedRoles = ['TnD Manager', 'Taskforce', 'COO', 'OM', 'AM', 'SM'];
  const actualRoles = roleTable?.rows?.map((row) => row[0]) ?? [];
  if (!sameStringArray(actualRoles, expectedRoles)) fail('Phase 2 overview role table must contain the exact six roles in order.');
  const amScope = roleTable?.rows?.find((row) => row[0] === 'AM')?.[1] ?? '';
  if (!amScope.includes('TnD Manager phân công đích danh') || !amScope.includes('cửa hàng thuộc phạm vi')) {
    fail('AM scope must require both named TnD assignment and managed-store scope.');
  }
  const smScope = roleTable?.rows?.find((row) => row[0] === 'SM')?.[1] ?? '';
  if (!smScope.includes('48 giờ')) fail('SM scope must state the 48-hour confirmation window.');
  const flowLabelIndex = overview?.blocks.findIndex((block) => block.type === 'label' && block.text === 'Luồng vận hành tổng quát') ?? -1;
  const flow = flowLabelIndex >= 0 ? overview.blocks.slice(flowLabelIndex + 1).find((block) => block.type === 'steps') : null;
  if (!flow || flow.items.length !== 6) fail('Phase 2 overview must contain the six-step general operating flow.');
  const flowText = flow?.items?.join(' ') ?? '';
  ['phát hành', 'Taskforce', 'lưu nháp', 'TnD Manager rà soát', '48 giờ', 'Action Plan'].forEach((term) => {
    if (!flowText.includes(term)) fail(`Phase 2 operating flow is missing "${term}".`);
  });
  if (!Array.isArray(ledger.rows)) {
    fail('Evidence ledger rows must be an array.');
    return { phase2Sections: phase2.length, phase2AcceptedImages: 0 };
  }
  REMOVED_EVIDENCE_IDS.forEach((evidenceId) => {
    if (ledger.rows.some((row) => row.evidenceId === evidenceId)) {
      fail(`Removed evidence ID must stay absent from ledger rows: ${evidenceId}.`);
    }
  });
  REMOVED_EVIDENCE_PATHS.forEach((src) => {
    if (ledger.rows.some((row) => row.src === src || row.assetPath === src)) {
      fail(`Removed evidence path must stay absent from ledger rows: ${src}.`);
    }
  });
  if (ledger.rows.length !== 36) fail(`Evidence ledger must contain exactly 36 rows, found ${ledger.rows.length}.`);
  Object.entries(EXPECTED_LEDGER_COUNTS).forEach(([key, expected]) => {
    if (!ledger.counts || ledger.counts[key] !== expected) {
      fail(`ledger.counts.${key} must equal ${expected}.`);
    }
  });

  const phase2IdSet = new Set(PHASE2_IDS);
  const ledgerIds = new Set();
  const acceptedRows = [];
  const unavailableRows = [];
  ledger.rows.forEach((row, index) => {
    const location = `ledger.rows[${index}]`;
    if (typeof row.evidenceId !== 'string' || ledgerIds.has(row.evidenceId)) {
      fail(`${location} has a missing or duplicate evidenceId.`);
    }
    ledgerIds.add(row.evidenceId);

    if (!ALLOWED_STATUSES.has(row.status)) fail(`${row.evidenceId} has unsupported status "${row.status}".`);    if (!phase2IdSet.has(row.sectionId)) fail(`${row.evidenceId} maps to unknown Phase 2 sectionId "${row.sectionId}".`);


    if (row.status === 'accepted') {
      acceptedRows.push(row);
      if (row.includeInGuide !== true) fail(`${row.evidenceId} accepted evidence must be included.`);    } else if (row.status === 'unavailable') {
      unavailableRows.push(row);
      if (row.includeInGuide !== false) fail(`${row.evidenceId} unavailable evidence cannot be included.`);    }
  });

  if (acceptedRows.length !== 36) fail(`Accepted/include evidence count must be exactly 36, found ${acceptedRows.length}.`);
  if (unavailableRows.length !== 0) fail(`Unavailable evidence count must be exactly 0, found ${unavailableRows.length}.`);
  const actualUnavailableIds = unavailableRows.map((row) => row.evidenceId).sort();
  if (!sameStringArray(actualUnavailableIds, [...UNAVAILABLE_IDS].sort())) {
    fail(`Unavailable evidence IDs must exactly match: ${UNAVAILABLE_IDS.join(', ')}.`);
  }
  const acceptedCore = acceptedRows.filter((row) => row.evidenceClass === 'core').length;
  const acceptedConditional = acceptedRows.filter((row) => row.evidenceClass === 'conditional').length;
  if (acceptedCore !== 18) fail(`Accepted core evidence must be exactly 18, found ${acceptedCore}.`);
  if (acceptedConditional !== 18) fail(`Accepted conditional evidence must be exactly 18, found ${acceptedConditional}.`);
  if (ledger.counts.acceptedCore + ledger.counts.acceptedConditionalReadOnly !== ledger.counts.acceptedTotal) {
    fail('Ledger accepted count equation is inconsistent.');
  }
  if (ledger.counts.acceptedTotal + ledger.counts.conditionalUnavailable !== ledger.counts.planned) {
    fail('Ledger planned count equation is inconsistent.');
  }
  if (ledger.counts.includeInGuide !== acceptedRows.length) fail('Ledger includeInGuide count differs from accepted rows.');

  const acceptedPaths = acceptedRows.map((row) => row.src);
  const acceptedHashes = acceptedRows.map((row) => row.sha256);
  if (sortedUnique(acceptedPaths).length !== 36) fail('Accepted ledger paths must contain exactly 36 unique values.');
  if (sortedUnique(acceptedHashes).length !== 35) fail('Accepted ledger hashes must contain exactly 35 unique values.');

  const phase2ImageBindings = phase2.flatMap((section) => section.blocks
    .filter((block) => block.type === 'image')
    .map((block) => ({ sectionId: section.id, ...block })));
  if (phase2ImageBindings.length !== 36) {
    fail(`Phase 2 must contain exactly 36 full-screen image blocks, found ${phase2ImageBindings.length}.`);
  }
  const guidePaths = phase2ImageBindings.map((block) => block.src).sort();
  const ledgerPaths = acceptedRows.map((row) => row.src).sort();
  if (!sameStringArray(guidePaths, ledgerPaths)) {
    fail('Phase 2 image paths must exactly match accepted ledger rows.');
  }
  acceptedRows.forEach((row) => {
    if (!phase2ImageBindings.some((block) => block.sectionId === row.sectionId && block.src === row.src)) {
      fail(`${row.evidenceId} image path is not mapped to its declared sectionId.`);
    }
  });

  acceptedRows.forEach((row) => {
    const image = phase2ImageBindings.find((block) => block.sectionId === row.sectionId && block.src === row.src);
    const assetPath = typeof row.src === 'string'
      ? path.join(projectRoot, 'public', row.src.replace(/^\//, ''))
      : '';
    if (!image) return;
    if (!assetPath || !fs.existsSync(assetPath)) {
      fail(`${row.evidenceId} asset does not exist at ${row.src}.`);
      return;
    }
    if (row.assetPath !== row.src) fail(`${row.evidenceId} assetPath must equal src.`);
    const bytes = fs.readFileSync(assetPath);
    if (digest(bytes) !== row.sha256 || row.assetSha256 !== row.sha256) fail(`${row.evidenceId} SHA-256 binding failed.`);
    if (bytes.length !== row.byteSize) fail(`${row.evidenceId} byteSize differs from asset.`);
    if (bytes.toString('ascii', 1, 4) !== 'PNG') fail(`${row.evidenceId} is not a PNG.`);
    if (bytes.readUInt32BE(16) !== row.width || bytes.readUInt32BE(20) !== row.height) {
      fail(`${row.evidenceId} dimensions differ from asset.`);
    }
    const expectedFullViewportDimensions = new Set([
      '1440x900', '1440x1000', '1913x924', '1917x896',
      '1919x922', '1920x911', '1920x923',
    ]);
    const isExpectedFullViewport = expectedFullViewportDimensions.has(`${row.width}x${row.height}`);
    if (row.captureStyle !== 'full-browser-viewport' || !isExpectedFullViewport) {
      fail(`${row.evidenceId} must be an accepted full-browser-viewport dimension.`);
    }
  });


  // Scan customer-visible Phase 2 copy only. Asset paths and ledger metadata are
  // intentionally excluded to avoid false positives from internal evidence data.
  const credentialScanTarget = getVisiblePhase2Text(phase2);
  CREDENTIAL_PATTERNS.forEach(({ label, pattern }) => {
    if (pattern.test(credentialScanTarget)) fail(`Phase 2 customer copy contains forbidden credential material: ${label}.`);
  });
  INTERNAL_COPY_PATTERNS.forEach(({ label, pattern }) => {
    if (pattern.test(credentialScanTarget)) fail(`Phase 2 customer copy contains internal terminology: ${label}.`);
  });
  NOTIFICATION_COPY_PATTERNS.forEach(({ label, pattern }) => {
    if (pattern.test(credentialScanTarget)) fail(`Phase 2 customer copy still contains excluded notification guidance: ${label}.`);
  });
  return {
    phase1Hash: digest(JSON.stringify(phase1)),
    phase2Sections: phase2.length,
    phase2AcceptedImages: acceptedRows.length,
    phase2UnavailableEvidence: unavailableRows.length,
  };
}

module.exports = { validatePhase2GuideContract };






