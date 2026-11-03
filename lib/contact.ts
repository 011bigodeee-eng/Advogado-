/** Public business contact supplied by the client; override with digits only. */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP ?? "5521988049390";
export const WHATSAPP_DISPLAY = /^55\d{11}$/.test(WHATSAPP_NUMBER)
  ? `(${WHATSAPP_NUMBER.slice(2, 4)}) ${WHATSAPP_NUMBER.slice(4, 9)}-${WHATSAPP_NUMBER.slice(9)}`
  : /^\d{10,15}$/.test(WHATSAPP_NUMBER)
    ? `+${WHATSAPP_NUMBER}`
    : "";
export const WHATSAPP_MESSAGES = {
  general:
    "Olá, Dr. Osmar Malta! Acessei seu site e gostaria de saber como funciona o atendimento jurídico. Poderia me passar mais informações?",
  family:
    "Olá, Dr. Osmar Malta! Acessei seu site e gostaria de informações sobre atendimento na área de Direito de Família.",
  probate:
    "Olá, Dr. Osmar Malta! Gostaria de obter informações sobre orientação jurídica relacionada a inventários.",
  criminal:
    "Olá, Dr. Osmar Malta! Acessei seu site e gostaria de informações sobre atendimento na área de Execução Penal.",
} as const;
export function whatsappLink(message: string) {
  return /^\d{10,15}$/.test(WHATSAPP_NUMBER)
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    : "";
}
export type ContactFields = {
  name: string;
  contact: string;
  area: string;
  message: string;
};
export function contactMessage(fields: ContactFields) {
  return `Olá, Dr. Osmar Malta!\n\nMeu nome é ${fields.name}.\n\nGostaria de informações sobre ${fields.area}.\n\nMensagem: ${fields.message}\n\nMeu contato: ${fields.contact}.`;
}
