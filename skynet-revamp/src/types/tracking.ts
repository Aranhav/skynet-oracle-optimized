// Skynet Tracking API Types

export interface TrackingResponse {
  stateCode: string
  message: string
  data: TrackingData
}

export interface TrackingData {
  shipmentOrderID: string
  status: "SUCCESS" | "ERROR"
  message: string
  shipmentDetails: ShipmentDetails[] | null
  statusDetails: StatusDetails[] | null
  shipmentHistory: ShipmentHistory[] | null
}

export interface ShipmentDetails {
  airwayBillNo: string
  awbDate: string
  forwarderNo: string
  forwarder: string
  forwarderNo2: string
  forwarder2: string
  destination: string
  weight: string
  status: string
  deliveryDate: string
  receiverName: string
  remarks: string
}

export interface StatusDetails {
  status: string
  deliveryDate: string
  deliveryTime: string
  receiverName: string
  remarks: string
}

export interface ShipmentHistory {
  shipmentStatus: string
  shipmentDetails: string
  date: string
  time: string
  location: string
}

// Status types for UI styling
export type ShipmentStatusType =
  | "Booked"
  | "Handover"
  | "Inscanned"
  | "Reweight"
  | "Processed"
  | "INTRANSIT"
  | "CANCELED"
  | "INFO RECEIVED"
  | "Delivered"
  | string

// Helper type for status colors/icons
export const getStatusConfig = (status: string) => {
  const normalizedStatus = status.toUpperCase()

  switch (normalizedStatus) {
    case "DELIVERED":
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        icon: "CheckCircle",
      }
    case "INTRANSIT":
    case "IN TRANSIT":
      return { color: "text-blue-600", bgColor: "bg-blue-50", icon: "Truck" }
    case "PROCESSED":
    case "INSCANNED":
      return {
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        icon: "Package",
      }
    case "BOOKED":
    case "INFO RECEIVED":
      return {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        icon: "FileText",
      }
    case "CANCELED":
      return { color: "text-red-600", bgColor: "bg-red-50", icon: "XCircle" }
    default:
      return { color: "text-gray-600", bgColor: "bg-gray-50", icon: "Info" }
  }
}
