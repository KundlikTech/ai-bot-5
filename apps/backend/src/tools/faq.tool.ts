import { prisma } from "../db/client";

export const searchFAQ = async (question: string) => {
  const terms = question.toLowerCase().trim();
  if (!terms) return "Please provide a question to search FAQs.";

  const faqs = await prisma.faq.findMany();
  if (!faqs.length) return "Sorry, I could not find an FAQ for that.";

  const hit =
    faqs.find((f) =>
      f.question.toLowerCase().includes(terms)
    ) ||
    faqs.find((f) =>
      terms.split(/\s+/).some((t) =>
        f.question.toLowerCase().includes(t)
      )
    );

  return hit ? hit.answer : "Sorry, I could not find an FAQ for that.";
};
