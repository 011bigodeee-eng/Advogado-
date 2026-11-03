# Auditoria editorial e integração de WhatsApp

Validação local em produção (`npm run build`, `npm start` e `npm test`), com Chromium headless. Data: 03/11/2026.

## Alterações verificadas

- A seção “Além dos processos, existem pessoas” utiliza grid estável de duas colunas no desktop e sequência vertical no mobile. Texto, fotografia e legenda ficam separados, sem rotação, colisões ou imagens invadindo outras seções.
- O movimento diagonal se restringe à fotografia dentro da máscara: ±8px na horizontal e ±12px na vertical no desktop. No mobile, o deslocamento é somente vertical, limitado a ±6px.
- O efeito líquido fica em uma camada luminosa editorial: displacement SVG no desktop e máscara CSS leve no mobile. Nenhum retrato, texto ou botão é distorcido.
- Os painéis de atendimento deixam de usar sticky e sobreposição. Espaçamentos e proporções foram ajustados.
- Número, exibição formatada, mensagens gerais e mensagens por área centralizados em `lib/contact.ts`. Cards, botão de contato, agendamento e botão flutuante usam mensagens codificadas para WhatsApp.
- Formulário valida nome, telefone/e-mail, área, mensagem e consentimento. Abre mensagem organizada para revisão manual no WhatsApp e oferece link alternativo caso a aba não abra. O e-mail permanece disponível.
- O flutuante se oculta durante intro, menu, privacidade, contato e rodapé. Possui ícone acessível, alvo maior que 44px e margem de safe-area.
- Movimento centralizado em `lib/motion.ts`: .25/.6/.9s, deslocamento 28px, stagger .1s e escala máxima 1.04. GSAP/Lenis são carregados somente no desktop; o mobile usa IntersectionObserver, Web Animations e parallax nativo leve. Há cleanup e atualização de ScrollTrigger após imagens/fontes.
- WebGL não é carregado no mobile; a profundidade CSS permanece. Movimento reduzido mantém conteúdo estático e visível.
- Fontes locais WOFF2: 121.820 bytes no total, contra 2.075.904 bytes dos TTF originais (redução de aproximadamente 94%). Português e desenho dos caracteres preservados; títulos usam o peso 400 efetivamente necessário.
- Miniaturas que acompanham o cursor utilizam `next/image`, evitando PNGs grandes para uma imagem de 110px. Inclinação removida dessas miniaturas.
- Open Graph utiliza o domínio informado e imagem local. A prévia continua com `noindex, nofollow` até a revisão de publicação.

## Testes executados e aprovados

Larguras **320, 360, 375, 390, 430, 768, 1024, 1440 e 1920px**:

- Ausência de overflow horizontal nas seções verificadas.
- Nome do advogado sem cortes e texto da Hero separado do retrato.
- Texto e imagem editoriais separados, figura contida na seção e ausência de rotação.
- Altura consistente dos cards no grid desktop.
- Flutuante oculto na região do formulário e do rodapé.

Também aprovados:

- Menu mobile, Escape, âncoras e orientação horizontal.
- Três mensagens específicas por área e mensagem geral, com conferência do número e decodificação dos textos.
- Validação de campos vazios/contato inválido, consentimento obrigatório, codificação de acentos, quebras de linha e `&`, abertura por ação do visitante e link de revisão.
- Links de e-mail e Instagram; FAQ e privacidade com teclado.
- Ausência de dados em localStorage/sessionStorage; nenhum envio automático ou envio real de mensagem durante os testes.
- Movimento diagonal limitado, camada líquida desktop, equivalente mobile, tilt/escala dos cards, escultura/fallback, miniatura do cursor e revelações após scroll rápido.
- Imagens visíveis carregadas; nenhum erro de JavaScript ou HTTP no fluxo auditado.

Nos testes, as navegações para `wa.me` foram interceptadas e respondidas localmente. Não houve transmissão dos dados fictícios para WhatsApp nem envio ao advogado. A entrega manual em aplicativos externos e a situação da conta WhatsApp não foram verificadas.

## Desempenho medido

Última amostra Lighthouse mobile de laboratório nesta rodada, com fontes otimizadas e movimento mobile nativo:

| Métrica        | Resultado                                                           |
| -------------- | ------------------------------------------------------------------- |
| Desempenho     | 93                                                                  |
| Acessibilidade | 100                                                                 |
| Boas práticas  | 100                                                                 |
| SEO            | 63 — bloqueio intencional de indexação                              |
| LCP            | 3,1s — a meta de menos de 2,5s ainda não foi atingida nesta amostra |
| CLS            | 0                                                                   |
| TBT            | aproximadamente 70ms; não equivale a INP                            |
| INP            | não medido com dados de uso real                                    |

São resultados locais, não garantia para a hospedagem ou dispositivos físicos. O LCP e o INP devem ser avaliados também no domínio de produção. Nenhum aviso relevante de console foi registrado pelo Lighthouse.

## Capturas e imagens

Capturas revisadas em 390, 768 e 1440px: `/tmp/osmar-audit-390.png`, `/tmp/osmar-audit-768.png`, `/tmp/osmar-audit-1440.png` e `/tmp/osmar-editorial-{largura}.png`. Captura completa: `/tmp/osmar-full.png`. Relatório: `/tmp/osmar-audit-complete.json`. Arquivos temporários podem não sobreviver a uma nova tarefa.

As três ilustrações jurídicas foram geradas na etapa anterior e mantidas nesta auditoria por corresponderem às áreas informadas. Não foram geradas novas imagens nesta rodada. Avisos de cena ilustrativa permanecem; as imagens não são apresentadas como clientes, casos ou instalações reais. Os retratos fornecidos não foram alterados.

## Pendências de publicação definitiva

Confirmar OAB, endereço, horário, procedência/qualidade e autorização das fotografias originais, práticas efetivas de privacidade e revisão jurídica dos textos. Os contatos foram fornecidos pelo usuário e devem ser reconfirmados com o responsável antes da divulgação definitiva. Disponibilidade pública e resultado da implantação Vercel não foram confirmados por esta auditoria local.
