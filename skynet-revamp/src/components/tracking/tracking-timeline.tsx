"use client"

import { motion } from "framer-motion"
import {
  Calendar,
  Clock,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Circle,
  FileText,
  RotateCw,
  Upload,
  XCircle,
} from "lucide-react"
import { ShipmentHistory, getStatusConfig } from "@/types/tracking"
import { formatTrackingDate } from "@/lib/tracking-api"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TrackingTimelineProps {
  history: ShipmentHistory[]
}

export default function TrackingTimeline({ history }: TrackingTimelineProps) {
  // Determine if an event is completed (has actually occurred)
  const isEventCompleted = (status: string, index: number) => {
    const normalizedStatus = status.toUpperCase()
    // Events that indicate completion/action taken
    const completedStatuses = ["DELIVERED", "PROCESSED", "INSCANNED", "BOOKED", "REWEIGHT", "HANDOVER", "INFO RECEIVED"]

    // Check if this status indicates a completed action
    const isStatusCompleted = completedStatuses.some((completedStatus) => normalizedStatus.includes(completedStatus))

    // For "IN TRANSIT" - it's partially completed (ongoing)
    const isInTransit = normalizedStatus.includes("TRANSIT")

    return isStatusCompleted || (isInTransit && index === 0)
  }

  const getStatusIcon = (status: string, isCompleted: boolean, isActive: boolean) => {
    const normalizedStatus = status.toUpperCase()
    const strokeWidth = isCompleted ? 1.5 : 1
    const className = `w-5 h-5`

    if (normalizedStatus.includes("DELIVERED")) {
      return <CheckCircle className={className} strokeWidth={strokeWidth} />
    } else if (normalizedStatus.includes("TRANSIT")) {
      return <Truck className={className} strokeWidth={strokeWidth} />
    } else if (normalizedStatus.includes("PROCESSED") || normalizedStatus.includes("INSCANNED")) {
      return <Package className={className} strokeWidth={strokeWidth} />
    } else if (normalizedStatus.includes("BOOKED") || normalizedStatus.includes("INFO RECEIVED")) {
      return <FileText className={className} strokeWidth={strokeWidth} />
    } else if (normalizedStatus.includes("REWEIGHT")) {
      return <RotateCw className={className} strokeWidth={strokeWidth} />
    } else if (normalizedStatus.includes("HANDOVER")) {
      return <Upload className={className} strokeWidth={strokeWidth} />
    } else if (normalizedStatus.includes("CANCEL")) {
      return <XCircle className={className} strokeWidth={strokeWidth} />
    } else {
      return <Circle className={className} strokeWidth={strokeWidth} />
    }
  }

  const getEventBadge = (status: string, isCompleted: boolean) => {
    const normalizedStatus = status.toUpperCase()
    const baseClass = "border-0 text-xs font-light px-3 py-1.5 rounded-full"

    if (normalizedStatus.includes("DELIVERED")) {
      return <Badge className={`${baseClass} bg-green-50 text-green-700 shadow-sm`}>Delivered</Badge>
    } else if (normalizedStatus.includes("TRANSIT")) {
      return <Badge className={`${baseClass} bg-primary/10 text-primary shadow-sm`}>In Transit</Badge>
    } else if (normalizedStatus.includes("PROCESSED")) {
      return (
        <Badge
          className={`${baseClass} ${isCompleted ? "bg-purple-50 text-purple-700 shadow-sm" : "bg-gray-50 text-gray-500"}`}
        >
          Processed
        </Badge>
      )
    } else if (normalizedStatus.includes("INSCANNED")) {
      return (
        <Badge
          className={`${baseClass} ${isCompleted ? "bg-blue-50 text-blue-700 shadow-sm" : "bg-gray-50 text-gray-500"}`}
        >
          Inscanned
        </Badge>
      )
    } else if (normalizedStatus.includes("BOOKED")) {
      return (
        <Badge
          className={`${baseClass} ${isCompleted ? "bg-indigo-50 text-indigo-700 shadow-sm" : "bg-gray-50 text-gray-500"}`}
        >
          Booked
        </Badge>
      )
    } else if (normalizedStatus.includes("REWEIGHT")) {
      return (
        <Badge
          className={`${baseClass} ${isCompleted ? "bg-orange-50 text-orange-700 shadow-sm" : "bg-gray-50 text-gray-500"}`}
        >
          Reweight
        </Badge>
      )
    } else if (normalizedStatus.includes("HANDOVER")) {
      return (
        <Badge
          className={`${baseClass} ${isCompleted ? "bg-emerald-50 text-emerald-700 shadow-sm" : "bg-gray-50 text-gray-500"}`}
        >
          Handover
        </Badge>
      )
    } else if (normalizedStatus.includes("CANCEL")) {
      return <Badge className={`${baseClass} bg-red-50 text-red-700 shadow-sm`}>Cancelled</Badge>
    } else {
      return (
        <Badge
          className={`${baseClass} ${isCompleted ? "bg-gray-100 text-gray-700 shadow-sm" : "bg-gray-50 text-gray-500"}`}
        >
          {status}
        </Badge>
      )
    }
  }

  return (
    <Card className="p-0 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-800/30 shadow-sm hover:shadow-md transition-all duration-500 rounded-3xl overflow-hidden">
      <div className="p-8 md:p-12">
        <div className="relative">
          {/* Timeline line - dynamic based on completed events */}
          <div className="absolute left-7 top-8 w-px hidden sm:block">
            <div
              className="h-full bg-gradient-to-b from-primary/30 via-primary/20 to-gray-200/50 dark:to-gray-800/50"
              style={{ height: `${(history.length - 1) * 120 + 60}px` }}
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-8">
            {history.map((item, index) => {
              const isCompleted = isEventCompleted(item.shipmentStatus, index)
              const isActive = index === 0

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="relative flex items-start gap-6"
                >
                  {/* Timeline dot - Apple-inspired design */}
                  <motion.div
                    className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${
                      isCompleted
                        ? isActive
                          ? "bg-gradient-to-br from-primary/20 to-primary/30 shadow-lg shadow-primary/10 ring-2 ring-primary/20"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 shadow-md"
                        : "bg-gray-50/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50"
                    }`}
                    whileHover={isCompleted ? { scale: 1.05 } : {}}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className={
                        isCompleted
                          ? isActive
                            ? "text-primary"
                            : "text-gray-600 dark:text-gray-300"
                          : "text-gray-400 dark:text-gray-600"
                      }
                    >
                      {getStatusIcon(item.shipmentStatus, isCompleted, isActive)}
                    </div>

                    {/* Completion indicator dot */}
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                        className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${
                          isActive ? "bg-primary shadow-sm" : "bg-green-500 shadow-sm"
                        } flex items-center justify-center`}
                      >
                        <CheckCircle className="w-2.5 h-2.5 text-white" strokeWidth={2} />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <h4
                          className={`text-xl font-light transition-colors ${
                            isCompleted
                              ? isActive
                                ? "text-foreground"
                                : "text-foreground/90"
                              : "text-muted-foreground"
                          }`}
                        >
                          {item.shipmentStatus}
                        </h4>
                        {getEventBadge(item.shipmentStatus, isCompleted)}
                      </div>

                      <div className="flex items-center gap-6 text-sm font-light">
                        <span
                          className={`flex items-center gap-2 ${
                            isCompleted ? "text-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          <Calendar className="w-4 h-4" strokeWidth={1} />
                          {formatTrackingDate(item.date)}
                        </span>
                        <span
                          className={`flex items-center gap-2 ${
                            isCompleted ? "text-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          <Clock className="w-4 h-4" strokeWidth={1} />
                          {item.time}
                        </span>
                      </div>
                    </div>

                    <motion.p
                      className={`font-light leading-relaxed mb-3 ${
                        isCompleted ? "text-foreground/80" : "text-muted-foreground"
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                    >
                      {item.shipmentDetails}
                    </motion.p>

                    {item.location && (
                      <motion.p
                        className={`text-sm font-light flex items-center gap-2 ${
                          isCompleted ? "text-foreground/70" : "text-muted-foreground"
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                      >
                        <MapPin className="w-4 h-4" strokeWidth={1} />
                        {item.location}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
