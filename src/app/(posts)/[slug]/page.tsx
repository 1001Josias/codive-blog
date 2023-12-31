import { format, parseISO } from "date-fns";
import { useMDXComponent } from "next-contentlayer/hooks";
import { allPosts } from "contentlayer/generated";

export const generateStaticParams = async () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = ({ params }: { params: { slug: string } }) => {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  return { title: post.title };
};

export default function PostLayout({ params }: { params: { slug: string } }) {
  const post = allPosts.find((post) => post._raw.flattenedPath === params.slug);
  if (!post) throw new Error(`Post not found for slug: ${params.slug}`);
  const MdxComponent = useMDXComponent(post.body.code);

  return (
    <article className='prose dark:prose-invert mx-auto max-w-xl py-8'>
      <div className='mb-8 text-center'>
        <time dateTime={post.date} className='mb-1 text-xs text-gray-600'>
          {format(parseISO(post.date), "LLLL d, yyyy")}
        </time>
        <h1 className='text-3xl font-bold'>{post.title}</h1>
      </div>
      <div className='[&>*]:mb-3 [&>*:last-child]:mb-0'>
        <MdxComponent />
      </div>
    </article>
  );
}
