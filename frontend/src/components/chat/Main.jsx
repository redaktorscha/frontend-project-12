import React from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AddMessageForm from './AddMessageForm';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { selectors as messagesSelectors } from '../../slices/messagesSlice.js';
import useResponsiveWidth from '../../hooks/useResponsiveWidth';

const Message = (props) => {
  const { username, text } = props;
  return (
    <div className="text-break mb-2">
      <b>{username}</b>
      {': '}
      {text}
    </div>
  );
};

const Messages = ({ currentChannelMessages }) => {
  const { isMobile } = useResponsiveWidth();
  return (
    <div className={`d-flex flex-column h-100 w-100 overflow-auto ${isMobile ? 'px-3 max-height-60' : 'px-5 max-height-70'}`}>
      {
        currentChannelMessages.length > 0
          ? currentChannelMessages
            .map(({ username, body, id }) => (<Message key={id} text={body} username={username} />))
          : null
}
    </div>
  );
};

const Main = () => {
  const { t } = useTranslation();
  const currentChannelId = useSelector((state) => state.channels.currentChannelId) || null;
  const currentChannel = useSelector((state) => channelSelectors
    .selectById(state, currentChannelId)) || null;
  const messages = useSelector(messagesSelectors.selectAll) || [];
  const currentChannelMessages = messages.filter(({ channelId }) => channelId === currentChannelId);
  const messagesCount = currentChannelMessages?.length ?? 0;

  return (
    <Col className="p-0 h-100 d-flex flex-column">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0 text-truncate">
          <b>
            #
            {' '}
            {currentChannel?.name}
          </b>
        </p>
        <span className="text-muted">
          {t('ui.chat.messagesCount.key', { count: messagesCount })}
        </span>
      </div>
      <Messages currentChannelMessages={currentChannelMessages} />
      <div className="p-3 mt-auto">
        <AddMessageForm t={t} currentChannelId={currentChannelId} />
      </div>
    </Col>
  );
};
export default Main;
