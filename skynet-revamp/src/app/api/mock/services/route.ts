import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: 1,
        attributes: {
          title: "Air Freight",
          slug: "air-freight",
          shortDescription: "Lightning-fast air cargo services for time-sensitive shipments worldwide",
          description:
            "Our air freight services provide the fastest delivery options for your urgent shipments.\n\n## Why Choose Our Air Freight Services?\n\nWith our extensive global network and partnerships with major airlines, we ensure your cargo reaches its destination quickly and safely. Our air freight solutions are perfect for time-sensitive shipments, high-value goods, and international deliveries.\n\n- Door-to-door delivery within 24-48 hours\n- Real-time tracking and status updates\n- Customs clearance assistance\n- Temperature-controlled options available\n- Priority handling at all checkpoints\n\n## Coverage Areas\n\nWe offer air freight services to over 190 countries worldwide, with daily flights to major business hubs including:\n- North America\n- Europe\n- Asia Pacific\n- Middle East\n- Africa\n\nOur dedicated team of logistics experts ensures smooth handling of your shipments from pickup to delivery, providing you with peace of mind and reliable service you can count on.",
          icon: "Plane",
          Highlights: [
            {
              id: 1,
              title: "Express delivery",
              description: "24-48 hour delivery worldwide",
              icon: "Zap",
            },
            {
              id: 2,
              title: "Real-time tracking",
              description: "Track your shipment every step",
              icon: "MapPin",
            },
            {
              id: 3,
              title: "Priority handling",
              description: "First priority at all checkpoints",
              icon: "Shield",
            },
          ],
          featured: true,
          order: 1,
          ctaText: "Ship by Air",
          ctaLink: "/services/air-freight",
          image: {
            data: {
              id: 1,
              attributes: {
                name: "air-freight-hero.jpg",
                url: "/images/services/air-freight-hero.jpg",
                formats: {
                  large: { url: "/images/services/air-freight-hero.jpg" },
                },
              },
            },
          },
        },
      },
      {
        id: 2,
        attributes: {
          title: "Road Transport",
          slug: "road-transport",
          shortDescription: "Reliable door-to-door delivery across India with our extensive road network",
          description: "Cost-effective road transportation solutions for domestic shipments.",
          icon: "Truck",
          Highlights: [
            {
              id: 1,
              title: "Pan India coverage",
              description: "10,000+ pin codes served",
              icon: "MapPin",
            },
            {
              id: 2,
              title: "Safe handling",
              description: "Trained drivers and secure vehicles",
              icon: "Shield",
            },
            {
              id: 3,
              title: "Flexible scheduling",
              description: "Daily pickup and delivery",
              icon: "Clock",
            },
          ],
          featured: true,
          order: 2,
          ctaText: "Ship by Road",
          ctaLink: "/services/road-transport",
          image: {
            data: {
              id: 2,
              attributes: {
                name: "road-transport-hero.jpg",
                url: "/images/services/road-transport-hero.jpg",
                formats: {
                  large: { url: "/images/services/road-transport-hero.jpg" },
                },
              },
            },
          },
        },
      },
      {
        id: 3,
        attributes: {
          title: "E-Commerce Delivery",
          slug: "ecommerce-delivery",
          shortDescription: "Specialized logistics solutions for online businesses and marketplaces",
          description: "End-to-end e-commerce fulfillment with COD and prepaid options.",
          icon: "ShoppingCart",
          Highlights: [
            {
              id: 1,
              title: "COD available",
              description: "Cash on delivery across India",
              icon: "CreditCard",
            },
            {
              id: 2,
              title: "Easy returns",
              description: "Hassle-free reverse logistics",
              icon: "Package",
            },
            {
              id: 3,
              title: "API integration",
              description: "Seamless platform integration",
              icon: "Code",
            },
          ],
          featured: true,
          order: 3,
          ctaText: "E-Commerce Solutions",
          ctaLink: "/services/ecommerce",
          image: {
            data: {
              id: 3,
              attributes: {
                name: "ecommerce-hero.jpg",
                url: "/images/services/ecommerce-hero.jpg",
                formats: {
                  large: { url: "/images/services/ecommerce-hero.jpg" },
                },
              },
            },
          },
        },
      },
      {
        id: 4,
        attributes: {
          title: "International Shipping",
          slug: "international-shipping",
          shortDescription: "Seamless cross-border delivery to 209 countries with customs clearance",
          description: "Global shipping solutions with complete documentation and customs support.",
          icon: "Globe",
          Highlights: [
            {
              id: 1,
              title: "209 countries",
              description: "Worldwide delivery network",
              icon: "Globe",
            },
            {
              id: 2,
              title: "Customs clearance",
              description: "Complete documentation support",
              icon: "FileText",
            },
            {
              id: 3,
              title: "Multi-modal",
              description: "Air, sea, and road options",
              icon: "Layers",
            },
          ],
          featured: true,
          order: 4,
          ctaText: "Go Global",
          ctaLink: "/services/international",
          image: {
            data: {
              id: 4,
              attributes: {
                name: "international-shipping-hero.jpg",
                url: "/images/services/international-shipping-hero.jpg",
                formats: {
                  large: {
                    url: "/images/services/international-shipping-hero.jpg",
                  },
                },
              },
            },
          },
        },
      },
      {
        id: 5,
        attributes: {
          title: "Warehousing",
          slug: "warehousing",
          shortDescription: "State-of-the-art storage facilities with inventory management",
          description: "Secure warehousing solutions with real-time inventory tracking.",
          icon: "Package",
          Highlights: [
            {
              id: 1,
              title: "24/7 security",
              description: "CCTV and manned security",
              icon: "Shield",
            },
            {
              id: 2,
              title: "Climate controlled",
              description: "Temperature-sensitive storage",
              icon: "Thermometer",
            },
            {
              id: 3,
              title: "Inventory management",
              description: "Real-time stock tracking",
              icon: "BarChart",
            },
          ],
          featured: true,
          order: 5,
          ctaText: "Storage Solutions",
          ctaLink: "/services/warehousing",
          image: {
            data: {
              id: 5,
              attributes: {
                name: "warehousing-hero.jpg",
                url: "/images/services/warehousing-hero.jpg",
                formats: {
                  large: { url: "/images/services/warehousing-hero.jpg" },
                },
              },
            },
          },
        },
      },
      {
        id: 6,
        attributes: {
          title: "Express Delivery",
          slug: "express-delivery",
          shortDescription: "Time-definite delivery for urgent shipments across metro cities",
          description: "Same-day and next-day delivery options for critical shipments.",
          icon: "Zap",
          Highlights: [
            {
              id: 1,
              title: "Same-day delivery",
              description: "Within metro cities",
              icon: "Zap",
            },
            {
              id: 2,
              title: "Time slots",
              description: "Choose delivery windows",
              icon: "Clock",
            },
            {
              id: 3,
              title: "Priority support",
              description: "Dedicated customer service",
              icon: "Headphones",
            },
          ],
          featured: true,
          order: 6,
          ctaText: "Express Service",
          ctaLink: "/services/express",
          image: {
            data: {
              id: 6,
              attributes: {
                name: "express-delivery-hero.jpg",
                url: "/images/services/express-delivery-hero.jpg",
                formats: {
                  large: { url: "/images/services/express-delivery-hero.jpg" },
                },
              },
            },
          },
        },
      },
    ],
    meta: {
      pagination: {
        page: 1,
        pageSize: 25,
        pageCount: 1,
        total: 6,
      },
    },
  })
}
