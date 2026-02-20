import { notFound } from "next/navigation";
import { allProjects } from "contentlayer/generated";
import { Mdx } from "@/app/components/mdx";
import { Header } from "./header";
import "./mdx.css";
import { ReportView } from "./view";
import { Redis } from "@upstash/redis";

export const revalidate = 60;

type Props = {
  params: {
    slug: string;
  };
};

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? Redis.fromEnv()
    : null;

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allProjects
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
    }));
}

export default async function PostPage({ params }: Props) {
  const slug = params?.slug;
  const project = allProjects.find((project) => project.slug === slug);
  const isBrainProject = project?.slug === "inside-look-into-my-brain";

  if (!project) {
    notFound();
  }

  let views = 0;
  if (redis) {
    try {
      views =
        (await redis.get<number>(["pageviews", "projects", slug].join(":"))) ??
        0;
    } catch {
      views = 0;
    }
  }

  return (
    <div className={isBrainProject ? "bg-black min-h-screen" : "bg-zinc-50 min-h-screen"}>
      <Header project={project} views={views} />
      <ReportView slug={project.slug} />

      <article
        className={
          isBrainProject
            ? "px-4 pb-16 pt-10 mx-auto max-w-6xl text-white"
            : "px-4 py-12 mx-auto prose prose-zinc prose-quoteless"
        }
      >
        <Mdx code={project.body.code} />
      </article>
    </div>
  );
}
