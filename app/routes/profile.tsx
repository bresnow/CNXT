import { Suspense } from "react";
import { Link, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import Gun from "gun";
import { useDeferedLoaderData } from "~/dataloader/lib";
import React from "react";

type LoaderData = {
  username: string;
};
type BlogNoSideBar = {
  getItems: () => {
    title: string;
    author: string;
    postedAt: { date: string; slug: string };
    slug: string;
    image: { src: string };
  }[];
};
export let loader: LoaderFunction = () => {
  return {
    username: "Remix",
  };
};

function SuspendedProfileInfo({ getData }: { getData: () => any }) {
  let data = getData();

  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export default function Profile() {
  let { username } = useLoaderData<LoaderData>();
  let postsLoader = useDeferedLoaderData<any>("/api/posts");

  return (
    <>
      <h1>Profile: {username}</h1>
      <Suspense fallback="Loading Profile....">
        <BlogNoSideBar getItems={postsLoader.load} />
      </Suspense>
    </>
  );
}

type BlogCard = {
  title: string;
  author: string;
  date: string;
  slug: string;
  dateSlug: string;
  image: string;
};

export const BlogCard = ({ title, date, slug, dateSlug, image }: BlogCard) => {
  return (
    <div className="single_blog flex sm:flex-row md:flex-row items-center mt-7">
      <div className="blog_thumb w-28 justify-center items-center sm:w-28 md:w-28 lg:w-48 flex-shrink-0">
        <Link to={`/${slug}`} className="block">
          <img
            className="rounded-4xl"
            src={image ?? "~/assets/images/placeholder-image.png"}
            alt={title}
          />
        </Link>
      </div>
      <div className="blog_content ml-4 md:ml-4 lg:ml-9">
        <div className="blog_date">
          <Link to={`/date/${dateSlug}`} className="mb-2 block">
            <i className="icofont-calendar text-primary mr-2"></i>
            {date}
          </Link>
        </div>
        <h3 className="font-bold uppercase mb-1 md:mb-3 md:text-18base lg:text-md">
          <Link to={`/${slug}`} className="hover:text-primary">
            {title || "Blog Title"}
          </Link>
        </h3>
        <Link
          to={`/${slug}`}
          className="pl-11 text-sm font-medium sm:uppercase hover:text-primary relative 
                    text-white 
                    after:absolute
                    content-after
                  after:bg-primary
                    after:w-8 
                    after:h-0.5
                    after:z-0 
                    after:top-1/2 
                    after:left-0 
                    after:transform 
                    after:-translate-y-2/4 
                    after:transition 
                    after:opacity-100"
        >
          More Deatails
        </Link>
      </div>
    </div>
  );
};

export const BlogNoSideBar = ({ getItems }: BlogNoSideBar) => {
  let items = getItems();
  return (
    <section className="blog-section">
      <div className="container px-4">
        <div className="flex flex-wrap -mx-3">
          {items &&
            items.map(({ postedAt, title, author, slug, image }) => (
              <div
                className="w-full sm:w-1/2 md:w-1/2 lg:w-1/2 px-4"
                key={`blog-post-${title}`}
              >
                <BlogCard
                  title={title}
                  author={author}
                  date={postedAt.date}
                  dateSlug={postedAt.slug}
                  slug={slug}
                  image={image.src}
                />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
