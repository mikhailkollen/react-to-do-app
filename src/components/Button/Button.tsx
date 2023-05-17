import { ButtonProps } from "../../types";
import { ReactElement } from "react";
import DeleteIcon from "./assets/DeleteIcon";
import EditIcon from "./assets/EditIcon";

const Button = ({ text, onClick, className }: ButtonProps): ReactElement => {
  const onClickHandler = onClick ? () => onClick() : () => { };

  return (
    <button className={`${className} ${(className === "delete-button" || className === "edit-button") && "list-item-button"}`} onClick={onClickHandler}>
      {className === "delete-button" ? (
        <DeleteIcon />
      ) : className === "edit-button" ? (
        <EditIcon />
      ) : (
        text
      )}
    </button>
  );
};

export default Button;