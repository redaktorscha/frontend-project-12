import React from 'react';
import { useSelector } from 'react-redux';
import { Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AddMessageForm from './AddMessageForm';
import { selectors as channelSelectors } from '../../../slices/channelsSlice.js';
import { selectors as messagesSelectors } from '../../../slices/messagesSlice.js';

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

const Messages = ({ currentChannelMessages }) => (
  <div className="d-flex flex-column w-100 overflow-auto px-5 flex-grow-1">
    {
        currentChannelMessages.length > 0
          ? currentChannelMessages
            .map(({ username, body, id }) => (<Message key={id} text={body} username={username} />))
          : null
}
  </div>
);

const Main = () => {
  const { t } = useTranslation();
  const currentChannelId = useSelector((state) => state.currentChannel) || null;
  const currentChannel = useSelector((state) => channelSelectors
    .selectById(state, currentChannelId)) || null;
  const messages = useSelector(messagesSelectors.selectAll) || null;
  const currentChannelMessages = messages
    ? messages.filter(({ channelId }) => channelId === currentChannelId)
    : null;
  const messagesCount = currentChannelMessages?.length ?? 0;

  return (
    <Col className="col p-0 h-100 d-flex flex-column">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            #
            {' '}
            {currentChannel?.name}
          </b>
        </p>
        <span className="text-muted">
          {messagesCount}
          {' '}
          {t('ui.chat.messagesCount')}
        </span>
      </div>
      <Messages currentChannelMessages={currentChannelMessages} />
      <div className="p-3">
        <AddMessageForm t={t} currentChannelId={currentChannelId} />
      </div>
    </Col>
  );
};
export default Main;
