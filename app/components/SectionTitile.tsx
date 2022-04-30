const SectionTitle = ({
  heading,
  description,
  align,
  color,
  showDescription,
}: SectionTitleType) => {
  const title = {
    showDescription: showDescription || false,
    align: align || "center",
    color: color || "primary",
  };
  return (
    <div className="section-title">
      <div className="container">
        <div className={`mx-auto align-${title.align}`}>
          <h2 className="font-bold max-w-3xl">{heading}</h2>
          {title.showDescription && (
            <p className="max-w-xl mt-2 leading-7 text-18base">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
export type SectionTitleType = {
  heading: string;
  description: string;
  align: "left" | "right" | "center";
  color: "white" | "primary";
  showDescription: boolean;
};
export default SectionTitle;
