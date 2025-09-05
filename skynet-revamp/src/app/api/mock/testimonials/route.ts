import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: 1,
        attributes: {
          name: "Rajesh Kumar",
          role: "CEO",
          company: "TechMart India",
          content:
            "Skynet has transformed our e-commerce logistics. Their reliable service and extensive network ensure our customers receive their orders on time, every time. The COD service has been particularly valuable for our business growth.",
          rating: 5,
          featured: true,
          avatar: {
            data: {
              attributes: {
                url: "/api/placeholder/64/64",
              },
            },
          },
        },
      },
      {
        id: 2,
        attributes: {
          name: "Priya Sharma",
          role: "Operations Manager",
          company: "Fashion Forward",
          content:
            "The integration with our online store was seamless. Skynet's real-time tracking and professional handling of returns have significantly improved our customer satisfaction scores. Highly recommended!",
          rating: 5,
          featured: true,
          avatar: {
            data: {
              attributes: {
                url: "/api/placeholder/64/64",
              },
            },
          },
        },
      },
      {
        id: 3,
        attributes: {
          name: "Mohammed Ali",
          role: "Supply Chain Head",
          company: "Global Traders",
          content:
            "For our international shipments, Skynet is unmatched. Their customs clearance expertise and global network have made cross-border trade effortless. The team is always responsive and professional.",
          rating: 5,
          featured: true,
          avatar: {
            data: {
              attributes: {
                url: "/api/placeholder/64/64",
              },
            },
          },
        },
      },
      {
        id: 4,
        attributes: {
          name: "Anita Desai",
          role: "Founder",
          company: "Artisan Crafts",
          content:
            "As a small business, we needed a logistics partner who could handle our unique packaging needs. Skynet's personalized service and careful handling of our delicate products have been exceptional.",
          rating: 5,
          featured: true,
          avatar: {
            data: {
              attributes: {
                url: "/api/placeholder/64/64",
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
        total: 4,
      },
    },
  })
}
