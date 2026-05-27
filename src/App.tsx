import { FloatButton, Layout } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { guide } from "./content/guide-content";
import { GuideContentView } from "./components/guide-content-view";
import { GuideHeader } from "./components/guide-header";
import { GuideSidebar } from "./components/guide-sidebar";
import { MobileToc } from "./components/mobile-toc";

export default function App() {
  return (
    <Layout className="app-shell">
      <GuideHeader guide={guide} />
      <MobileToc sections={guide.sections} />
      <Layout className="guide-shell">
        <GuideSidebar sections={guide.sections} />
        <main className="guide-main" id="guide-content">
          <GuideContentView guide={guide} />
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
