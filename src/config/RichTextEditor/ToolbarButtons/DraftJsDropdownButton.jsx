import React, { useState } from 'react';
import PropTypes from 'prop-types';
import unionClassNames from 'union-class-names';

import Icon from '@plone/volto/components/theme/Icon/Icon';
import textSVG from '@plone/volto/icons/text.svg';

/*
Questo è un componente di utility che serve per fare i menu a tendina nella toolbar di draftjs.
Basta passargli le prop del componente stesso e nella prop optionsList l'elenco delle opzioni
da mostrare nella tendina.
*/
const DraftJsDropdownButton = (props) => {
  const { theme, optionsList } = props;
  const [open, setOpen] = useState(false);

  const hasBlockStyle = () => {
    if (!props.getEditorState) {
      return false;
    }

    const editorState = props.getEditorState();
    const type = editorState
      .getCurrentContent()
      .getBlockForKey(editorState.getSelection().getStartKey())
      .getType();

    return props.optionsList.map((o) => o.block_type).indexOf(type) >= 0;
  };

  const className = hasBlockStyle()
    ? unionClassNames(theme.button, theme.active)
    : theme.button;

  const onMouseDown = (event) => {
    event.preventDefault();
  };

  const openDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  return (
    <div
      className={`${theme.buttonWrapper} draftJsToolbarDropdown`}
      onMouseDown={onMouseDown}
      role="presentation"
    >
      <button
        className={`${className} draftJsToolbarDropdown-toggle`}
        onClick={openDropdown}
        type="button"
      >
        <Icon name={textSVG} size="24px" />
        <span className={`caret ${open ? 'up' : 'down'}`}></span>
      </button>

      <ul
        className={`draftJsToolbarDropdown-optionswrapper ${
          open ? '' : 'hide'
        }`}
      >
        {optionsList.map((item) => {
          let OptionButton = item.value;

          return (
            <li
              key={item.block_type}
              className="draftJsToolbarDropdown-option"
              onClick={() => {
                setOpen(false);
              }}
            >
              <OptionButton {...props} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

DraftJsDropdownButton.propTypes = {
  onChange: PropTypes.func,
  editorState: PropTypes.object,
  placeholder: PropTypes.string,
  theme: PropTypes.shape({}).isRequired,
  ownTheme: PropTypes.shape({}),
  onOverrideContent: PropTypes.func.isRequired,
  optionsList: PropTypes.arrayOf(
    PropTypes.shape({ block_type: PropTypes.string, value: PropTypes.any }),
  ).isRequired,
};
export default DraftJsDropdownButton;
