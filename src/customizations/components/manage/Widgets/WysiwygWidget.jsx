/**
 * WysiwygWidget container.
 * @module components/manage/WysiwygWidget/WysiwygWidget
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Form, Label, TextArea } from 'semantic-ui-react';
import { map } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';
import { createEditor, Node } from 'slate';
import { withHistory } from 'slate-history';
import { withReact } from 'slate-react';
import SlateRichTextWidget from '@italia/addons/volto-slate/widgets/RichTextWidget'

const messages = defineMessages({
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  idTitle: {
    id: 'Short Name',
    defaultMessage: 'Short Name',
  },
  idDescription: {
    id: 'Used for programmatic access to the fieldset.',
    defaultMessage: 'Used for programmatic access to the fieldset.',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
  delete: {
    id: 'Delete',
    defaultMessage: 'Delete',
  },
});

/**
 * WysiwygWidget container class.
 * @class WysiwygWidget
 * @extends Component
 */
class WysiwygWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    /**
     * Id of the field
     */
    id: PropTypes.string.isRequired,
    /**
     * Title of the field
     */
    title: PropTypes.string.isRequired,
    /**
     * Description of the field
     */
    description: PropTypes.string,
    /**
     * True if field is required
     */
    required: PropTypes.bool,
    /**
     * Value of the field
     */
    value: PropTypes.shape({
      /**
       * Content type of the value
       */
      'content-type': PropTypes.string,
      /**
       * Data of the value
       */
      data: PropTypes.string,
      /**
       * Encoding of the value
       */
      encoding: PropTypes.string,
    }),
    /**
     * List of error messages
     */
    error: PropTypes.arrayOf(PropTypes.string),
    /**
     * On change handler
     */
    onChange: PropTypes.func,
    /**
     * On delete handler
     */
    onDelete: PropTypes.func,
    /**
     * On edit handler
     */
    onEdit: PropTypes.func,
    /**
     * Wrapped form component
     */
    wrapped: PropTypes.bool,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    value: null,
    error: [],
    onEdit: null,
    onDelete: null,
    onChange: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygWidget
   */
  constructor(props) {
    super(props);

    const slateValue =  JSON.parse(props.value?.data || JSON.stringify([
      {
        children: [
          { text: ' ' },
        ],
     }
    ]));
    this.state = {value: slateValue};
    this.editor = withHistory(withReact(createEditor()));

    this.onChange = this.onChange.bind(this);
  }

  /**
   * Change handler
   * @method onChange
   * @param {object} editorState Editor state.
   * @returns {undefined}
   */
  onChange(id, newValue) {
    this.setState({ value: newValue});
    this.props.onChange(id, JSON.stringify(newValue));
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const {
      id,
      title,
      description,
      required,
      value,
      error,
      fieldSet,
    } = this.props;

    if (__SERVER__) {
      return (
        <Form.Field
          inline
          required={required}
          error={error.length > 0}
          className={description ? 'help' : ''}
          id={`${fieldSet || 'field'}-${id}`}
        >
          <div className="wrapper">
            <label htmlFor={`field-${id}`}>{title}</label>
            <TextArea id={id} name={id} value={value ? value.data : ''} />
            {description && <p className="help">{description}</p>}
            {map(error, (message) => (
              <Label key={message} basic color="red" pointing>
                {message}
              </Label>
            ))}
          </div>
        </Form.Field>
      );
    }

    return (
      <FormFieldWrapper {...this.props} className="wysiwyg">
        <div style={{ boxSizing: 'initial' }}>
          {this.props.onChange ? (
            <>
              <SlateRichTextWidget
                id={this.props.id}
                onChange={this.onChange}
                value={this.state.value}
                focus={false}
              ></SlateRichTextWidget>
            </>
          ) : (
            <div className="DraftEditor-root" />
          )}
        </div>
      </FormFieldWrapper>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      token: state.userSession.token,
    }),
    {},
  ),
)(WysiwygWidget);
