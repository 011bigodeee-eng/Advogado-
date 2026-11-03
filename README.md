# Dr. Osmar Malta — prévia institucional

Landing page em português, com Next.js App Router, TypeScript, Tailwind CSS 4, GSAP/ScrollTrigger, Lenis e uma escultura Three.js carregada sob demanda. Fontes Cormorant Garamond e Manrope servidas localmente em WOFF2, com licenças em `public/fonts`. Os subconjuntos preservam acentos do português; os títulos Cormorant utilizam apenas o peso 400, e Manrope conserva a variação de pesos e reduziram os três arquivos de aproximadamente 2,08 MB para 122 KB (cerca de 94%). Os TTF originais foram preservados para manutenção.

## Executar

Requisito: Node.js 20.9 ou superior (validado com Node 24).

```sh
npm ci
npm run dev
```

Para produção: `npm run build` e `npm start`. O servidor utiliza a porta 3000. Esta é uma prévia com indexação desabilitada; revisar `robots` e os metadados em `app/layout.tsx` antes da publicação no domínio oficial.

## Verificações

```sh
npm run typecheck
npm run build
# Com o servidor já iniciado:
npm test
```

O teste usa Chromium instalado no sistema (`/usr/bin/chromium`), o caminho em `CHROMIUM_PATH`, ou o navegador do Playwright (`npx playwright install chromium`). `TEST_URL` permite apontar para outra instância local. Exercita nove larguras de 320 a 1920px, overflow, navegação mobile, teclado, FAQ, privacidade, consentimento, carregamento das imagens, erros de execução, orientação horizontal, intro e escultura/fallback. Capturas de revisão são gravadas em `/tmp/osmar-*.png`. Os links externos de WhatsApp são interceptados localmente nos testes, que não enviam dados a terceiros.

## Conteúdo e contato

Dados, áreas e respostas em `lib/content.ts`. Tokens de cor e tipografia em `app/globals.css` e composição atual em `app/redesign.css`. O número público, as quatro mensagens de atendimento e a construção dos links estão centralizados em `lib/contact.ts`. Não há backend de envio: o formulário valida nome, telefone/e-mail, área, mensagem e consentimento e abre o WhatsApp com a mensagem organizada. O visitante deve revisar e enviar manualmente. Se a nova aba não abrir, um link de revisão fica disponível na própria página; ele é invalidado quando o formulário muda. O e-mail permanece como alternativa. Sem analytics, armazenamento de mensagens, mapas ou cookies de marketing.

Contatos informados pelo usuário: WhatsApp **+55 21 98804-9390** e Instagram **@osmarmaltaadvogado**. O número está em `lib/contact.ts`; o Instagram, em `lib/content.ts`. A variável opcional `NEXT_PUBLIC_WHATSAPP` permite substituir o número em dígitos, incluindo código do país e DDD; alterações nessa variável exigem reinício/rebuild. Um valor vazio desativa o CTA de WhatsApp.

## Antes da publicação

Confirmar com o advogado:

- Inscrição OAB; não preenchida com dados fictícios.
- Endereço completo e pertinência das regiões Centro, Del Castilho e Santa Cruz.
- Horário de atendimento (09h–18h foi informado, mas não está anunciado como confirmado).
- Fotografia autorizada, identidade e informações profissionais adicionais.
- Textos institucionais, princípios propostos, fluxo de atendimento e aviso de privacidade.
- Domínio oficial (a referência fornecida não foi tratada como domínio de publicação), SEO/Open Graph e liberação de indexação.
- Revisão jurídica final conforme normas vigentes da OAB, incluindo o Provimento 205/2021, e práticas efetivas de tratamento de dados.

## Imagens e movimento

As imagens das áreas jurídicas foram substituídas por três novas cenas geradas para esta reformulação: `direito-familia.png` (consulta com clientes adultos), `inventarios.png` (documentos e orientação sucessória) e `execucao-penal.png` (análise processual em sala de audiência). Têm 1536 × 1024px, direção artística consistente e são servidas localmente com `next/image`. São ilustrações: não retratam clientes, processos ou instalações reais do escritório. Essa indicação aparece nos cards e no rodapé. As antigas imagens arquitetônicas não são utilizadas na página.

Os três retratos enviados pelo usuário permanecem sem alterações nos arquivos: `retrato-abertura.png` na Hero, `retrato-apresentacao.png` na apresentação e `retrato-atendimento.png` no painel de atendimento. A Hero utiliza moldura editorial e fundo grafite, sem recorte de pessoa, máscara radial ou cenário arquitetônico. A procedência dos retratos, sua condição de fotografias originais e a autorização de uso público devem ser confirmadas antes da divulgação; nenhuma identidade facial nova foi gerada. Para substituir um retrato, trocar o arquivo por uma fotografia original autorizada ou adotar um espaço reservado até recebê-la.

A identidade da reformulação está em `app/redesign.css`; `components/PracticeCard.tsx` concentra a composição e as interações dos cards. Os demais componentes e funcionalidades de contato foram preservados.

A abertura possui opção de pular e limite de duração. A seção “Além dos processos” usa duas colunas estáveis no desktop e sequência vertical no mobile: texto e fotografia não se sobrepõem. O deslocamento diagonal fica restrito ao interior da máscara fotográfica (±8px na horizontal e ±12px na vertical, sem rotação), substituído por deslocamento apenas vertical (±6px) no mobile. O efeito líquido usa uma camada luminosa com displacement SVG no desktop e máscara CSS leve no mobile, preservando rostos e conteúdo. A escultura responde lentamente ao tempo, scroll e ponteiro; usa fallback estático quando WebGL não está disponível, em dispositivos com poucos núcleos ou com movimento reduzido. Em telas pequenas, os cards mostram suas imagens sem depender de hover, o WebGL é substituído por profundidade CSS e os painéis seguem um fluxo vertical. `prefers-reduced-motion` desativa movimento decorativo e smooth scroll.

Pontuação Lighthouse, FPS em aparelhos físicos e compatibilidade com aplicativos de e-mail externos dependem de validação no ambiente final; não são garantidos.

## Implantar na Vercel

O arquivo `vercel.json` declara Next.js, instalação com `npm ci`, build com `npm run build` e saída `.next`. O diretório raiz do projeto na Vercel deve ser a raiz deste repositório (vazio ou `.`), onde estão `package.json` e `app/`. Remover overrides antigos de diretório de saída estática, caso existam.

A implantação da captura enviada estava ligada ao commit inicial `e242665`, que contém apenas o README. É necessário enviar o código da landing page ao GitHub; reiniciar uma implantação desse commit inicial não inclui os arquivos criados neste ambiente. A branch de produção indicada na captura é `main`. Um push para essa branch pode iniciar automaticamente uma nova publicação na Vercel.

## Movimento e privacidade de contato

`lib/motion.ts` centraliza os tokens de movimento (.25/.6/.9s, 28px, escala máxima 1.04 e stagger .1s). `components/useSiteMotion.ts` usa IntersectionObserver, Web Animations e um parallax em requestAnimationFrame no mobile. GSAP/ScrollTrigger e Lenis são importados sob demanda somente no desktop; nesse modo, o hook sincroniza os dois, recalcula ScrollTrigger após fontes/imagens e faz cleanup de ticker, instâncias e listeners. Mudanças de breakpoint e movimento reduzido também limpam o modo anterior. A inclinação dos cards fica abaixo de 3 graus. O botão flutuante usa safe-area e se oculta durante a intro, menu/privacidade, junto ao formulário e no rodapé.

O conteúdo do formulário só passa ao serviço WhatsApp quando o visitante escolhe continuar. O link inclui os campos informados; por isso, o aviso orienta a não incluir informações sensíveis. Não há envio automático de mensagens nem gravação dos campos em localStorage, sessionStorage ou servidor. A política de privacidade foi ajustada a esse fluxo.
