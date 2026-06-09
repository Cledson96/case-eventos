"use client";

import { PageContainer } from "@/components/layout/PageContainer";
import { buttonPrimary } from "@/components/ui/styles";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <PageContainer className="py-16 text-center">
      <h1 className="text-xl font-semibold">Nao foi possivel carregar os dados</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Verifique se a API esta disponivel e tente novamente.
      </p>
      <button type="button" onClick={reset} className={`mt-6 ${buttonPrimary}`}>
        Tentar novamente
      </button>
    </PageContainer>
  );
}
