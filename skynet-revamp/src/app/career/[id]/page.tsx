import { fetchAPI, strapiQuery } from "@/lib/strapi-demo"
import { Job } from "@/types/strapi"
import { StrapiResponse, StrapiData } from "@/lib/strapi"
import { parseRichText } from "@/lib/strapi-rich-text"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { notFound } from "next/navigation"
import JobDetailsContent from "@/components/career/job-details-content"

async function getJob(id: string) {
  try {
    const response: StrapiResponse<StrapiData<Job>[]> = await fetchAPI(
      "/jobs",
      strapiQuery.build(strapiQuery.populate("*"), { "filters[id][$eq]": id }),
    )

    if (response.data.length === 0) {
      return null
    }

    return {
      ...response.data[0].attributes,
      id: response.data[0].id,
    }
  } catch (error) {
    console.error("Failed to fetch job:", error)
    return null
  }
}

async function getRelatedJobs(department: string, currentJobId: number) {
  try {
    const response: StrapiResponse<StrapiData<Job>[]> = await fetchAPI(
      "/jobs",
      strapiQuery.build(
        strapiQuery.populate("*"),
        {
          "filters[department][$eq]": department,
          "filters[id][$ne]": currentJobId,
          "filters[active][$eq]": true,
        },
        strapiQuery.pagination(1, 3),
      ),
    )

    return response.data.map((item) => ({
      ...item.attributes,
      id: item.id,
    }))
  } catch (error) {
    console.error("Failed to fetch related jobs:", error)
    return []
  }
}

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id)

  if (!job) {
    notFound()
  }

  const relatedJobs = await getRelatedJobs(job.department, job.id)

  // Parse rich text content on the server
  const parsedDescription = parseRichText(job.description)
  const parsedRequirements = parseRichText(job.requirements)
  const parsedBenefits = job.benefits ? parseRichText(job.benefits) : null

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <JobDetailsContent
          job={job}
          relatedJobs={relatedJobs}
          parsedDescription={parsedDescription}
          parsedRequirements={parsedRequirements}
          parsedBenefits={parsedBenefits}
        />
      </main>
      <Footer />
    </>
  )
}
