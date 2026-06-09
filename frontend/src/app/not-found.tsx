import Link from "next/link";

import { PageContainer } from "@/components/layout/PageContainer";
import { Typography } from "@/components/ui/Typography";

export default function NotFound() {
  return (
    <PageContainer className="py-16 text-center">
      <Typography variant="heading">Pagina nao encontrada</Typography>
      <Typography variant="body-muted" className="mt-2">
        O conteudo que voce procura nao existe ou foi removido.
      </Typography>
      <Link href="/events" className="mt-6 inline-block text-sm font-medium hover:underline">
        Voltar para eventos
      </Link>
    </PageContainer>
  );
}
