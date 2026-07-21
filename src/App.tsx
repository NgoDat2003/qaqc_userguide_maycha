import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FloatButton, Layout } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { guide } from "./content/guide-content";
import {
  countSectionImages,
  getGuidePhase,
  getPhaseForSection,
  getSectionsForPhase,
  type GuidePhaseId,
} from "./content/guide-phases";
import { GuideContentView } from "./components/guide-content-view";
import { GuideHeader } from "./components/guide-header";
import { GuideSidebar } from "./components/guide-sidebar";
import { MobileToc } from "./components/mobile-toc";

function readHashId(hash = window.location.hash): string {
  const encodedId = hash.replace(/^#/, "");
  try {
    return decodeURIComponent(encodedId);
  } catch {
    return encodedId;
  }
}

function getPhaseForTargetId(targetId: string): GuidePhaseId {
  if (targetId === "phase-2") return "phase-2";
  if (targetId === "phase-1") return "phase-1";

  const targetSection = guide.sections.find((section) => section.id === targetId);
  return targetSection ? getPhaseForSection(targetSection) : "phase-1";
}

function getSectionIdForTarget(targetId: string): string {
  return guide.sections.some((section) => section.id === targetId) ? targetId : "";
}

function getExpandedPhaseForTarget(targetId: string): GuidePhaseId | null {
  const targetSection = guide.sections.find((section) => section.id === targetId);
  return targetSection ? getPhaseForSection(targetSection) : null;
}

export default function App() {
  const initialTargetId = readHashId();
  const initialPhaseId = getPhaseForTargetId(initialTargetId);
  const observerSuppressedUntil = useRef(0);
  const [activePhaseId, setActivePhaseId] = useState<GuidePhaseId>(initialPhaseId);
  const [expandedPhaseId, setExpandedPhaseId] = useState<GuidePhaseId | null>(() =>
    getExpandedPhaseForTarget(initialTargetId),
  );
  const [activeSectionId, setActiveSectionId] = useState(() =>
    getSectionIdForTarget(initialTargetId),
  );
  const activePhase = getGuidePhase(activePhaseId);
  const activeSections = useMemo(
    () => getSectionsForPhase(guide.sections, activePhaseId),
    [activePhaseId],
  );
  const activeImageCount = useMemo(() => countSectionImages(activeSections), [activeSections]);

  const suppressObserver = useCallback((durationMs = 450) => {
    observerSuppressedUntil.current = performance.now() + durationMs;
  }, []);

  const scrollToTarget = useCallback((targetId: string) => {
    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }, []);

  const selectPhase = useCallback(
    (phaseId: GuidePhaseId) => {
      suppressObserver();
      setActivePhaseId(phaseId);
      setExpandedPhaseId(phaseId);
      setActiveSectionId("");
      if (window.location.hash !== `#${phaseId}`) {
        window.history.pushState(null, "", `#${phaseId}`);
      }
      scrollToTarget(phaseId);
    },
    [scrollToTarget, suppressObserver],
  );

  const togglePhase = useCallback((phaseId: GuidePhaseId) => {
    setExpandedPhaseId((current) => (current === phaseId ? null : phaseId));
  }, []);

  const selectSection = useCallback(
    (sectionId: string) => {
      const section = guide.sections.find((candidate) => candidate.id === sectionId);
      if (!section) return;

      const sectionPhaseId = getPhaseForSection(section);
      suppressObserver();
      setActivePhaseId(sectionPhaseId);
      setExpandedPhaseId(sectionPhaseId);
      setActiveSectionId(sectionId);
      if (window.location.hash !== `#${sectionId}`) {
        window.history.pushState(null, "", `#${sectionId}`);
      }
      scrollToTarget(sectionId);
    },
    [scrollToTarget, suppressObserver],
  );

  useEffect(() => {
    const syncNavigationWithLocation = () => {
      const targetId = readHashId();
      const targetPhaseId = getPhaseForTargetId(targetId);
      suppressObserver();
      setActivePhaseId(targetPhaseId);
      setExpandedPhaseId(getExpandedPhaseForTarget(targetId));
      setActiveSectionId(getSectionIdForTarget(targetId));
      if (targetId) scrollToTarget(targetId);
    };

    window.addEventListener("hashchange", syncNavigationWithLocation);
    window.addEventListener("popstate", syncNavigationWithLocation);
    return () => {
      window.removeEventListener("hashchange", syncNavigationWithLocation);
      window.removeEventListener("popstate", syncNavigationWithLocation);
    };
  }, [scrollToTarget, suppressObserver]);

  useEffect(() => {
    const preserveHashSelectionOnResize = () => {
      suppressObserver();
      setActiveSectionId(getSectionIdForTarget(readHashId()));
    };

    window.addEventListener("resize", preserveHashSelectionOnResize);
    return () => window.removeEventListener("resize", preserveHashSelectionOnResize);
  }, [suppressObserver]);

  useEffect(() => {
    const targetId = readHashId();
    if (targetId) {
      suppressObserver();
      scrollToTarget(targetId);
    }
  }, [activePhaseId, scrollToTarget, suppressObserver]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (performance.now() < observerSuppressedUntil.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible?.target.id) setActiveSectionId(visible.target.id);
      },
      { rootMargin: "-12% 0px -72% 0px", threshold: 0.01 },
    );

    activeSections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [activeSections]);

  return (
    <Layout className="app-shell">
      <GuideHeader
        guide={guide}
        activePhase={activePhase}
        sectionCount={activeSections.length}
        imageCount={activeImageCount}
      />
      <MobileToc
        sections={guide.sections}
        activePhaseId={activePhaseId}
        expandedPhaseId={expandedPhaseId}
        activeSectionId={activeSectionId}
        onPhaseSelect={selectPhase}
        onPhaseToggle={togglePhase}
        onSectionSelect={selectSection}
      />
      <Layout className="guide-shell">
        <GuideSidebar
          sections={guide.sections}
          activePhaseId={activePhaseId}
          expandedPhaseId={expandedPhaseId}
          activeSectionId={activeSectionId}
          onPhaseSelect={selectPhase}
          onPhaseToggle={togglePhase}
          onSectionSelect={selectSection}
        />
        <main className="guide-main" id="guide-content">
          <GuideContentView guide={guide} sections={activeSections} phase={activePhase} />
        </main>
      </Layout>
      <FloatButton.BackTop
        visibilityHeight={500}
        icon={<ArrowUpOutlined />}
        tooltip="Lên đầu trang"
      />
    </Layout>
  );
}