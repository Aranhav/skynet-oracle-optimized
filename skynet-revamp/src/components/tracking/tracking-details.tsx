"use client"

import { motion } from "framer-motion"
import { Package, MapPin, Calendar, Scale, Truck, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShipmentDetails, StatusDetails } from "@/types/tracking"
import { formatTrackingDate, getEstimatedDelivery } from "@/lib/tracking-api"

interface TrackingDetailsProps {
  details: ShipmentDetails
  statusDetails?: StatusDetails | null
}

export default function TrackingDetails({ details, statusDetails }: TrackingDetailsProps) {
  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toUpperCase()

    if (normalizedStatus.includes("DELIVERED")) {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-0 px-4 py-1.5 text-base font-light">Delivered</Badge>
      )
    } else if (normalizedStatus.includes("TRANSIT") || normalizedStatus.includes("PROCESSED")) {
      return <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 text-base font-light">In Transit</Badge>
    } else if (normalizedStatus.includes("CANCEL")) {
      return <Badge className="bg-red-500/10 text-red-600 border-0 px-4 py-1.5 text-base font-light">Cancelled</Badge>
    } else {
      return <Badge className="bg-gray-500/10 text-gray-600 border-0 px-4 py-1.5 text-base font-light">{status}</Badge>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Status Overview */}
      <Card className="p-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-light mb-3">
              Tracking Number: <span className="text-primary">{details.forwarderNo}</span>
            </h2>
            <p className="text-muted-foreground font-light text-base">
              AWB: {details.airwayBillNo} • Booked on {formatTrackingDate(details.awbDate)}
            </p>
          </div>
          <div className="text-center md:text-right">
            {getStatusBadge(details.status)}
            {details.deliveryDate ? (
              <p className="text-sm text-muted-foreground font-light mt-3">
                Delivered on {formatTrackingDate(details.deliveryDate)}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground font-light mt-3">
                Est. delivery: {getEstimatedDelivery(details.destination, details.awbDate)}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" strokeWidth={1} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-light mb-2">Destination</p>
              <p className="font-normal text-base">{details.destination}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Scale className="w-6 h-6 text-primary" strokeWidth={1} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-light mb-2">Weight</p>
              <p className="font-normal text-base">{details.weight}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6 text-primary" strokeWidth={1} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-light mb-2">Forwarder</p>
              <p className="font-normal text-base">{details.forwarder}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              {details.deliveryDate ? (
                <CheckCircle className="w-6 h-6 text-primary" strokeWidth={1} />
              ) : (
                <Package className="w-6 h-6 text-primary" strokeWidth={1} />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-light mb-2">Status</p>
              <p className="font-normal text-base">{details.status}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Details */}
      {(details.receiverName || details.remarks || details.forwarderNo2) && (
        <Card className="p-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-light mb-6">Additional Information</h3>
          <div className="space-y-3">
            {details.receiverName && (
              <div className="flex justify-between">
                <span className="text-muted-foreground font-light">Receiver</span>
                <span className="font-light">{details.receiverName}</span>
              </div>
            )}
            {details.forwarderNo2 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground font-light">Secondary Tracking</span>
                <span className="font-light">{details.forwarderNo2}</span>
              </div>
            )}
            {details.remarks && (
              <div className="flex justify-between">
                <span className="text-muted-foreground font-light">Remarks</span>
                <span className="font-light">{details.remarks}</span>
              </div>
            )}
          </div>
        </Card>
      )}
    </motion.div>
  )
}
