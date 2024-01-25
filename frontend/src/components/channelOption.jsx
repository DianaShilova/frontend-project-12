import Dropdown from "react-bootstrap/Dropdown";

export const ChannelOption = (props) => {
  const { id, onChannelDelete } = props;
  return (
    <Dropdown>
      <Dropdown.Toggle variant="Secondary" id={id}></Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onChannelDelete(id)}>
          Удалить
        </Dropdown.Item>
        <Dropdown.Item>Переименовать</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
