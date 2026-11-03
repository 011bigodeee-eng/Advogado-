# Validação da prévia

Executada em 03/11/2026, neste ambiente de nuvem, com Chromium headless e Node.js 24.

- Build de produção Next.js e verificação TypeScript: aprovados.
- Teste funcional `npm test` contra o servidor de produção: aprovado.
- Larguras: 320, 360, 375, 390, 430, 768, 1024 e 1440px, sem overflow horizontal nas seções verificadas.
- Menu mobile: abertura, fechamento por Escape, navegação por âncora e orientação horizontal aprovados.
- FAQ: abertura com ponteiro e fechamento por teclado aprovados.
- Privacidade: diálogo e fechamento por Escape aprovados.
- Formulário: campos obrigatórios e consentimento verificados. Contato por e-mail confirmado no link; nenhum envio real realizado.
- Imagens carregadas sem falhas; nenhum erro de JavaScript detectado no fluxo funcional.
- Intro com limite de duração, escultura/fallback e todas as revelações por scroll verificadas, incluindo rolagem rápida.
- Imagem decorativa seguindo o cursor: sem overflow na borda direita da coluna.
- Revisão visual: primeira dobra desktop/mobile e captura completa desktop.

Amostra Lighthouse mobile local em produção: desempenho **97**, acessibilidade **100**, boas práticas **100** e SEO **63**. A redução de SEO decorre da diretiva intencional `noindex, nofollow` da prévia. O relatório também encontrou um aviso adicional de correspondência entre rótulo e nome do logotipo; o `aria-label` redundante foi removido após a medição, para usar o texto visível como nome acessível. O favicon ausente da primeira medição foi corrigido e a ausência de erros de console foi confirmada na segunda medição.

São resultados de laboratório, não garantias para hospedagem ou dispositivos físicos. Não foram medidos FPS em aparelhos reais, entrega de e-mails por aplicativos externos ou comportamento em todos os navegadores. A validação jurídica e os dados pendentes estão documentados no README.

Relatórios locais: `/tmp/osmar-lighthouse-final.json` e capturas `/tmp/osmar-desktop.png`, `/tmp/osmar-mobile.png`, `/tmp/osmar-full.png`. Esses arquivos temporários podem não permanecer em uma nova tarefa; os testes são reproduzíveis com as instruções do README.

## Atualização dos retratos enviados

Três imagens PNG de 510 × 510px, extraídas do ZIP enviado pelo usuário, foram adicionadas à abertura, à apresentação profissional e ao painel de atendimento. Os originais foram preservados, com enquadramento realizado apenas no layout. A abertura em dispositivos móveis apresenta texto e retrato em sequência; nenhum texto é colocado sobre o rosto. O efeito líquido foi transferido para uma imagem arquitetônica, preservando os retratos sem distorção. Build e testes funcionais foram reexecutados para esta atualização; a pontuação Lighthouse acima pertence à versão anterior à inclusão dos retratos.
