// ts-check
import {
  Button, ButtonGroup, Nav, Dropdown,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectors as channelSelectors, actions as channelActions } from '../slices/channelsSlice.js';

const ChannelButton = ({ color, onClick, channelName }) => (
  <Button
    variant={color}
    type="button"
    className="w-100 rounded-0 text-start text-truncate"
    onClick={onClick}
  >
    <span className="me-1">#</span>
    {channelName}
  </Button>
);

const Channel = ({
  t, onClick, color, channelName, hasDropDown, handleOpenModal,
}) => {
  const NavPill = (
    <ChannelButton color={color} onClick={onClick} channelName={channelName} />
  );

  return (
    <Nav.Item as="li" className="w-100" tabIndex={-1}>
      {hasDropDown ? (
        <Dropdown as={ButtonGroup} className="w-100">
          {NavPill}
          <Dropdown.Toggle className="flex-grow-0" split variant={color}>
            <span className="visually-hidden">{t('ui.chat.channelControl')}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item role="button" onClick={handleOpenModal('delete', channelName)}>{t('ui.chat.delete')}</Dropdown.Item>
            <Dropdown.Item role="button" onClick={handleOpenModal('rename', channelName)}>{t('ui.chat.rename')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : NavPill}
    </Nav.Item>
  );
};

const ChannelsList = ({ handleOpenModal }) => {
  const { setCurrentChannelId } = channelActions;
  const channels = useSelector(channelSelectors.selectAll) || [];
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const dispatch = useDispatch();
  const setChannel = (channelId) => () => dispatch(setCurrentChannelId({
    currentChannelId: channelId,
  }));
  const { t } = useTranslation();

  return (
    <div className="h-100 overflow-auto">
      <Nav
        as="ul"
        variant="pills"
        className="flex-column px-2 w-100"
      >
        {channels.map(({ id, name, removable }) => {
          const color = id === currentChannelId ? 'secondary' : 'light';

          return (
            <Channel
              t={t}
              handleOpenModal={handleOpenModal}
              onClick={setChannel(id)}
              key={id}
              color={color}
              channelName={name}
              hasDropDown={removable}
            />
          );
        })}
      </Nav>
    </div>

  );
};

export default ChannelsList;
