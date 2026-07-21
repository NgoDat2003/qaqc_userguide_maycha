const fs = require('fs');
const path = require('path');
const { validatePhase2GuideContract } = require('./validate-phase2-guide-contract.cjs');

const projectRoot = path.resolve(__dirname, '..');
const contentPath = path.join(projectRoot, 'src', 'content', 'guide-content.json');
const publicRoot = path.join(projectRoot, 'public');
const allowedBlockTypes = new Set(['paragraph', 'label', 'steps', 'bullets', 'table', 'image']);
const requiredMetadata = ['title', 'version', 'scope', 'audience', 'notice'];
const errors = [];

const fail = (message) => errors.push(message);
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const validateStringArray = (value, location) => {
  if (!Array.isArray(value) || value.length === 0) {
    fail(`${location} must be a non-empty array.`);
    return;
  }
  value.forEach((item, index) => {
    if (!isNonEmptyString(item)) fail(`${location}[${index}] must be a non-empty string.`);
  });
};

let guide;
try {
  guide = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
} catch (error) {
  console.error(`Cannot parse ${contentPath}: ${error.message}`);
  process.exit(1);
}

requiredMetadata.forEach((key) => {
  if (!isNonEmptyString(guide[key])) fail(`metadata.${key} must be a non-empty string.`);
});
if (!Number.isInteger(guide.imageCount) || guide.imageCount < 0) {
  fail('metadata.imageCount must be a non-negative integer.');
}
if (!Array.isArray(guide.sections) || guide.sections.length === 0) {
  fail('sections must be a non-empty array.');
}

const ids = new Set();
let currentChapter = 0;
let currentSubsection = 0;
let actualImageCount = 0;
const missingAssets = [];

(guide.sections || []).forEach((section, sectionIndex) => {
  const location = `sections[${sectionIndex}]`;
  if (!isNonEmptyString(section.id)) fail(`${location}.id must be a non-empty string.`);
  else if (ids.has(section.id)) fail(`${location}.id duplicates "${section.id}".`);
  else ids.add(section.id);

  if (!isNonEmptyString(section.title)) fail(`${location}.title must be a non-empty string.`);
  if (section.level !== 1 && section.level !== 2) fail(`${location}.level must be 1 or 2.`);
  if (!Array.isArray(section.blocks) || section.blocks.length === 0) {
    fail(`${location}.blocks must be a non-empty array.`);
  }

  const match = typeof section.title === 'string' ? section.title.match(/^(\d+)(?:\.(\d+))?\.\s/) : null;
  if (!match) {
    fail(`${location}.title must start with an ordered chapter number.`);
  } else {
    const chapter = Number(match[1]);
    const subsection = match[2] ? Number(match[2]) : null;
    if (section.level === 1) {
      if (subsection !== null) fail(`${location} level 1 title cannot contain a subsection number.`);
      if (chapter !== currentChapter + 1) fail(`${location} expected chapter ${currentChapter + 1}, found ${chapter}.`);
      currentChapter = chapter;
      currentSubsection = 0;
    } else {
      if (subsection === null) fail(`${location} level 2 title must contain a subsection number.`);
      if (chapter !== currentChapter) fail(`${location} subsection must belong to current chapter ${currentChapter}.`);
      if (subsection !== currentSubsection + 1) fail(`${location} expected subsection ${currentChapter}.${currentSubsection + 1}, found ${chapter}.${subsection}.`);
      currentSubsection = subsection;
    }
  }

  (section.blocks || []).forEach((block, blockIndex) => {
    const blockLocation = `${location}.blocks[${blockIndex}]`;
    if (!block || typeof block !== 'object' || Array.isArray(block)) {
      fail(`${blockLocation} must be an object.`);
      return;
    }
    if (!allowedBlockTypes.has(block.type)) {
      fail(`${blockLocation}.type "${block.type}" is not supported.`);
      return;
    }
    if (block.type === 'paragraph' || block.type === 'label') {
      if (!isNonEmptyString(block.text)) fail(`${blockLocation}.text must be a non-empty string.`);
    } else if (block.type === 'steps' || block.type === 'bullets') {
      validateStringArray(block.items, `${blockLocation}.items`);
    } else if (block.type === 'table') {
      validateStringArray(block.headers, `${blockLocation}.headers`);
      if (!Array.isArray(block.rows) || block.rows.length === 0) {
        fail(`${blockLocation}.rows must be a non-empty array.`);
      } else {
        block.rows.forEach((row, rowIndex) => {
          if (!Array.isArray(row) || row.length !== block.headers.length) {
            fail(`${blockLocation}.rows[${rowIndex}] must contain exactly ${block.headers.length} cells.`);
            return;
          }
          row.forEach((cell, cellIndex) => {
            if (!isNonEmptyString(cell)) fail(`${blockLocation}.rows[${rowIndex}][${cellIndex}] must be a non-empty string.`);
          });
        });
      }
    } else if (block.type === 'image') {
      actualImageCount += 1;
      if (!isNonEmptyString(block.src) || !block.src.startsWith('/assets/')) {
        fail(`${blockLocation}.src must be an absolute /assets/ path.`);
      } else {
        const assetPath = path.join(publicRoot, block.src.replace(/^\//, ''));
        if (!fs.existsSync(assetPath)) missingAssets.push(block.src);
      }
      if (!isNonEmptyString(block.alt)) fail(`${blockLocation}.alt must be a non-empty string.`);
      if (block.caption !== undefined && !isNonEmptyString(block.caption)) {
        fail(`${blockLocation}.caption must be a non-empty string when provided.`);
      }
    }
  });
});

if (guide.imageCount !== actualImageCount) {
  fail(`metadata.imageCount is ${guide.imageCount}, but content contains ${actualImageCount} image blocks.`);
}
[...new Set(missingAssets)].forEach((asset) => fail(`Missing image asset: ${asset}`));

const contractResult = validatePhase2GuideContract({ guide, projectRoot, fail });

if (errors.length > 0) {
  console.error('Guide validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(JSON.stringify({
  valid: true,
  canonicalSource: path.relative(projectRoot, contentPath).replace(/\\/g, '/'),
  sections: guide.sections.length,
  chapters: currentChapter,
  imageCount: actualImageCount,
  ...contractResult,
}, null, 2));