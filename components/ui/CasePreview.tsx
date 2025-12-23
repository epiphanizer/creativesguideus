import { cx } from "@/lib/cx";

export type CasePreviewProps = {
  title: string;
  summary: string;
  href?: string;
  meta?: string;
  className?: string;
};

export function CasePreview({ title, summary, href, meta, className }: CasePreviewProps) {
  const Wrapper = href ? "a" : "article";

  return (
    <Wrapper className={cx("cg-case-preview", href && "cg-case-preview--link", className)} href={href}>
      <div className="cg-case-preview__frame" aria-hidden>
        <div className="cg-case-preview__placeholder" />
      </div>
      <div className="cg-case-preview__body">
        <p className="cg-case-preview__meta">{meta ?? "Launch prep"}</p>
        <h3 className="cg-case-preview__title">{title}</h3>
        <p className="cg-case-preview__summary">{summary}</p>
      </div>
    </Wrapper>
  );
}

export default CasePreview;
