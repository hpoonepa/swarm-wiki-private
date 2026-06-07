export interface Props {
    headingLevel: "h1" | "h2" | "h3" | null;
    title1?: string;
    title2?: string;
    content1?: string;
    content2?: string;
    image1?: string;
    image2?: string;
  }
  
  export default function TwoColPara(props: Props) {
    <div className="flex justify-between">
      <div className="mr-4">
        {props.headingLevel == "h1" && <h1>{props.title1}</h1>}
        {props.headingLevel == "h2" && <h2>{props.title1}</h2>}
        {props.headingLevel == "h3" && <h3>{props.title1}</h3>}
        <p>{props.content1}</p>
        <img src={props.image1} alt="" />
      </div>
      <div>
        {props.headingLevel == "h1" && <h1>{props.title1}</h1>}
        {props.headingLevel == "h2" && <h2>{props.title1}</h2>}
        {props.headingLevel == "h3" && <h3>{props.title1}</h3>}
        <p>{props.content2}</p>
        <img src={props.image2} alt="" />
      </div>
    </div>;
  }
  