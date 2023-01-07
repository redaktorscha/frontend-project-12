// ts-check
import {
  Button, ButtonGroup, Nav, Dropdown,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import uniqueId from 'lodash/uniqueId';
import { selectors as channelSelectors } from '../../../slices/channelsSlice.js';
import { setCurrentChannel } from '../../../slices/currentChannelSlice.js';

const ChannelButton = ({ color, onClick, channelName }) => (
  <Button
    variant={color}
    type="button"
    className="w-100 rounded-0 text-start text-truncate"
    onClick={onClick}
  >
    {`# ${channelName}`}

  </Button>
);

const Channel = ({
  t, onClick, color, channelName, hasDropDown, handleOpenModal,
}) => (
  <Nav.Item as="li" className="w-100">
    {hasDropDown ? (
      <Dropdown as={ButtonGroup} className="w-100">
        <ChannelButton color={color} onClick={onClick} channelName={channelName} />
        <Dropdown.Toggle split variant={color} id="dropdown-split-basic" />
        <Dropdown.Menu>
          <Dropdown.Item role="button" onClick={handleOpenModal('delete', channelName)}>{t('ui.chat.delete')}</Dropdown.Item>
          <Dropdown.Item role="button" onClick={handleOpenModal('rename', channelName)}>{t('ui.chat.rename')}</Dropdown.Item>
        </Dropdown.Menu>

      </Dropdown>
    ) : (
      <ChannelButton color={color} onClick={onClick} channelName={channelName} />
    )}
  </Nav.Item>
);

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
      fill
      className="px-2 overflow-auto nav-stacked py-4 "
    >
      {channels && channels.map(({ id, name, removable }) => {
        const color = id === currentChannelId ? 'secondary' : '';

        return (
          <Channel
            t={t}
            handleOpenModal={handleOpenModal}
            onClick={setChannel(id)}
            key={uniqueId()} // id
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
