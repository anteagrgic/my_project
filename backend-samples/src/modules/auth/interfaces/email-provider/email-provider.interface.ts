export interface ISendEmailParams {
  to: string;
  subject: string;
  bodyHtml?: string;
}

export interface EmailProviderContact {
  to: string;
  from: string;
}

export interface EmailProviderStaticContent extends EmailProviderContact {
  subject: string;
  text: string;
  html?: string;
}

export interface EmailProviderDynamicContent extends EmailProviderContact {
  templateId: string;
  dynamicTemplateData?: { [key: string]: any };
}

export type TEmailProviderContent =
  | EmailProviderDynamicContent
  | EmailProviderStaticContent;
