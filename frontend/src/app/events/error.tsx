"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { Typography } from "@/components/ui/Typography";
import { buttonPrimary } from "@/components/ui/styles";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <PageContainer className="py-16 text-center">
      <Typography variant="heading">Nao foi possivel carregar os dados</Typography>
      <Typography variant="body-muted" className="mt-2">
        Verifique se a API esta disponivel e tente novamente.
      </Typography>
      <button type="button" onClick={reset} className={`mt-6 ${buttonPrimary}`}>
        Tentar novamente
      </button>
    </PageContainer>
  );
}
