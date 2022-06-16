interface Props {
  title: string;
  titleColor?: string;
  span?: string;
  spanColor?: string;
  description?: string;
}

export default function Display({
  title,
  span,
  titleColor,
  spanColor,
  description,
}: Props) {
  // main fun?ction
  return (
    <div className='grid grid-cols-1 p-2 mt-2'>
      <h1
        className={`font-heading uppercase text-3xl  font-black flex flex-col flex-wrap leading-none text-[#cb2326]`}
      >
        {title}
        <span
          className={`flex flex-col flex-wrap text-2xl text-[#3497fb] sm:text-3xl`}
        >
          {span}
        </span>
      </h1>
      <p className='flex-wrap sm:text-md text-md text-zinc-900 mt-5	'>
        {description}
      </p>
    </div>
  );
}
