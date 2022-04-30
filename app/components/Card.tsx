import { Link } from "remix";

type CardType = {
  ({
    image,
    name,
    slug,
    label,
    socials,
  }: {
    image: { src: string; alt: string };
    name: string;
    slug?: string;
    label: string;
    socials?: { link: string; icon: string; id: string }[];
  }): JSX.Element;
};

export const Card: CardType = ({ image, name, slug, label, socials }) => {
  return (
    <div className="player-card relative group">
      <div className="player-thum relative z-20">
        <img
          className="align-middle ml-3 rounded-5xl transition-all group-hover:ml-5"
          src={image.src}
          alt={image.alt}
        />
        <span className="w-full h-full absolute left-0 top-0 bg-gray-900 rounded-5xl opacity-0 group-hover:opacity-70">
          {label}
        </span>

        <div className="social-link absolute left-0 text-center bottom-0 group-hover:bottom-8 w-full space-x-2 opacity-0 group-hover:opacity-100 transition-all z-20">
          {socials &&
            socials?.map(({ link, icon, id }) => (
              <li key={id} className="text-center inline-block">
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-10 flex items-center justify-center bg-social-shape hover:bg-social-hover-shape transition-all bg-cover"
                >
                  <i className={icon}></i>
                </a>
              </li>
            ))}
        </div>
      </div>
      <div className="our-team-info py-5 xl:py-7 text-center transition-all mt-8 w-full z-10">
        <h3 className="uppercase font-bold mb-3">
          <Link to={`/players/${slug}`}>{name}</Link>
        </h3>
        <h5 className="text-white">{label}</h5>
      </div>
    </div>
  );
};
