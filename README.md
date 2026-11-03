# Dr. Osmar Malta — prévia institucional

Landing page em português, com Next.js App Router, TypeScript, Tailwind CSS 4, GSAP/ScrollTrigger, Lenis e uma escultura Three.js carregada sob demanda. Fontes Cormorant Garamond e Manrope servidas localmente, com licenças em `public/fonts`.

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

O teste usa Chromium instalado no sistema (`/usr/bin/chromium`), o caminho em `CHROMIUM_PATH`, ou o navegador do Playwright (`npx playwright install chromium`). `TEST_URL` permite apontar para outra instância local. Exercita oito larguras de 320 a 1440px, overflow, navegação mobile, teclado, FAQ, privacidade, consentimento, carregamento das imagens, erros de execução, orientação horizontal, intro e escultura/fallback. Capturas de revisão são gravadas em `/tmp/osmar-*.png`. Não envia e-mails nem dados a terceiros.

## Conteúdo e contato

Dados, áreas e respostas em `lib/content.ts`. Tokens de cor, tipografia e breakpoints em `app/globals.css`. Não há backend de envio: o formulário valida os campos e o consentimento e prepara uma mensagem no aplicativo de e-mail do visitante. A pessoa deve revisar e enviar por lá. Nenhum envio é simulado. Sem analytics, persistência de mensagens, mapas ou cookies de marketing.

Contatos informados pelo usuário: WhatsApp **+55 21 98804-9390** e Instagram **@osmarmaltaadvogado**. Os links estão ativos em `lib/content.ts`. A variável opcional `NEXT_PUBLIC_WHATSAPP` permite substituir o número em dígitos, incluindo código do país e DDD; alterações nessa variável exigem reinício/rebuild. Um valor vazio desativa o CTA de WhatsApp.

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

As cinco imagens arquitetônicas originais em `public/images` são composições geradas por IA para esta demonstração e não representam instalações reais, clientes ou casos. Os três retratos enviados pelo usuário no ZIP foram incorporados sem alterações nos arquivos: `retrato-abertura.png` na Hero, `retrato-apresentacao.png` no escritório e `retrato-atendimento.png` no painel de atendimento. O envio autoriza seu uso nesta prévia; a procedência, a identidade retratada e os direitos para publicação devem ser validados com o responsável antes da divulgação. Não se presume que os ambientes dos retratos sejam instalações reais do escritório. A atribuição ilustrativa das imagens arquitetônicas aparece no rodapé. Os arquivos originais são otimizados pelo `next/image`, com dimensões responsivas e carregamento tardio abaixo da primeira dobra.

A abertura possui opção de pular e limite de duração; máscaras, revelações, diagonal, parallax, sobreposição, spotlight, imagem acompanhando o cursor e inclinação têm escopo localizado. A escultura responde lentamente ao tempo, scroll e ponteiro; usa fallback estático quando WebGL não está disponível, em dispositivos com poucos núcleos ou com movimento reduzido. Em telas pequenas, os cards mostram suas imagens sem depender de hover, a diagonal é reduzida e os painéis seguem um fluxo vertical. `prefers-reduced-motion` desativa movimento decorativo e smooth scroll.

Pontuação Lighthouse, FPS em aparelhos físicos e compatibilidade com aplicativos de e-mail externos dependem de validação no ambiente final; não são garantidos.

## Implantar na Vercel

O arquivo `vercel.json` declara Next.js, instalação com `npm ci`, build com `npm run build` e saída `.next`. O diretório raiz do projeto na Vercel deve ser a raiz deste repositório (vazio ou `.`), onde estão `package.json` e `app/`. Remover overrides antigos de diretório de saída estática, caso existam.

A implantação da captura enviada estava ligada ao commit inicial `e242665`, que contém apenas o README. É necessário enviar o código da landing page ao GitHub; reiniciar uma implantação desse commit inicial não inclui os arquivos criados neste ambiente. A branch de produção indicada na captura é `main`. Um push para essa branch pode iniciar automaticamente uma nova publicação na Vercel.
