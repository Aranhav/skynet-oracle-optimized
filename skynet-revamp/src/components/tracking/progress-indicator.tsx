"use client"

import { motion } from "framer-motion"
import { Package, Truck, MapPin, CheckCircle } from "lucide-react"

interface ProgressStep {
  icon: any
  label: string
  status: "completed" | "active" | "pending"
}

interface ProgressIndicatorProps {
  currentStatus: string
}

export default function ProgressIndicator({ currentStatus }: ProgressIndicatorProps) {
  const getSteps = (): ProgressStep[] => {
    const steps: ProgressStep[] = [
      { icon: Package, label: "Order Received", status: "pending" },
      { icon: Truck, label: "In Transit", status: "pending" },
      { icon: MapPin, label: "Out for Delivery", status: "pending" },
      { icon: CheckCircle, label: "Delivered", status: "pending" },
    ]

    // Set status based on current status
    switch (currentStatus.toLowerCase()) {
      case "delivered":
        steps.forEach((step) => (step.status = "completed"))
        break
      case "out for delivery":
        steps[0].status = "completed"
        steps[1].status = "completed"
        steps[2].status = "active"
        break
      case "in transit":
        steps[0].status = "completed"
        steps[1].status = "active"
        break
      case "order received":
      case "package received":
        steps[0].status = "active"
        break
    }

    return steps
  }

  const steps = getSteps()

  return (
    <div className="w-full max-w-4xl mx-auto mb-20">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-8 left-0 right-0 h-px bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary to-primary/50"
            initial={{ width: "0%" }}
            animate={{
              width: `${steps.filter((s) => s.status === "completed").length * 33.33}%`,
            }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Icon Circle */}
              <div
                className={`
                  relative z-10 w-16 h-16 rounded-full flex items-center justify-center
                  transition-all duration-500 group-hover:scale-110
                  ${
                    step.status === "completed"
                      ? "bg-gradient-to-b from-primary to-primary/90 text-white shadow-lg shadow-primary/20"
                      : step.status === "active"
                        ? "bg-gradient-to-b from-primary/20 to-primary/10 text-primary border border-primary/30"
                        : "bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-400 border border-gray-200 dark:border-gray-800"
                  }
                `}
              >
                <step.icon className="w-5 h-5" strokeWidth={1.5} />
              </div>

              {/* Label */}
              <span
                className={`
                mt-4 text-sm font-light text-center transition-colors
                ${step.status === "completed" || step.status === "active" ? "text-foreground" : "text-muted-foreground"}
              `}
              >
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
