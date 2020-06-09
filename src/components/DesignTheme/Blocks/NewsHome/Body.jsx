import React from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Chip,
  Card,
  CardCategory,
  CardBody,
  CardText,
  CardTitle,
  CardReadMore,
} from 'design-react-kit/dist/design-react-kit';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import moment from 'moment';

const Body = ({ content, pathname }) => {
  console.log(content);
  return (
    <Row>
      {content.image && (
        <Col lg={{ size: 6, offset: 1, order: 2 }}>
          <img
            src={content.image.scales.large.download}
            title={content.title}
            alt={content.title}
            className="item-image"
          />
        </Col>
      )}
      <Col lg={{ size: 5, order: 1 }}>
        <Card>
          <CardBody className="pb-2">
            <CardCategory date={moment(content.effective).format('ll')}>
              Notizie
            </CardCategory>
            <CardTitle tag="h2">
              <Link to={flattenToAppURL(content['@id'])}>{content.title}</Link>
            </CardTitle>
            <CardText>{content.description}</CardText>
            <div className="flex">
              {content.tassonomia_argomenti?.map((arg) => (
                <Chip simple color="primary" key={arg.token}>
                  <Link to="#" className="chip-label">
                    {arg.title}
                  </Link>
                </Chip>
              ))}
            </div>
            <CardReadMore
              tag={Link}
              iconName="it-arrow-right"
              text="Vedi tutte le notizie"
              to="#"
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Body.propTypes = {
  content: PropTypes.objectOf(PropTypes.any),
  pathname: PropTypes.string,
};

export default Body;
