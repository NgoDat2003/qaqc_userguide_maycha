const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PHASE1_SECTION_HASH = 'd30e26b8ac54999be7275293b46c0c1c1321168b9a544559593702d067f91eb9';
const PHASE1_ASSET_REFS_HASH = '2b428f03147e12ccb234a7f4ddcd5257bac1493d22abeb5922abef04c9ffee60';
const PHASE2_IDS = [
  'training-phase2-overview', 'training-department-switch', 'training-operating-scope',
  'training-scope-boundaries', 'training-role-dashboards', 'training-dashboard-tnd-manager',
  'training-dashboard-taskforce', 'training-dashboard-coo', 'training-dashboard-om',
  'training-dashboard-am', 'training-dashboard-sm', 'training-criteria-checklist',
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
const EXPECTED_LEDGER_COUNTS = {
  planned: 45,
  acceptedCore: 27,
  acceptedConditionalReadOnly: 18,
  acceptedTotal: 45,
  conditionalUnavailable: 0,
  includeInGuide: 45,
  uniqueAcceptedPaths: 45,
  uniqueAcceptedHashes: 43,
  fullViewport: 45,
};
const ALLOWED_STATUSES = new Set(['accepted', 'unavailable']);
const CREDENTIAL_PATTERNS = [  { label: 'known password', pattern: /123123123/ },
  { label: 'bearer token', pattern: /\bbearer\s+[A-Z0-9._~+/-]+=*/i },
  { label: 'access or refresh token field', pattern: /\b(?:access_token|refresh_token|id_token)\b/i },
  { label: 'JWT token', pattern: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/ },
];

const digest = (value) => crypto.createHash('sha256').update(value).digest('hex');
const sortedUnique = (values) => [...new Set(values)].sort();
const sameStringArray = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function validatePhase2GuideContract({ guide, projectRoot, fail }) {
  const ledgerPath = path.resolve(
    projectRoot, '..', '..', 'plans', '260721-1435-phase2-training-web-full-guide-v2',
    'reports', 'phase2-evidence-ledger.json',
  );
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
  const phase1ImageRefs = phase1.flatMap((section) => section.blocks
    .filter((block) => block.type === 'image').map((block) => block.src));
  if (phase1.length !== 50) fail(`Phase 1 must contain 50 sections, found ${phase1.length}.`);
  if (phase1ImageRefs.length !== 54) fail(`Phase 1 must contain 54 images, found ${phase1ImageRefs.length}.`);
  if (digest(JSON.stringify(phase1)) !== PHASE1_SECTION_HASH) fail('Phase 1 canonical section hash changed.');
  if (digest(JSON.stringify(phase1ImageRefs)) !== PHASE1_ASSET_REFS_HASH) fail('Phase 1 image reference hash changed.');

  if (!sameStringArray(phase2.map((section) => section.id), PHASE2_IDS)) {
    fail('Phase 2 section IDs/order differ from the feature-first 40-section contract.');
  }
  if (phase2.filter((section) => section.level === 1).length !== 9) fail('Phase 2 must contain 9 parent sections.');
  if (phase2.filter((section) => section.level === 2).length !== 31) fail('Phase 2 must contain 31 child sections.');
  phase2.filter((section) => section.level === 2).forEach((section) => {
    const labels = section.blocks.filter((block) => block.type === 'label').map((block) => block.text);
    ['Dành cho', 'Mục đích', 'Điều kiện thực hiện', 'Cách thao tác'].forEach((label) => {
      if (!labels.includes(label)) fail(`${section.id} is missing required label "${label}".`);
    });
    const steps = section.blocks.find((block) => block.type === 'steps');
    if (!steps || steps.items.length < 4 || steps.items.length > 7) fail(`${section.id} must contain 4-7 steps.`);
    const cautionIndex = section.blocks.findIndex((block) => block.type === 'label' && block.text.startsWith('Lưu ý'));
    const guardrails = section.blocks.slice(cautionIndex + 1).find((block) => block.type === 'bullets');
    if (!guardrails || guardrails.items.length < 2 || guardrails.items.length > 4) {
      fail(`${section.id} must contain 2-4 guardrails.`);
    }
  });

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
  if (ledger.rows.length !== 45) fail(`Evidence ledger must contain exactly 45 rows, found ${ledger.rows.length}.`);
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

  if (acceptedRows.length !== 45) fail(`Accepted/include evidence count must be exactly 45, found ${acceptedRows.length}.`);
  if (unavailableRows.length !== 0) fail(`Unavailable evidence count must be exactly 0, found ${unavailableRows.length}.`);
  const actualUnavailableIds = unavailableRows.map((row) => row.evidenceId).sort();
  if (!sameStringArray(actualUnavailableIds, [...UNAVAILABLE_IDS].sort())) {
    fail(`Unavailable evidence IDs must exactly match: ${UNAVAILABLE_IDS.join(', ')}.`);
  }
  const acceptedCore = acceptedRows.filter((row) => row.evidenceClass === 'core').length;
  const acceptedConditional = acceptedRows.filter((row) => row.evidenceClass === 'conditional').length;
  if (acceptedCore !== 27) fail(`Accepted core evidence must be exactly 27, found ${acceptedCore}.`);
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
  if (sortedUnique(acceptedPaths).length !== 45) fail('Accepted ledger paths must contain exactly 45 unique values.');
  if (sortedUnique(acceptedHashes).length !== 43) fail('Accepted ledger hashes must contain exactly 43 unique values.');

  const phase2ImageBindings = phase2.flatMap((section) => section.blocks
    .filter((block) => block.type === 'image')
    .map((block) => ({ sectionId: section.id, ...block })));
  if (phase2ImageBindings.length !== 45) {
    fail(`Phase 2 must contain exactly 45 full-screen image blocks, found ${phase2ImageBindings.length}.`);
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


  const credentialScanTarget = JSON.stringify({ guide, ledger });
  CREDENTIAL_PATTERNS.forEach(({ label, pattern }) => {
    if (pattern.test(credentialScanTarget)) fail(`Client guide/ledger contains forbidden credential material: ${label}.`);
  });
  return {
    phase1Hash: digest(JSON.stringify(phase1)),
    phase2Sections: phase2.length,
    phase2AcceptedImages: acceptedRows.length,
    phase2UnavailableEvidence: unavailableRows.length,
  };
}

module.exports = { validatePhase2GuideContract };






