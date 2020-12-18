import React, { useContext } from 'react';

import { StockContext } from 'context/StockContext';

import { Dropdown, DropdownList, DropdownText } from './TagDropdown.styles';

const TagDropdown = ({ card, addTags }) => {
  const {
    state: { labelObjectList: labels },
  } = useContext(StockContext);

  return (
    <Dropdown
      size="medium"
      placement="bottom-start"
      content={
        <div>
          {labels.map((label) => (
            <DropdownList
              key={label.id}
              onClick={() => {
                addTags(label, card);
              }}
            >
              {label.name}
            </DropdownList>
          ))}
        </div>
      }
    >
      <DropdownText>태그</DropdownText>
    </Dropdown>
  );
};

export default React.memo(TagDropdown);
