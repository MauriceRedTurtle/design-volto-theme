/**
 * EventoView view component.
 * @module components/theme/View/EventoView
 */

import React, { useState, createRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import { searchContent, resetSearchContent } from '@plone/volto/actions';

import {
  Attachments,
  Gallery,
  Events,
  WideImage,
  SideMenu,
  HelpBox,
  PageHeader,
  RichTextArticle,
  Metadata,
  OfficeCard,
  GenericCard,
  Dates,
  TextOrBlocks,
  EventLocations,
  Sponsors,
  RelatedItems,
} from '@italia/components/ItaliaTheme/View';
import { Link } from 'react-router-dom';
import { flattenToAppURL } from '@plone/volto/helpers';
import {
  Icon,
  Chip,
  ChipLabel,
  Card,
  CardBody,
  CardTitle,
} from 'design-react-kit/dist/design-react-kit';
import { useDispatch, useSelector } from 'react-redux';

const messages = defineMessages({
  notizie_in_evidenza: {
    id: 'notizie_in_evidenza',
    defaultMessage: 'Notizie in evidenza',
  },

  event_ulteriori_informazioni: {
    id: 'event_ulteriori_informazioni',
    defaultMessage: "Ulteriori informazioni sull'evento",
  },
  date_e_orari: {
    id: 'date_e_orari',
    defaultMessage: 'Date e orari',
  },
  parteciperanno: {
    id: 'parteciperanno',
    defaultMessage: 'Parteciperanno:',
  },
  luoghi: {
    id: 'luogo',
    defaultMessage: 'Luogo',
  },
  contatti_interni: {
    id: 'contatti_interni',
    defaultMessage: 'Contatti interni',
  },
  contatti_esterni: {
    id: 'contatti_esterni',
    defaultMessage: 'Contatti esterni',
  },
  ulteriori_informazioni: {
    id: 'ulteriori_informazioni',
    defaultMessage: "Box d'aiuto",
  },
  patrocinato_da: {
    id: 'patrocinato_da',
    defaultMessage: 'Patrocinato da:',
  },
  event_url: {
    id: 'event_url',
    defaultMessage: "Url dell'evento",
  },
  event_destinatari: {
    id: 'event_destinatari',
    defaultMessage: "L'evento è di interesse per:",
  },
  strutture_politiche: {
    id: 'event_strutture_politiche',
    defaultMessage: 'Strutture politiche coinvolte',
  },
  supported_by: {
    id: 'supported_by',
    defaultMessage: 'Con il supporto di:',
  },
});

/**
 * EventoView view component class.
 * @function EventoView
 * @params {object} content Content object.
 * @returns {string} Markup of the component.
 */
const EventoView = ({ content, location }) => {
  const intl = useIntl();
  const text = <TextOrBlocks content={content} location={location} />;
  const isChildEvent = content?.parent['@type'] === 'Event';
  const events_path = isChildEvent
    ? content?.parent['@id']?.split('/').splice(-1)[0]
    : content?.['@id'].split('/').splice(-1)[0];
  let documentBody = createRef();
  const [sideMenuElements, setSideMenuElements] = useState(null);

  useEffect(() => {
    if (documentBody.current) {
      if (__CLIENT__) {
        setSideMenuElements(documentBody.current);
      }
    }
  }, [documentBody]);

  const folder_name = 'sponsor_evento';
  const url = `${flattenToAppURL(content['@id'])}/${folder_name}`;
  const searchResults = useSelector((state) => state.search.subrequests);
  const dispatch = useDispatch();
  const sponsors = searchResults?.[folder_name]?.items || [];

  useEffect(() => {
    if (content?.items.some((e) => e.id === folder_name)) {
      dispatch(
        searchContent(
          url,
          {
            'path.depth': 1,
            sort_on: 'getObjPositionInParent',
            metadata_fields: '_all',
            fullobjects: true,
          },
          folder_name,
        ),
      );
    }
    return () => {
      dispatch(resetSearchContent(folder_name));
    };
  }, [dispatch, content, url, folder_name]);

    return (
      <>
        <div className="container px-4 my-4 newsitem-view">
          <PageHeader
            content={content}
            readingtime={null}
            showreadingtime={true}
            imageinheader={false}
            imageinheader_field={null}
            showdates={true}
            showtopics={true}
            showtassonomiaargomenti={true}
          />
          {(content?.image || content?.image_caption) && (
            <WideImage
              title={content?.title}
              image={content?.image}
              caption={content?.image_caption}
            />
          )}
          <div className="row border-top row-column-border row-column-menu-left">
            <aside className="col-lg-4">
              {__CLIENT__ && <SideMenu data={sideMenuElements} />}
            </aside>
            <section
              ref={documentBody}
              className="col-lg-8 it-page-sections-container"
            >
              <article
                id="text-body"
                className="it-page-section anchor-offset clearfix"
              >
                <div className="text-serif">
                  {text}
                </div>
              </article>

              {content?.items.some((e) => e.id === 'multimedia') && (
                <article
                  id="galleria"
                  className="it-page-section anchor-offset mt-5"
                >
                  <Gallery content={content} folder_name={'multimedia'} />
                </article>
              )}
              {content?.descrizione_destinatari?.data && (
                <RichTextArticle
                  content={content?.descrizione_destinatari?.data}
                  tag_id="descrizione-destinatari"
                  title={intl.formatMessage(messages.event_destinatari)}
                  title_size="h6"
                  add_class="mb-5"
                />
              )}
              {content?.persone_amministrazione?.length > 0 && (
                <>
                  <h6 className="text-serif font-weight-bold">
                    {intl.formatMessage(messages.parteciperanno)}
                  </h6>
                  {content.persone_amministrazione.map((item, i) => (
                    <Chip
                      color="primary"
                      disabled={false}
                      large={false}
                      simple
                      tag="div"
                      key={item['@id']}
                      className="mr-2"
                    >
                      <ChipLabel tag="span">
                        <Link to={flattenToAppURL(item['@id'])}>
                          {item.title}
                        </Link>
                      </ChipLabel>
                    </Chip>
                  ))}
                </>
              )}

              {content?.luoghi_correlati?.length > 0 ? (
                <article
                  id="luoghi"
                  className="it-page-section anchor-offset mt-5"
                >
                  <h4 id="header-luoghi">
                    {intl.formatMessage(messages.luoghi)}
                  </h4>
                  <EventLocations
                    locations={content?.luoghi_correlati}
                    show_icon={true}
                  />
                </article>
              ) : null}

              <article
                id="date-e-orari"
                className="it-page-section anchor-offset mt-5"
              >
                <h4 id="header-date-e-orari">
                  {intl.formatMessage(messages.date_e_orari)}
                </h4>
                <Dates content={content} />
                {content?.orari?.data?.replace(/(<([^>]+)>)/g, '') && (
                  <RichTextArticle
                    content={content?.orari?.data}
                    tag_id="date-e-orari"
                    title={null}
                  />
                )}
              </article>

              {content?.prezzo?.data?.replace(/(<([^>]+)>)/g, '') && (
                <RichTextArticle
                  content={content?.prezzo?.data}
                  tag_id="costi"
                  title={'Costi'}
                />
              )}

              {content?.items?.some((e) => e.id === 'documenti') && (
                <Attachments
                  content={content}
                  folder_name={'documenti'}
                  title={'Documenti'}
                />
              )}
              {content?.organizzato_da_esterno?.data?.replace(
                /(<([^>]+)>)/g,
                '',
              ) ? (
                <article
                  className="it-page-section anchor-offset mt-5"
                  id="contatti"
                >
                  <h4 id="header-contatti">
                    {intl.formatMessage(messages.contatti_esterni)}
                  </h4>
                  <Card
                    className="card card-teaser rounded shadow mt-3"
                    noWrapper={true}
                    tag="div"
                  >
                    <CardTitle tag="h5">
                      <Icon icon="it-telephone" padding={true} />
                    </CardTitle>
                    <CardBody tag="div" className={'card-body pr-3'}>
                      <p
                        className='text-serif'
                        dangerouslySetInnerHTML={{ __html: content.organizzato_da_esterno?.data }}
                      />
                      {content?.contatto_reperibilita && (
                        <p className="card-text mt-3">
                          {content?.contatto_reperibilita?.replace(
                            /(<([^>]+)>)/g,
                            '',
                          )}
                        </p>
                      )}
                    </CardBody>
                  </Card>
                </article>
              ) : null}

              {content?.organizzato_da_interno?.length > 0 ? (
                <article
                  className="it-page-section anchor-offset mt-5"
                  id="contatti-interno"
                >
                  <h4 id="header-contatti-interno">
                    {intl.formatMessage(messages.contatti_interni)}
                  </h4>
                  {content?.organizzato_da_interno?.map((item, index) => (
                    <OfficeCard
                      margin_bottom={index < content?.organizzato_da_interno?.length - 1}
                      key={item['@id']}
                      office={item}
                      extended={true}
                      icon={'it-telephone'}
                    >
                      {content?.contatto_reperibilita && (
                        <p className="card-text mt-3">
                          {content?.contatto_reperibilita?.replace(
                            /(<([^>]+)>)/g,
                            '',
                          )}
                        </p>
                      )}
                    </OfficeCard>
                  ))}
                </article>
              ) : null}

              {content?.evento_supportato_da?.length > 0 && (
                <>
                  <h5 className="mt-4 supported-by">Con il supporto di:</h5>
                  {content?.evento_supportato_da?.map((item) => (
                    <OfficeCard
                      key={item['@id']}
                      office={item}
                      extended={true}
                      icon={'it-pa'}
                    />
                  ))}
                </>
              )}

              {content && (
                <Events
                  content={content}
                  show_image={true}
                  title={null}
                  folder_name={events_path}
                  isChild={isChildEvent}
                />
              )}
              {content?.ulteriori_informazioni?.data?.replace(
                /(<([^>]+)>)/g,
                '',
              ) !== '' ||
              content?.event_url ||
              content?.patrocinato_da ||
              sponsors?.length > 0 ? (
                <article
                  id={'ulteriori-informazioni'}
                  className="it-page-section anchor-offset mt-5"
                >
                  <h4 id={`header-ulteriori-informazioni`}>
                    {intl.formatMessage(messages.event_ulteriori_informazioni)}
                  </h4>

                  {content?.ulteriori_informazioni?.data?.replace(
                    /(<([^>]+)>)/g,
                    '',
                  ) && (
                    <div
                      className="text-serif"
                      dangerouslySetInnerHTML={{
                        __html: content?.ulteriori_informazioni?.data,
                      }}
                    />
                  )}

                  {content?.event_url && (
                    <div class="mt-4">
                      <strong>{intl.formatMessage(messages.event_url)}:</strong>{' '}
                      <a href={content.event_url} rel="noopener noreferer">
                        {content.event_url}
                      </a>
                    </div>
                  )}

                  {content?.patrocinato_da && (
                    <div class="mt-4">
                      <strong>
                        {intl.formatMessage(messages.patrocinato_da)}
                      </strong>
                      <div
                        className="text-serif"
                        dangerouslySetInnerHTML={{
                          __html: content?.patrocinato_da,
                        }}
                      />
                    </div>
                  )}

                  {content?.items?.some((e) => e.id === 'sponsor_evento') && sponsors &&  (
                    <div className="mt-4">
                      <Sponsors sponsors={sponsors} />
                    </div>
                  )}
                </article>
              ) : null}

              {content?.strutture_politiche.length > 0 && (
                <article
                  id="strutture_politiche"
                  className="it-page-section anchor-offset mt-5"
                >
                  <h4>{intl.formatMessage(messages.strutture_politiche)}</h4>
                  <div className="card-wrapper card-teaser-wrapper card-teaser-wrapper-equal">
                    {content.strutture_politiche.map((item, i) => (
                      <GenericCard
                        key={i}
                        index={item['@id']}
                        item={item}
                        showimage={false}
                      />
                    ))}
                  </div>
                </article>
              )}
              {content?.relatedItems?.length > 0 ? (
                <article
                  id="related-items"
                  className="it-page-section anchor-offset mt-5"
                >
                  <h4>{intl.formatMessage(messages.related_items)}</h4>
                  <div className="card-wrapper card-teaser-wrapper card-teaser-wrapper-equal">
                    {content.relatedItems.map((item, i) => (
                      <GenericCard
                        key={i}
                        index={item['@id']}
                        item={item}
                        showimage={false}
                      />
                    ))}
                  </div>
                </article>
              ) : null}
              <Metadata content={content}>
                {content?.ulteriori_informazioni?.data?.replace(
                  /(<([^>]+)>)/g,
                  '',
                ) && <HelpBox text={content?.ulteriori_informazioni} />}
              </Metadata>
            </section>
          </div>
        </div>
        {/* <section id="contenuti-correlati"></section> */}
      </>
    );
  };

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
EventoView.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    effective: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,

    patrocinato_da: PropTypes.string,
    image: PropTypes.object,
    image_caption: PropTypes.string,
    orari: PropTypes.shape({
      data: PropTypes.string,
    }),
    prezzo: PropTypes.shape({
      data: PropTypes.string,
    }),
    organizzato_da_esterno: PropTypes.shape({
      data: PropTypes.string,
    }),

    descrizione_destinatari: PropTypes.shape({
      data: PropTypes.string,
    }),

    ulteriori_informazioni: PropTypes.shape({
      data: PropTypes.string,
    }),
    sponsor: PropTypes.shape({
      data: PropTypes.string,
    }),
    items: PropTypes.array,
    strutture_politiche: PropTypes.array,
    evento_supportato_da: PropTypes.array,
    organizzato_da_interno: PropTypes.array,
    persone_amministrazione: PropTypes.array,
    modified: PropTypes.string,
    luoghi_evento: PropTypes.array,
    related_news: PropTypes.array,
    tassonomia_argomenti: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        token: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export default EventoView;
