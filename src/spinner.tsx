import { h } from "preact";
import image from "./assets/Building GIF.gif";
interface SpinnerProps {
  className?: string;
}

export const Spinner = ({ className = "" }: SpinnerProps): h.JSX.Element => (
  <div class={"spinner"}>
    <span className="sr-only">Building...</span>
    <img src={image} alt="Building..." />
  </div>
);
