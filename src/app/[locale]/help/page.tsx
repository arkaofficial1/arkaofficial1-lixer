import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"

export default async function HelpPage() {
  const t = await getTranslations('HelpPage');

  const faqs = [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer')
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer')
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer')
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer')
    },
  ];

  return (
    <div className="container mx-auto py-10 max-w-4xl w-full">
      <div className="space-y-16">
        <section>
          <h2 className="text-3xl font-bold text-center mb-2">{t('faq.title')}</h2>
          <p className="text-center text-muted-foreground mb-8">{t('faq.description')}</p>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section id="contact">
           <h2 className="text-3xl font-bold text-center mb-2">{t('contact.title')}</h2>
           <p className="text-center text-muted-foreground mb-8">{t('contact.description')}</p>
           <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>{t('contact.form.title')}</CardTitle>
              <CardDescription>{t('contact.form.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.form.nameLabel')}</Label>
                    <Input id="name" placeholder={t('contact.form.namePlaceholder')} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.form.emailLabel')}</Label>
                    <Input id="email" type="email" placeholder={t('contact.form.emailPlaceholder')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('contact.form.subjectLabel')}</Label>
                  <Input id="subject" placeholder={t('contact.form.subjectPlaceholder')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.form.messageLabel')}</Label>
                  <Textarea id="message" placeholder={t('contact.form.messagePlaceholder')} className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full md:w-auto">{t('contact.form.submitButton')}</Button>
              </form>
            </CardContent>
           </Card>
        </section>
      </div>
    </div>
  )
}
