import { PaperSetInfo } from "@/components/PaperSetInfo";
import { getPaperSetSchema } from "@/schema-generators/paper.schema";
import { paperSetService } from "@/services/previouspaperset.service";
import { notFound } from "next/navigation";
import Script from "next/script";

export default async function PreviousPaperInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const paperSet = await paperSetService.getSetBySlug(slug);

  if (!paperSet) {
    notFound();
  }

  const paperSetSchema = getPaperSetSchema(paperSet);

  return (
    <>
      <Script
        id="exam-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(paperSetSchema),
        }}
      />

      <PaperSetInfo paperSet={paperSet} />
    </>
  );
}
