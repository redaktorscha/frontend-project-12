// ts-check
import {
  Button, ButtonGroup, Nav, Dropdown,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectors as channelSelectors } from '../../../slices/channelsSlice.js';
import { setCurrentChannel } from '../../../slices/currentChannelSlice.js';

const ChannelButton = ({ color, onClick, channelName }) => (
  <Button
    variant={color}
    type="button"
    className="w-100 rounded-0 text-start text-truncate"
    onClick={onClick}
    tabIndex={0}
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
          <Dropdown.Toggle className="flex-grow-0" split variant={color} />
          <span className="visually-hidden">{t('ui.chat.channelControl')}</span>
          <Dropdown.Menu>
            <Dropdown.Item role="button" tabIndex={0} onClick={handleOpenModal('delete', channelName)}>{t('ui.chat.delete')}</Dropdown.Item>
            <Dropdown.Item role="button" tabIndex={0} onClick={handleOpenModal('rename', channelName)}>{t('ui.chat.rename')}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ) : NavPill}
    </Nav.Item>
  );
};

const ChannelsList = ({ handleOpenModal }) => {
  const channels = useSelector(channelSelectors.selectAll) || null;
  const currentChannelId = useSelector((state) => state.currentChannel);
  const dispatch = useDispatch();
  const setChannel = (channelId) => () => dispatch(setCurrentChannel(channelId));
  const { t } = useTranslation();

  return (
    <Nav
      as="ul"
      variant="pills"
      className="h-100 flex-column justify-content-start px-2 w-100 overflow-auto"
      style={{ maxHeight: '95%' }}
    >
      {channels && channels.map(({ id, name, removable }) => {
        const color = id === currentChannelId ? 'secondary' : 'light';

        return (
          <Channel
            t={t}
            handleOpenModal={handleOpenModal}
            onClick={setChannel(id)}
            key={`${id}`}
            color={color}
            channelName={name}
            hasDropDown={removable}
          />
        );
      })}
    </Nav>
  );
};

export default ChannelsList;
