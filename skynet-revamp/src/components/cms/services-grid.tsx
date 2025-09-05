"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Service } from "@/types/strapi"
import { getStrapiMedia } from "@/lib/strapi"
import * as Icons from "lucide-react"

interface ServicesGridProps {
  services: Service[]
}

export default function ServicesGrid({ services }: ServicesGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  }

  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as any
    return Icon ? <Icon className="w-full h-full text-primary" strokeWidth={1.5} /> : null
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {services.map((service) => (
        <motion.div key={service.slug} variants={itemVariants}>
          <Card className="h-full p-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border border-gray-200 dark:border-gray-800 hover:shadow-xl transition-all duration-500 group">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 p-3 mb-6 group-hover:scale-110 transition-transform duration-300">
              {getIcon(service.icon)}
            </div>

            <h3 className="text-2xl font-light mb-4">
              {service.title.split(" ").map((word, i) =>
                i === 0 ? (
                  <span key={i} className="text-primary">
                    {word}{" "}
                  </span>
                ) : (
                  word + " "
                ),
              )}
            </h3>

            <p className="text-muted-foreground font-light mb-6">{service.shortDescription}</p>

            {service.features && service.features.length > 0 && (
              <ul className="space-y-2 mb-6">
                {service.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground font-light">
                    <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                    {feature.title}
                  </li>
                ))}
              </ul>
            )}

            <Button className="mt-auto bg-primary hover:bg-primary/90 font-light" asChild>
              <Link href={service.ctaLink || `/services/${service.slug}`}>{service.ctaText || "Learn More"}</Link>
            </Button>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
