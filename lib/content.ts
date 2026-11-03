import {
  WHATSAPP_NUMBER,
  WHATSAPP_MESSAGES,
  WHATSAPP_DISPLAY,
} from "./contact";
export const office = {
  name: "Dr. Osmar Malta",
  email: "maltaemachadoadv@gmail.com",
  whatsapp: WHATSAPP_NUMBER,
  instagram: "https://www.instagram.com/osmarmaltaadvogado/",
  instagramHandle: "@osmarmaltaadvogado",
  regions: ["Centro", "Del Castilho", "Santa Cruz"],
};
export const areas = [
  {
    number: "01",
    whatsappMessage: WHATSAPP_MESSAGES.family,
    title: "Direito de Família",
    text: "Orientação em questões familiares, com atenção às pessoas e às particularidades de cada história.",
    image: "/images/direito-familia.png",
    alt: "Cena ilustrativa de orientação jurídica com clientes adultos em um escritório reservado",
    detail: "Família, cuidado e novos caminhos.",
  },
  {
    number: "02",
    whatsappMessage: WHATSAPP_MESSAGES.probate,
    title: "Inventários",
    text: "Acompanhamento de procedimentos sucessórios e orientação sobre as etapas da transmissão patrimonial.",
    image: "/images/inventarios.png",
    alt: "Cena ilustrativa de análise conjunta de documentos e pastas em uma consulta sucessória",
    detail: "O cuidado com o que permanece.",
  },
  {
    number: "03",
    whatsappMessage: WHATSAPP_MESSAGES.criminal,
    title: "Execução Penal",
    text: "Atuação em questões relacionadas ao cumprimento de penas, com análise individual da situação jurídica.",
    image: "/images/execucao-penal.png",
    alt: "Cena ilustrativa de advogado analisando documentos processuais em uma sala de audiência brasileira",
    detail: "Atenção aos direitos em cada etapa.",
  },
];
export const faqs = [
  [
    "Como iniciar um atendimento?",
    `${WHATSAPP_DISPLAY ? `Entre em contato pelo WhatsApp ${WHATSAPP_DISPLAY} ou envie` : "Envie"} um e-mail com seu nome, uma forma de contato e o assunto geral da sua demanda. Evite incluir documentos ou informações sensíveis nesse primeiro contato.`,
  ],
  [
    "Quais áreas jurídicas são atendidas?",
    "As áreas informadas são Direito de Família, Inventários e Execução Penal. A possibilidade de atuação em uma situação específica será avaliada pelo advogado.",
  ],
  [
    "Como funciona a primeira conversa?",
    "O primeiro contato permite compreender o assunto e combinar os próximos passos. Modalidade, disponibilidade e condições do atendimento devem ser confirmadas diretamente com o advogado.",
  ],
  [
    "É possível solicitar orientação sobre inventários?",
    "Sim. É possível entrar em contato para apresentar a situação e solicitar orientação sobre procedimentos sucessórios. Documentos e etapas necessários dependem da análise do caso.",
  ],
  [
    "Como entrar em contato com o escritório?",
    `Utilize ${WHATSAPP_DISPLAY ? `o WhatsApp ${WHATSAPP_DISPLAY}, ` : ""}o e-mail maltaemachadoadv@gmail.com ou o formulário desta página, que prepara uma mensagem para você revisar e enviar pelo WhatsApp. O perfil do Instagram informado é @osmarmaltaadvogado.`,
  ],
];
