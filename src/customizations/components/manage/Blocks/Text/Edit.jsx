/**
 * Edit text block.
 * @module components/manage/Blocks/Title/Edit
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import { Editor } from '@tinymce/tinymce-react';

import { defineMessages, injectIntl } from 'react-intl';
import { includes, isEqual } from 'lodash';

import { settings, blocks } from '~/config';

import { Icon, BlockChooser } from '@plone/volto/components';
import addSVG from '@plone/volto/icons/circle-plus.svg';

const messages = defineMessages({
  text: {
    id: 'Type text…',
    defaultMessage: 'Type text…',
  },
});

/**
 * Edit text block class.
 * @class Edit
 * @extends Component
 */
class Edit extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    data: PropTypes.objectOf(PropTypes.any).isRequired,
    detached: PropTypes.bool,
    index: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    block: PropTypes.string.isRequired,
    onAddBlock: PropTypes.func.isRequired,
    onChangeBlock: PropTypes.func.isRequired,
    onDeleteBlock: PropTypes.func.isRequired,
    onMutateBlock: PropTypes.func.isRequired,
    onFocusPreviousBlock: PropTypes.func.isRequired,
    onFocusNextBlock: PropTypes.func.isRequired,
    onSelectBlock: PropTypes.func.isRequired,
    editable: PropTypes.bool,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    detached: false,
    editable: true,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);

    if (!__SERVER__) {
      let editorState = props?.data?.text || '';

      this.state = {
        editorState,

        addNewBlockOpened: false,
      };
    }

    this.onChange = this.onChange.bind(this);
    this.addNextBlock = this.addNextBlock.bind(this);
  }

  /**
   * Component will receive props
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (this.props.selected) {
      // See https://github.com/draft-js-plugins/draft-js-plugins/issues/800
      setTimeout(this.node.focus, 0);
    }
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!this.props.selected && nextProps.selected) {
      // See https://github.com/draft-js-plugins/draft-js-plugins/issues/800
      setTimeout(this.node.focus, 0);
    }
  }

  /**
   * Component will unmount
   * @method componentWillUnmount
   * @returns {undefined}
   */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} editorState Editor state.
   * @returns {undefined}
   */
  onChange(editorState) {
    if (!isEqual(editorState, this.state.editorState)) {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        text: editorState,
      });
    }
    this.setState({ editorState });
  }

  toggleAddNewBlock = (e) => {
    e.preventDefault();
    this.setState((state) => ({ addNewBlockOpened: !state.addNewBlockOpened }));
  };

  handleClickOutside = (e) => {
    if (
      this.props.blockNode.current &&
      doesNodeContainClick(this.props.blockNode.current, e)
    )
      return;
    this.setState(() => ({
      addNewBlockOpened: false,
    }));
  };

  addNextBlock = () => {
    this.props.onSelectBlock(
      this.props.onAddBlock('text', this.props.index + 1),
    );
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (__SERVER__) {
      return <div />;
    }

    const placeholder =
      this.props.data.placeholder ||
      this.props.intl.formatMessage(messages.text);

    const disableNewBlocks =
      this.props.data?.disableNewBlocks || this.props.detached;

    return (
      <>
        <Editor
          initialValue={this.state?.editorState}
          init={{
            inline_styles: true,
            inline: true,
            menubar: false, //'view',
            placeholder: placeholder,
            readonly: !this.props.editable,
            setup: function (editor) {
              editor.on('keydown', function (e) {
                console.log(e);
                if (e.keyCode === 13) {
                  let isSoftNewlineEvent = e.shiftKey;
                  if (isSoftNewlineEvent) {
                    //do nothig. Tiny adds new line inside editor by default
                  } else {
                    if (!disableNewBlocks) {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log(this);
                      this.addNextBlock();
                    }
                  }
                }
              });
            },
            formats: {
              callout: {
                block: 'p',
                classes: 'callout',
              },
            },
            init_instance_callback: function (editor) {
              var freeTiny = document.querySelector(
                '.tox .tox-notification--in',
              );
              if (freeTiny) {
                freeTiny.style.display = 'none';
              }
            },
            block_formats: 'callout=callout',
            forced_root_block: 'p',
            table_header_type: 'cells',
            body_class: 'public-ui',
            table_default_attributes: {
              border: '1',
              class: 'ui celled fixed table',
            },
            content_style:
              '.table th { background-color: #ebeced; padding: 18px!important; } .table td { padding: 18px!important } \
                            .callout { padding: 1.25rem; margin-top: 1.25rem; margin-bottom: 1.25rem; border: 1px solid #d9dadb; border-left-width: 0.4rem; border-radius: 0.25rem; }',
            language: this.props.intl.locale,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
            ],
            toolbar: [
              'underline bold italic link h2 h3 bullist numlist blockquote formatselect removeformat table',
              'callout',
            ],
          }}
          onEditorChange={this.onChange}
          ref={(node) => {
            this.node = node;
          }}
        />

        {this.props.selected &&
          !disableNewBlocks &&
          !blocks.blocksConfig[
            this.props.data?.['@type'] || 'text'
          ].blockHasValue(this.props.data) && (
            <Button
              basic
              icon
              onClick={this.toggleAddNewBlock}
              className="block-add-button"
            >
              <Icon name={addSVG} className="block-add-button" size="24px" />
            </Button>
          )}
        {this.state.addNewBlockOpened && (
          <BlockChooser
            onMutateBlock={this.props.onMutateBlock}
            currentBlock={this.props.block}
          />
        )}
      </>
    );
  }
}

export default injectIntl(Edit);
