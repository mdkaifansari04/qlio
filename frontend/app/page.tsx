"use client";

import { FeatureCard } from "@/components/card/feature-card";
import CallToAction from "@/components/container/call-to-action";
import { HelpCircle, Package, Sparkles } from "lucide-react";

import BlurFade from "@/components/ui/blur-fade";
import { Separator } from "@/components/ui/separator";
import TextRotate from "@/components/ui/text-rotate";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/faqs";
import { withAuth } from "@/provider/auth-provider";

const Home = () => {
  return (
    <main className="flex text-primary flex-col h-full w-full container mx-auto">
      <section className="md:min-h-screen sm:h-[calc(100vh-65px)] bg-background text-foreground flex items-center">
        <main className="px-4 w-full py-8 sm:py-0">
          <div className="flex justify-center items-center gap-4 md:gap-8 sm:mb-16">
            <BlurFade delay={0.2} offset={15} inView={true} inViewMargin="0px">
              <div className="text-center space-y-6 mt-16">
                <h1 className="font-normal font-eb-garamond text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-neutral-900 dark:text-white">
                  Run{" "}
                  <TextRotate
                    texts={["Scripts", "Jobs", "Commands", "Processes", "Workflows"]}
                    mainClassName="inline-block bg-[#1570EF] px-4 py-1 rounded-md text-white"
                    staggerFrom="first"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 500 }}
                    rotationInterval={2800}
                  />{" "}
                  <br />
                  Asynchronously Easily.
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground dark:text-neutral-400 max-w-2xl mx-auto">
                  Qlio lets you execute scripts remotely, manage jobs in real-time, and stream
                  output with zero hassle.
                  {/* <br className="hidden sm:block" /> */}
                  Built for developers. Powered by queues. Designed to scale.
                </p>
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.4} offset={25} inView={true} inViewMargin="0px">
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 max-w-5xl mx-auto">
              <FeatureCard
                icon={<Package className="w-5 h-5 sm:w-6 sm:h-6" />}
                text="Professional templates for showcasing your work"
              />
              <FeatureCard
                icon={<Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />}
                text="Easy customization with live preview"
              />
              <FeatureCard
                icon={<HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />}
                text="Intuitive interface for effortless portfolio creation"
              />
            </div>
          </BlurFade>
        </main>
      </section>

      <Separator className="mb-12 sm:mb-20" />

      {/* <BlurFade delay={0.5} offset={30} inView={true} inViewMargin="0px">
        <section className="px-4 sm:px-0">
          <h1 className="font-medium font-eb-garamond text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-neutral-900 dark:text-white text-center mb-8">
            Create a Portfolio in{" "}
            <span className="underline underline-offset-8 decoration-blue-500">Minutes</span>{" "}
            <MoveDown className="inline-block w-10 h-10 ml-2 -mt-3" />
          </h1>
          <FeatureSteps features={features} autoPlayInterval={3000} />
        </section>
      </BlurFade> */}

      <Separator className="my-12 sm:my-20" />

      <BlurFade delay={0.6} offset={35} inView={true} inViewMargin="0px">
        <section>
          <div className="px-8 py-16">
            <div className="mx-auto max-w-3xl space-y-12">
              <h1 className="font-medium font-eb-garamond text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-neutral-900 dark:text-white text-center mb-8">
                <span className="underline underline-offset-8 decoration-blue-500">Frequently</span>{" "}
                Asked Questions{" "}
              </h1>

              <Accordion type="single" collapsible className="mt-16 space-y-4">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="dark:text-white">{faq.question}</AccordionTrigger>
                    <AccordionContent className="dark:text-neutral-400">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </BlurFade>

      <Separator className="my-12 sm:my-20" />

      <BlurFade delay={0.7} offset={40} inView={true} inViewMargin="0px">
        <section>
          <CallToAction />
        </section>
      </BlurFade>
    </main>
  );
};

export default Home;
