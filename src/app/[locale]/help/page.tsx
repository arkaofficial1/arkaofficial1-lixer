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

const faqs = [
  {
    question: "Is Linxer free to use?",
    answer: "Yes, Linxer is completely free for shortening links. We offer a dashboard for registered users to manage their links, also for free."
  },
  {
    question: "Do I need to create an account to shorten links?",
    answer: "No, you can shorten links anonymously without an account. However, creating a free account allows you to manage your links, view analytics, and use custom aliases in the future."
  },
  {
    question: "How long do the shortened links last?",
    answer: "Shortened links created with Linxer never expire. They will continue to work as long as the service is operational."
  },
  {
    question: "Can I see how many times my link has been clicked?",
    answer: "Yes, if you are a registered user, your dashboard will show you detailed click analytics for each of your links."
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto py-10 max-w-4xl w-full">
      <div className="space-y-16">
        <section>
          <h2 className="text-3xl font-bold text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-center text-muted-foreground mb-8">Find answers to common questions about Linxer.</p>
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
           <h2 className="text-3xl font-bold text-center mb-2">Contact Us</h2>
           <p className="text-center text-muted-foreground mb-8">Have a different question? Get in touch with our team.</p>
           <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>We'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Question about..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message here..." className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full md:w-auto">Send Message</Button>
              </form>
            </CardContent>
           </Card>
        </section>
      </div>
    </div>
  )
}
