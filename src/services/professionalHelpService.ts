import helpData from "../data/fake/professionalHelpFaq.json";

export interface HelpFaqItem {
  id: string;
  title: string;
  content: string;
}

export interface HelpSupport {
  email: string;
  description: string;
}

const delay = (ms = 150) => new Promise<void>((r) => setTimeout(r, ms));

class ProfessionalHelpService {
  async getFaq(): Promise<HelpFaqItem[]> {
    await delay();
    return helpData.faq;
  }

  async getSupport(): Promise<HelpSupport> {
    await delay();
    return helpData.support;
  }
}

export const professionalHelpService = new ProfessionalHelpService();
