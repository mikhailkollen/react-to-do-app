import { ButtonProps } from "../../types";
import { ReactElement } from "react";
import DeleteIcon from "./assets/DeleteIcon";

 const Button = ({ text, onClick, className }: ButtonProps): ReactElement => {
  const onClickHandler = onClick ? () => onClick() : () => {};
  
  return <button className={className} onClick={()=> onClickHandler() }>{className === "delete-button" ? <DeleteIcon/> : text}</button>;
}

export default Button;