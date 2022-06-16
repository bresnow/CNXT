import { LoaderFunction } from 'remix';

export type Post = {
  id: string;
  title: string;
  author: string;
  postedAt: { date: string; slug: string };
  slug: string;
  image: { src: string };
};

export let loader: LoaderFunction = async (): Promise<Post[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let results: Post[] = [];

  for (let i = 0; i < 10; i++) {
    results.push({
      id: `${i}`,
      title: `Post ${i}`,
      author: `Author ${i}`,
      postedAt: { date: Date.now().toString(), slug: `post-${i}` },
      slug: `post-${i}`,
      image: { src: '/assets/images/placeholder-image.png' },
    });
  }

  return results;
};
