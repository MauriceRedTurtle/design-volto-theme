/**
 * Edit icons block.
 * @module components/manage/Blocks/Title/Edit
 */

import React from 'react';
import EditBlock from './Block/EditBlock';
import { Grid } from 'semantic-ui-react';
import {
  Container,
  Card,
  CardBody,
  Button,
  Row,
  Col,
  Alert,
} from 'design-react-kit/dist/design-react-kit';
import {
  withDNDContext,
  SubblocksEdit,
  SubblocksWrapper,
} from '@italia/addons/volto-subblocks';

import { SidebarPortal } from '@plone/volto/components';
import Sidebar from './Sidebar.jsx';

import { defineMessages } from 'react-intl';

const messages = defineMessages({
  addField: {
    id: 'Add field',
    defaultMessage: 'Aggiungi un campo',
  },
  default_submit_label: {
    id: 'form_default_submit_label',
    defaultMessage: 'Invia',
  },
  warning: {
    id: 'form_edit_warning',
    defaultMessage: 'Attenzione!',
  },
  warning_from: {
    id: 'form_edit_warning_from',
    defaultMessage:
      'Inserire un campo di tipo "E-mail mittente". Se non è presente, oppure è presente ma non viene compilato dall\'utente, l\'indirizzo del mittente della mail sarà quello configurato dalla sidebar di destra.',
  },
});
/**
 * Edit icons block class.
 * @class Edit
 * @extends Component
 */
class Edit extends SubblocksEdit {
  componentDidMount() {
    super.componentDidMount();

    if (!this.props.data.default_from) {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        default_from: 'noreply@plone.org',
        lastChange: new Date().getTime(),
      });
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */

  render() {
    if (__SERVER__) {
      return <div />;
    }

    return (
      <div className="public-ui">
        <div className="px-4 py-5">
          <Card
            className="card-bg rounded py-3"
            noWrapper={false}
            space
            tag="div"
          >
            <CardBody tag="div">
              <SubblocksWrapper node={this.node}>
                {/*this.state.subblocks.filter((s) => s.field_type === 'from')
                  .length == 0 && (
                  <Alert color="warning" fade isOpen tag="div">
                    <h4>{this.props.intl.formatMessage(messages.warning)}</h4>
                    <p>
                      {this.props.intl.formatMessage(messages.warning_from)}
                    </p>
                  </Alert>
                )*/}

                {this.state.subblocks.map((subblock, subindex) => (
                  <div className="form-field" key={subblock.id}>
                    <EditBlock
                      data={subblock}
                      index={subindex}
                      selected={this.isSubblockSelected(subindex)}
                      {...this.subblockProps}
                      openObjectBrowser={this.props.openObjectBrowser}
                    />
                  </div>
                ))}

                {this.props.selected && (
                  <div className="form-field">
                    {this.renderAddBlockButton(
                      this.props.intl.formatMessage(messages.addField),
                    )}
                  </div>
                )}

                <Row>
                  <Col align="center">
                    <Button color="primary">
                      {this.props.data.submit_label ||
                        this.props.intl.formatMessage(
                          messages.default_submit_label,
                        )}
                    </Button>
                  </Col>
                </Row>
              </SubblocksWrapper>
            </CardBody>
          </Card>
        </div>

        <SidebarPortal selected={this.props.selected || false}>
          <Sidebar
            {...this.props}
            data={this.props.data}
            block={this.props.block}
            onChangeBlock={this.props.onChangeBlock}
            onChangeSubBlock={this.onChangeSubblocks}
            selected={this.state.subIndexSelected}
            setSelected={this.onSubblockChangeFocus}
            openObjectBrowser={this.props.openObjectBrowser}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default React.memo(withDNDContext(Edit));
